
import { UserInput, Results, ScenarioResult, Domain, DecisionType } from '../types';
import { PRIORS, SUPPORT_MOD_MAP, BUFFER_MOD_RISK_MAP, DEPENDENTS_MAP, DOMAINS } from '../constants';
import { clamp } from '../utils/helpers';

/**
 * CALCULATION SERVICE - Multi-Criteria Decision Analysis (MCDA) Engine
 * 
 * This service implements a sophisticated decision analysis model that combines:
 * 1. Multi-criteria utility theory (5 life domains)
 * 2. Hyperbolic temporal discounting
 * 3. Prospect theory (asymmetric risk preferences)
 * 4. Regret theory (irreversibility penalty)
 * 5. Contextual modifiers (health, social support, financial buffer, dependents)
 * 
 * Model Flow:
 * - Start with domain-specific "priors" (expected impacts for decision type)
 * - Apply maturity factor (decisions take time to unfold)
 * - Apply temporal discount (more distant outcomes matter less)
 * - Apply scenario noise (conservative/likely/expansive scenarios)
 * - Apply domain-specific modifiers (health, support, financial buffer)
 * - Aggregate into multi-criteria utility using value weights
 * - Apply prospect theory (risk adjustment + loss aversion)
 * - Apply regret adjustment (penalize irreversible decisions)
 * - Clamp utility to 0-100 scale
 */

/**
 * Approximates normal distribution quantiles for P25 and P75.
 * Used to model uncertainty scenarios: conservative (P25), likely (P50), expansive (P75)
 * Based on standard normal distribution: Φ^(-1)(0.25) ≈ -0.6745, Φ^(-1)(0.75) ≈ 0.6745
 */
const approxNormalQuantile = (p: number) => {
    if (p < 0.5) return -0.6745;  // P25: lower tail (~25th percentile)
    if (p > 0.5) return 0.6745;   // P75: upper tail (~75th percentile)
    return 0;                       // P50: median
};

const calculateScenario = (userInput: UserInput, scenario: 'conservador' | 'provavel' | 'expansivo'): ScenarioResult => {
    const t = userInput.decision_horizon_months;
    
    // ===== AGE-BASED ADJUSTMENT =====
    // Calculate years until reaching target age
    // This contextualizes the decision within the user's life timeline
    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - userInput.birth_year;
    const yearsToTargetAge = userInput.target_age - currentAge;
    
    // Age context factor: closer to target age = more urgency/relevance
    // At target age: ageContextFactor = 1.0
    // Far from target age: ageContextFactor = 0.7 (less impact)
    // Formula: 0.7 + 0.3 * (yearsToTargetAge - t/12) / yearsToTargetAge
    const yearsToHorizon = t / 12;
    const ageContextFactor = Math.min(1.0, 0.7 + 0.3 * Math.max(0, yearsToTargetAge - yearsToHorizon) / Math.max(1, yearsToTargetAge));

    // ===== STEP 1: Temporal Factors =====
    // Maturity Factor M(t): How quickly outcomes materialize
    // Range: 0 (at t=0, no time to see results) → 1 (at t=24+ months, results are clear)
    // Linear scale: outcomes become relevant after ~2 years
    const maturityFactor = Math.min(1, t / 24);

    // Temporal Discount D(t): Hyperbolic discounting function
    // Reflects psychological impatience: distant outcomes feel less important
    // Formula: D(t) = 1 / (1 + k*t) where k is impatience parameter
    // - k ≈ 0.001 (patient, k_base=0.001) + user preference (0.019 * impatience%)
    // - At t=12 months, impatience=50% → D(12) ≈ 0.95 (5% discount)
    // - At t=60 months, same user → D(60) ≈ 0.75 (25% discount)
    const k = 0.001 + 0.019 * (userInput.time_discount_0_100 / 100);
    const discountFactor = 1 / (1 + k * t);

    // ===== STEP 2: Contextual Modifiers =====
    // Health Modifier: Users with better health can tolerate more risk
    // Range: 0.9 (health=1) → 1.15 (health=5)
    // Formula: 0.9 + 0.05 * health_rating
    const healthMod = 0.9 + 0.05 * userInput.self_rated_health_1_5;

    // Support Network Modifier: Larger support networks reduce perceived risk
    // Predefined bands: 0 people→0.95, 1-3→1.00, 4-7→1.03, 8+→1.06
    // Creates small positive uplift for social capital
    const supportMod = SUPPORT_MOD_MAP[userInput.support_network_band];

    // Financial Buffer & Dependents Modifiers
    const dependentsCount = DEPENDENTS_MAP[userInput.dependents_count];
    // Dependents increase financial domain impact: +3% per dependent
    const dependentsModFinancas = 1 + 0.03 * Math.min(dependentsCount, 3);
    // Financial buffer reduces perceived risk: buffer >6mo→1.00, <1mo→1.15
    // Higher buffer = can absorb decision reversals better
    const bufferModRisco = BUFFER_MOD_RISK_MAP[userInput.financial_buffer_band];

    // ===== STEP 3: Scenario Noise Generation =====
    // Sigma (σ): Base volatility of impacts
    // - Risk-averse users (0%) → σ ≈ 12 (high uncertainty)
    // - Risk-neutral users (50%) → σ ≈ 8
    // - Risk-seeking users (100%) → σ ≈ 4 (perceive less uncertainty)
    // Interpretation: risk-averse see outcomes as less certain
    const sigma_base = 4 + 8 * (1 - userInput.risk_tolerance_0_100 / 100);
    
    // Scale noise by time: sqrt(t/60) makes scenarios diverge more over longer horizons
    const timeScale = Math.sqrt(Math.min(t, 60) / 60);
    
    // Scenario shift: Conservative scenario gets -0.6745σ, Expansive gets +0.6745σ, Likely gets 0
    // This creates a distribution of plausible outcomes
    const scenarioShiftMultiplier = scenario === 'conservador' ? approxNormalQuantile(0.25) : scenario === 'expansivo' ? approxNormalQuantile(0.75) : 0;

    // ===== STEP 4: Domain-Specific Impact Calculation =====
    // Get domain priors (baseline expectations) for this decision type
    // Example: Career change → financas +12, saude -3, relacoes -1, tempo_autonomia +6, proposito +8
    // Priors are calibrated per decision category (see constants.ts PRIORS)
    const baseImpacts = PRIORS[userInput.decision_type];
    const adjustedImpacts: Record<Domain, number> = {} as Record<Domain, number>;

    for (const domain of DOMAINS) {
        // Add scenario-specific noise: epsilon = scenario_shift × σ × timeScale
        const epsilon = scenarioShiftMultiplier * sigma_base * timeScale;
        let impact = baseImpacts[domain] + epsilon;
        
        // Discount future impacts by maturity and time
        impact *= maturityFactor;
        impact *= discountFactor;
        
        // Apply age context factor: impacts are more relevant closer to target age
        impact *= ageContextFactor;
        
        // Apply domain-specific contextual modifiers
        if (domain === 'saude_energia') impact *= healthMod;
        if (domain === 'relacoes') impact *= supportMod;
        if (domain === 'proposito_aprendizado') impact *= (0.98 + 0.02 * (supportMod / 1.00));
        if (domain === 'financas') impact *= dependentsModFinancas;

        adjustedImpacts[domain] = impact;
    }
    
    // ===== STEP 5: Multi-Criteria Aggregation =====
    // Convert raw impacts to utility scores (0-100) and aggregate with weights
    // Baseline: 50 (neutral). Impacts shift utility around baseline.
    // Example: financas_impact=+8 → financas_score = 50+8=58
    const domainScoresA = {} as Record<Domain, number>;
    let uBrutaA = 0;
    for (const domain of DOMAINS) {
        // Clamp domain score to [0, 100]
        domainScoresA[domain] = clamp(50 + adjustedImpacts[domain], 0, 100);
        
        // Weighted average: multiply by user's value weight for this domain
        const weight = userInput.value_weights[domain] / 100;
        uBrutaA += weight * domainScoresA[domain];
    }
    // Option B (status quo) is neutral across all domains = 50
    const uBrutaB = 50;
    
    // ===== STEP 6: Prospect Theory (Risk Adjustment) =====
    // Reference point-dependent value function capturing loss aversion
    // Key insight: losses loom larger than gains (λ > 1)
    // Parameterized by risk tolerance:
    // - Risk-averse (0%): α=0.6 (concave gains), λ=1.8 (steep loss aversion)
    // - Risk-neutral (50%): α=0.8, λ=1.4
    // - Risk-seeking (100%): α=1.0 (linear), λ=1.0 (no loss aversion)
    const alpha = 0.6 + 0.4 * (userInput.risk_tolerance_0_100 / 100);
    const lambda = 1.8 - 0.8 * (userInput.risk_tolerance_0_100 / 100);
    
    // Calculate utility difference
    const gainLoss = uBrutaA - uBrutaB;
    
    // Apply asymmetric value function
    let riskValueRaw;
    if (gainLoss >= 0) {
        // Gains: concave utility (diminishing returns)
        riskValueRaw = Math.pow(gainLoss, alpha);
    } else {
        // Losses: steeper utility (magnified by λ)
        riskValueRaw = -lambda * Math.pow(Math.abs(gainLoss), alpha);
    }
    
    // Adjust by financial buffer: better buffer reduces perceived risk
    const riskValueA = riskValueRaw / bufferModRisco;
    
    // ===== STEP 7: Irreversibility & Regret Theory =====
    // Higher reversibility_1_5 → harder to undo → higher regret penalty
    // reversMod ranges from 0.925 (reversibility=1) to 1.025 (reversibility=5)
    const reversMod = 0.9 + 0.025 * userInput.reversibility_1_5;
    
    // Regret if Option A is chosen but Option B would have been better
    const regretA = reversMod * Math.max(0, uBrutaB - uBrutaA);
    // Regret if Option B is chosen but Option A would have been better (counterfactual)
    const regretB = reversMod * Math.max(0, uBrutaA - uBrutaB);

    // ===== STEP 8: Final Utility Calculation =====
    // U_Final = Baseline(50) + Prospect_Value - Regret_Penalty
    // This combines all components into single utility measure
    const uFinalA = 50 + riskValueA - regretA;
    const uFinalB = 50 - regretB;
    
    // Clamp to [0, 100] scale for interpretability
    const U_A = clamp(uFinalA, 0, 100);
    const U_B = clamp(uFinalB, 0, 100);
    
    return {
        U_A,
        U_B,
        delta: U_A - U_B,
        domainScoresA,
        regretA,
        regretB,
        riskValueA,
        analysis: ''
    };
};

/**
 * Main export: Calculates utility scores for all three scenarios
 * 
 * Returns:
 * - conservador (P25): Pessimistic but plausible scenario
 * - provavel (P50): Most likely/median scenario
 * - expansivo (P75): Optimistic but plausible scenario
 * 
 * Users see all three to understand the range of possible outcomes.
 * The "likely" scenario is typically used for primary recommendation.
 */
export const calculateScores = (userInput: UserInput): Results => {
    return {
        conservador: calculateScenario(userInput, 'conservador'),
        provavel: calculateScenario(userInput, 'provavel'),
        expansivo: calculateScenario(userInput, 'expansivo'),
    };
};
