
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Results, UserInput } from '../types';
import ScenarioCard from './ScenarioCard';
import { DOMAIN_LABELS } from '../constants';
import { exportJSON, exportCSV, exportPDF } from '../services/exportService';

interface ResultsScreenProps {
    results: Results;
    userInput: UserInput;
    onEdit: () => void;
    onReset: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, userInput, onEdit, onReset }) => {
    const radarData = Object.entries(userInput.value_weights).map(([key, value]) => ({
        subject: DOMAIN_LABELS[key as keyof typeof DOMAIN_LABELS].split(' ')[0],
        value: value,
        fullMark: 100,
    }));

    // Determine the overall recommendation based on the "Provável" scenario
    const probableScenario = results.provavel;
    const recommendation = probableScenario.delta > 0 ? 'tomaria' : 'não tomaria';
    const recommendationColor = probableScenario.delta > 0 ? 'text-green-400' : 'text-red-400';
    const recommendationBg = probableScenario.delta > 0 ? 'bg-green-900/30 border-green-600' : 'bg-red-900/30 border-red-600';

    const handleExportPDF = () => {
        exportPDF('results-container');
    }

    return (
        <div id="results-container" className="space-y-8">
            <div className="text-center border-b border-gray-700 pb-6">
                <h1 className="text-4xl font-bold text-white mb-2">Parecer do seu Eu aos {userInput.target_age}</h1>
                <p className="text-gray-400">
                    Idade atual: {new Date().getFullYear() - userInput.birth_year} anos | 
                    Horizonte: {userInput.decision_horizon_months} meses | 
                    Reversibilidade: {userInput.reversibility_1_5}/5
                </p>
            </div>

            <div className={`${recommendationBg} border-2 rounded-xl p-8 text-center animate-fade-in`}>
                <p className="text-gray-300 text-lg mb-3">Segundo o seu eu futuro:</p>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                    <span className="text-white">O seu Eu aos </span>
                    <span className="text-cyan-400">{userInput.target_age}</span>
                    <span className="text-white"> anos</span>
                </h2>
                <p className={`text-3xl md:text-4xl font-bold ${recommendationColor} mb-4`}>
                    {recommendation.toUpperCase()}
                </p>
                <p className="text-white text-lg md:text-xl font-semibold">
                    a decisão: <span className="text-cyan-400">{userInput.A_text}</span>
                </p>
                <p className="text-gray-400 text-sm mt-4">
                    (Em comparação com: {userInput.B_text})
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ScenarioCard title="Cenário Conservador" scenario={results.conservador} color="#f87171" targetAge={userInput.target_age} />
                <ScenarioCard title="Cenário Provável" scenario={results.provavel} color="#34d399" targetAge={userInput.target_age} />
                <ScenarioCard title="Cenário Expansivo" scenario={results.expansivo} color="#60a5fa" targetAge={userInput.target_age} />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-center text-white mb-4">Seus Pesos de Valor</h3>
                 <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#4b5563" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Peso" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                            <Tooltip
                                contentStyle={{
                                    background: '#2a2a2a',
                                    border: '1px solid #3a3a3a',
                                    borderRadius: '0.5rem',
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-200 mb-3">Nota Metodológica</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Esta simulação utiliza um modelo de Análise de Decisão Multicritério (MCDA). A utilidade de cada opção é calculada a partir de impactos base (priors), ajustados por horizonte temporal (desconto hiperbólico), perfil de risco (teoria do prospecto simplificada), e fatores contextuais (saúde, dependentes, etc.). Os cenários são gerados por amostragem de ruído paramétrico sobre os impactos. O resultado é uma projeção e não uma garantia de resultados futuros.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button onClick={onEdit} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Editar Decisão
                </button>
                <button onClick={() => exportJSON(userInput, results)} className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Exportar JSON
                </button>
                <button onClick={() => exportCSV(results)} className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Exportar CSV
                </button>
                <button onClick={handleExportPDF} className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Exportar PDF
                </button>
                 <button onClick={onReset} className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Apagar Tudo e Recomeçar
                </button>
            </div>
        </div>
    );
};

export default ResultsScreen;
