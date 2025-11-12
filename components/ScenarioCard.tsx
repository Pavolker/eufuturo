
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ScenarioResult } from '../types';
import { DOMAIN_LABELS } from '../constants';

interface ScenarioCardProps {
    title: string;
    scenario: ScenarioResult;
    color: string;
    targetAge?: number;
}

const ScoreDisplay: React.FC<{ label: string, value: number, delta?: number }> = ({ label, value, delta }) => {
    const deltaColor = delta === undefined ? '' : delta > 0 ? 'text-green-300' : delta < 0 ? 'text-red-300' : 'text-gray-400';
    return (
        <div className="text-center bg-gray-900/50 p-3 rounded-lg">
            <div className="text-sm text-gray-300">{label}</div>
            <div className="text-2xl font-bold text-white">{value.toFixed(1)}</div>
            {delta !== undefined && (
                <div className={`text-sm font-semibold ${deltaColor}`}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                </div>
            )}
        </div>
    );
};

const ScenarioCard: React.FC<ScenarioCardProps> = ({ title, scenario, color, targetAge }) => {
    const chartData = Object.entries(scenario.domainScoresA).map(([key, value]) => ({
        name: DOMAIN_LABELS[key as keyof typeof DOMAIN_LABELS],
        score: value,
    }));

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col h-full animate-fade-in">
            <div>
                <h3 className={`text-2xl font-bold text-center mb-1`} style={{ color }}>{title}</h3>
                {targetAge && <p className="text-xs text-gray-400 text-center mb-4">Seu Eu aos {targetAge} anos</p>}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                <ScoreDisplay label="Opção A" value={scenario.U_A} />
                <ScoreDisplay label="Opção B" value={scenario.U_B} />
                <ScoreDisplay label="Diferença" value={scenario.delta} delta={scenario.delta} />
            </div>

            <div className="mb-6">
                 <h4 className="text-lg font-semibold text-center text-white mb-2">Impactos da Opção A</h4>
                <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#d1d5db', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                contentStyle={{
                                    background: '#2a2a2a',
                                    border: '1px solid #3a3a3a',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Bar dataKey="score" barSize={20}>
                                {/* Fix: Explicitly type the 'entry' object to resolve type inference issues. */}
                                {chartData.map((entry: { score: number }, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score >= 50 ? color : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed bg-gray-900/50 p-4 rounded-lg flex-grow">
                 {scenario.analysis.split('\n').map((line, i) => {
                    if (line.startsWith('###')) {
                        return <h4 key={i} className="text-white !mt-0 !mb-2">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('*')) {
                        return <p key={i} className="!my-1">{line}</p>;
                    }
                    return <p key={i} className="!my-1">{line}</p>;
                })}
            </div>
        </div>
    );
};

export default ScenarioCard;