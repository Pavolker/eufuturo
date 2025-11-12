
import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    const steps = [
        "Informações",
        "Decisão",
        "Valores",
        "Perfil",
        "Contexto"
    ];

    return (
        <div className="mb-8">
            <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div style={{ width: `${percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 transition-all duration-500"></div>
                </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
                {steps.map((step, index) => (
                    <span key={step} className={index + 1 <= currentStep ? 'font-bold text-cyan-400' : ''}>
                        {step}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ProgressBar;
