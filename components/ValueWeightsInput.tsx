
import React, { useState, useEffect } from 'react';
import { ValueWeights, Domain } from '../types';
import { DOMAIN_LABELS } from '../constants';

interface ValueWeightsInputProps {
    value: ValueWeights;
    onChange: (newValue: ValueWeights) => void;
}

const ValueWeightsInput: React.FC<ValueWeightsInputProps> = ({ value, onChange }) => {
    const [weights, setWeights] = useState(value);
    // Fix: Explicitly type the arguments in the reduce function to prevent type errors.
    const total = Object.values(weights).reduce((sum: number, current: number) => sum + current, 0) as number;

    useEffect(() => {
        setWeights(value);
    }, [value]);

    const handleChange = (domain: Domain, newValue: number) => {
        const newWeights = { ...weights, [domain]: newValue };
        setWeights(newWeights);
        onChange(newWeights);
    };
    
    return (
        <div className="space-y-6">
            {Object.entries(DOMAIN_LABELS).map(([domain, label]) => (
                <div key={domain}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{label}: {weights[domain as Domain]}</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={weights[domain as Domain]}
                        onChange={(e) => handleChange(domain as Domain, parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>
            ))}
            
            <div className="border-2 rounded-lg p-4 mt-6" style={{
                borderColor: total === 100 ? '#10b981' : '#ef4444',
                backgroundColor: total === 100 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
            }}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-300">Soma Total de Pontos:</span>
                    <span className={`text-3xl font-extrabold ${total === 100 ? 'text-green-400' : 'text-red-400'}`}>
                        {total} / 100
                    </span>
                </div>
                
                {total !== 100 && (
                    <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-600">
                        <p className="text-red-300 text-sm font-semibold">
                            ⚠️ Você precisa distribuir exatamente 100 pontos!
                        </p>
                        <p className="text-red-200 text-xs mt-1">
                            {total < 100 ? `Faltam ${100 - total} pontos para atingir 100.` : `Excedeu em ${total - 100} pontos.`}
                        </p>
                    </div>
                )}
                
                {total === 100 && (
                    <div className="mt-3 p-2 bg-green-900/50 rounded border border-green-600">
                        <p className="text-green-300 text-sm font-semibold">
                            ✓ Perfeito! Seus valores estão bem distribuídos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ValueWeightsInput;