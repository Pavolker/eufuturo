
export type DecisionType = 'carreira/emprego' | 'finanças/investimento' | 'migração' | 'educação' | 'relacionamento' | 'saúde/hábitos' | 'consumo' | 'tecnologia/digital';
export type OccupationStatus = 'CLT' | 'PJ' | 'empreendedor' | 'estudante' | 'inativo' | 'aposentado';
export type FinancialBufferBand = '<1' | '1–3' | '3–6' | '>6';
export type DependentsCount = '0' | '1' | '2+';
export type SupportNetworkBand = '0' | '1–3' | '4–7' | '8+';
export type Domain = 'financas' | 'saude_energia' | 'relacoes' | 'tempo_autonomia' | 'proposito_aprendizado';

export interface ValueWeights {
    financas: number;
    saude_energia: number;
    relacoes: number;
    tempo_autonomia: number;
    proposito_aprendizado: number;
}

export interface UserInput {
    birth_year: number;
    target_age: number;
    location_country: string;
    location_state: string;
    occupation_status: OccupationStatus;
    decision_type: DecisionType;
    decision_horizon_months: number;
    A_text: string;
    B_text: string;
    value_weights: ValueWeights;
    risk_tolerance_0_100: number;
    time_discount_0_100: number;
    reversibility_1_5: number;
    financial_buffer_band: FinancialBufferBand;
    dependents_count: DependentsCount;
    self_rated_health_1_5: number;
    support_network_band: SupportNetworkBand;
}

export interface ScenarioResult {
    U_A: number;
    U_B: number;
    delta: number;
    domainScoresA: Record<Domain, number>;
    regretA: number;
    regretB: number;
    riskValueA: number;
    analysis: string;
}

export interface Results {
    conservador: ScenarioResult;
    provavel: ScenarioResult;
    expansivo: ScenarioResult;
}
