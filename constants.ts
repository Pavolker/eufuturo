
import { UserInput, DecisionType, OccupationStatus, FinancialBufferBand, DependentsCount, SupportNetworkBand, Domain } from './types';

export const OCCUPATION_STATUSES: OccupationStatus[] = ['CLT', 'PJ', 'empreendedor', 'estudante', 'inativo', 'aposentado'];
export const DECISION_TYPES: DecisionType[] = ['carreira/emprego', 'finanças/investimento', 'migração', 'educação', 'relacionamento', 'saúde/hábitos', 'consumo', 'tecnologia/digital'];
export const FINANCIAL_BUFFER_BANDS: FinancialBufferBand[] = ['<1', '1–3', '3–6', '>6'];
export const DEPENDENTS_COUNTS: DependentsCount[] = ['0', '1', '2+'];
export const SUPPORT_NETWORK_BANDS: SupportNetworkBand[] = ['0', '1–3', '4–7', '8+'];
export const DOMAINS: Domain[] = ['financas', 'saude_energia', 'relacoes', 'tempo_autonomia', 'proposito_aprendizado'];
export const DOMAIN_LABELS: Record<Domain, string> = {
    financas: 'Finanças',
    saude_energia: 'Saúde & Energia',
    relacoes: 'Relações',
    tempo_autonomia: 'Tempo & Autonomia',
    proposito_aprendizado: 'Propósito & Aprendizado'
};


export const DEFAULT_USER_INPUT: UserInput = {
    birth_year: 1990,
    target_age: 50,
    location_country: 'BR',
    location_state: 'SP',
    occupation_status: 'CLT',
    decision_type: 'carreira/emprego',
    decision_horizon_months: 12,
    A_text: 'Mudar de emprego para uma startup de tecnologia.',
    B_text: 'Manter situação atual',
    value_weights: {
        financas: 20,
        saude_energia: 20,
        relacoes: 20,
        tempo_autonomia: 20,
        proposito_aprendizado: 20,
    },
    risk_tolerance_0_100: 50,
    time_discount_0_100: 50,
    reversibility_1_5: 3,
    financial_buffer_band: '3–6',
    dependents_count: '0',
    self_rated_health_1_5: 4,
    support_network_band: '4–7',
};

export const PRIORS: Record<DecisionType, Record<Domain, number>> = {
    'carreira/emprego': { financas: +12, saude_energia: -3, relacoes: -1, tempo_autonomia: +6, proposito_aprendizado: +8 },
    'finanças/investimento': { financas: +15, saude_energia: 0, relacoes: 0, tempo_autonomia: -2, proposito_aprendizado: +2 },
    'migração': { financas: +5, saude_energia: +2, relacoes: -8, tempo_autonomia: +1, proposito_aprendizado: +6 },
    'educação': { financas: +7, saude_energia: -1, relacoes: 0, tempo_autonomia: -4, proposito_aprendizado: +14 },
    'relacionamento': { financas: -2, saude_energia: +3, relacoes: +12, tempo_autonomia: -1, proposito_aprendizado: +4 },
    'saúde/hábitos': { financas: +1, saude_energia: +18, relacoes: +2, tempo_autonomia: -2, proposito_aprendizado: +5 },
    'consumo': { financas: -8, saude_energia: +2, relacoes: +1, tempo_autonomia: -3, proposito_aprendizado: 0 },
    'tecnologia/digital': { financas: +6, saude_energia: -2, relacoes: +3, tempo_autonomia: +4, proposito_aprendizado: +7 }
};

export const SUPPORT_MOD_MAP: Record<SupportNetworkBand, number> = { '0': 0.95, '1–3': 1.00, '4–7': 1.03, '8+': 1.06 };
export const BUFFER_MOD_RISK_MAP: Record<FinancialBufferBand, number> = { '<1': 1.15, '1–3': 1.07, '3–6': 1.03, '>6': 1.00 };
export const DEPENDENTS_MAP: Record<DependentsCount, number> = { '0': 0, '1': 1, '2+': 2 };

