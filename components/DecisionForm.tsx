
import React, { useState } from 'react';
import { UserInput, ValueWeights } from '../types';
import { OCCUPATION_STATUSES, DECISION_TYPES, FINANCIAL_BUFFER_BANDS, DEPENDENTS_COUNTS, SUPPORT_NETWORK_BANDS } from '../constants';
import ProgressBar from './ProgressBar';
import ValueWeightsInput from './ValueWeightsInput';

interface DecisionFormProps {
    initialData: UserInput;
    onSubmit: (data: UserInput) => void;
}

const InputField: React.FC<{label: string, htmlFor?: string, children: React.ReactNode}> = ({label, htmlFor, children}) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

const commonInputClass = "w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition";

const DecisionForm: React.FC<DecisionFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<UserInput>(initialData);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.endsWith('_1_5') || name === 'birth_year' || name === 'target_age' || name === 'decision_horizon_months' || name.includes('100') ? Number(value) : value }));
    };

    const handleWeightsChange = (newWeights: ValueWeights) => {
        setFormData(prev => ({ ...prev, value_weights: newWeights }));
    };
    
    const isStepValid = () => {
        const currentYear = new Date().getFullYear();
        
        if (currentStep === 1) {
            // Validate birth year is reasonable (between 1900 and current year)
            if (formData.birth_year < 1900 || formData.birth_year > currentYear) {
                return false;
            }
            // Validate target age is older than current age
            const currentAge = currentYear - formData.birth_year;
            if (formData.target_age <= currentAge || formData.target_age > 120) {
                return false;
            }
            // Validate country code is not empty
            if (!formData.location_country || formData.location_country.trim().length === 0) {
                return false;
            }
            // Validate state is not empty
            if (!formData.location_state || formData.location_state.trim().length === 0) {
                return false;
            }
            return true;
        }
        
        if (currentStep === 2) {
            // Validate Option A description is not empty
            if (!formData.A_text || formData.A_text.trim().length === 0) {
                return false;
            }
            // Validate Option B description is not empty
            if (!formData.B_text || formData.B_text.trim().length === 0) {
                return false;
            }
            // Validate decision horizon is at least 1 month
            if (formData.decision_horizon_months < 1 || formData.decision_horizon_months > 600) {
                return false;
            }
            return true;
        }
        
        if (currentStep === 3) {
            // Validate weights sum to exactly 100
            const total = Object.values(formData.value_weights).reduce((sum: number, v: number) => sum + v, 0);
            return total === 100;
        }
        
        return true;
    };

    const nextStep = () => {
        if (isStepValid()) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(isStepValid()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            
            {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    <InputField label="Ano de Nascimento" htmlFor="birth_year">
                        <input id="birth_year" type="number" name="birth_year" value={formData.birth_year} onChange={handleChange} className={commonInputClass} required />
                    </InputField>
                    <InputField label={`Idade Alvo do seu "Eu" Futuro`} htmlFor="target_age">
                        <span className="text-xs text-gray-300 block mb-1">Qual idade você gostaria de ouvir? (mín: {new Date().getFullYear() - formData.birth_year + 1}, máx: 120)</span>
                        <input id="target_age" type="number" name="target_age" value={formData.target_age} onChange={handleChange} min={new Date().getFullYear() - formData.birth_year + 1} max="120" className={commonInputClass} required />
                    </InputField>
                    <InputField label="País (ISO-2)" htmlFor="location_country">
                        <input id="location_country" type="text" name="location_country" value={formData.location_country} onChange={handleChange} className={commonInputClass} maxLength={2} required />
                    </InputField>
                    <InputField label="Estado/Província" htmlFor="location_state">
                        <input id="location_state" type="text" name="location_state" value={formData.location_state} onChange={handleChange} className={commonInputClass} required />
                    </InputField>
                    <InputField label="Status Ocupacional" htmlFor="occupation_status">
                        <select id="occupation_status" name="occupation_status" value={formData.occupation_status} onChange={handleChange} className={commonInputClass}>
                            {OCCUPATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </InputField>
                </div>
            )}
            
            {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                     <InputField label="Tipo de Decisão" htmlFor="decision_type">
                        <select id="decision_type" name="decision_type" value={formData.decision_type} onChange={handleChange} className={commonInputClass}>
                            {DECISION_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </InputField>
                    <InputField label="Descreva a Opção A (a decisão a ser tomada)" htmlFor="A_text">
                        <textarea id="A_text" name="A_text" value={formData.A_text} onChange={handleChange} rows={3} className={commonInputClass} required></textarea>
                    </InputField>
                    <InputField label="Descreva a Opção B (alternativa ou status quo)" htmlFor="B_text">
                        <textarea id="B_text" name="B_text" value={formData.B_text} onChange={handleChange} rows={2} className={commonInputClass} required></textarea>
                    </InputField>
                     <InputField label="Prazo para implementar a sua decisão (em meses)" htmlFor="decision_horizon_months">
                        <input id="decision_horizon_months" type="number" name="decision_horizon_months" value={formData.decision_horizon_months} onChange={handleChange} min="1" max="600" className={commonInputClass} required />
                    </InputField>
                </div>
            )}

            {currentStep === 3 && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-semibold mb-2 text-white">Pesos de Valor (total deve ser 100)</h3>
                    <p className="text-sm text-gray-300 mb-4">Distribua 100 pontos entre o que é mais importante para você.</p>
                    <ValueWeightsInput value={formData.value_weights} onChange={handleWeightsChange} />
                </div>
            )}

            {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Tolerância ao Risco</h3>
                        <div className="flex justify-between items-end mb-3">
                            <div className="text-left">
                                <span className="text-sm font-semibold text-cyan-400">Aversão Máxima</span>
                                <p className="text-xs text-gray-400">Evita riscos</p>
                            </div>
                            <span className="text-3xl font-bold text-cyan-300">{formData.risk_tolerance_0_100}</span>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-cyan-400">Busca de Risco</span>
                                <p className="text-xs text-gray-400">Assume riscos</p>
                            </div>
                        </div>
                        <input id="risk_tolerance_0_100" type="range" min="0" max="100" name="risk_tolerance_0_100" value={formData.risk_tolerance_0_100} onChange={handleChange} className="w-full accent-cyan-500 h-3" />
                    </div>

                    <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Grau de Ansiedade</h3>
                        <div className="flex justify-between items-end mb-3">
                            <div className="text-left">
                                <span className="text-sm font-semibold text-cyan-400">Paciente</span>
                                <p className="text-xs text-gray-400">Prefere esperar</p>
                            </div>
                            <span className="text-3xl font-bold text-cyan-300">{formData.time_discount_0_100}</span>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-cyan-400">Ansioso</span>
                                <p className="text-xs text-gray-400">Quer agora</p>
                            </div>
                        </div>
                        <input id="time_discount_0_100" type="range" min="0" max="100" name="time_discount_0_100" value={formData.time_discount_0_100} onChange={handleChange} className="w-full accent-cyan-500 h-3" />
                    </div>

                    <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Reversibilidade da Decisão</h3>
                        <div className="flex justify-between items-end mb-3">
                            <div className="text-left">
                                <span className="text-sm font-semibold text-cyan-400">Fácil Reverter</span>
                                <p className="text-xs text-gray-400">Muda facilmente</p>
                            </div>
                            <span className="text-3xl font-bold text-cyan-300">{formData.reversibility_1_5}</span>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-cyan-400">Muito Difícil</span>
                                <p className="text-xs text-gray-400">Consequências sérias</p>
                            </div>
                        </div>
                        <input id="reversibility_1_5" type="range" min="1" max="5" step="1" name="reversibility_1_5" value={formData.reversibility_1_5} onChange={handleChange} className="w-full accent-cyan-500 h-3" />
                    </div>

                    <InputField label="Reserva Financeira (quantos meses você pode ficar sem gerar renda)" htmlFor="financial_buffer_band">
                        <select id="financial_buffer_band" name="financial_buffer_band" value={formData.financial_buffer_band} onChange={handleChange} className={commonInputClass}>
                            {FINANCIAL_BUFFER_BANDS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </InputField>
                </div>
            )}
            
            {currentStep === 5 && (
                 <div className="space-y-4 animate-fade-in">
                    <InputField label="Número de Dependentes" htmlFor="dependents_count">
                        <select id="dependents_count" name="dependents_count" value={formData.dependents_count} onChange={handleChange} className={commonInputClass}>
                            {DEPENDENTS_COUNTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </InputField>
                    <InputField label={`Autoavaliação de Saúde: ${formData.self_rated_health_1_5}`} htmlFor="self_rated_health_1_5">
                        <span className="text-xs text-gray-300 block mb-1">1 = ruim; 5 = excelente</span>
                        <input id="self_rated_health_1_5" type="range" min="1" max="5" step="1" name="self_rated_health_1_5" value={formData.self_rated_health_1_5} onChange={handleChange} className="w-full accent-cyan-500" />
                    </InputField>
                     <InputField label="Rede de Apoio (pessoas com quem pode contar)" htmlFor="support_network_band">
                        <select id="support_network_band" name="support_network_band" value={formData.support_network_band} onChange={handleChange} className={commonInputClass}>
                            {SUPPORT_NETWORK_BANDS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </InputField>
                </div>
            )}
            
            <div className="flex justify-between mt-8">
                <button type="button" onClick={prevStep} disabled={currentStep === 1} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                </button>
                {currentStep < totalSteps ? (
                    <button type="button" onClick={nextStep} disabled={!isStepValid()} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Próximo
                    </button>
                ) : (
                    <button type="submit" disabled={!isStepValid()} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Gerar Parecer
                    </button>
                )}
            </div>
        </form>
    );
};

export default DecisionForm;