
import React from 'react';

interface WelcomeScreenProps {
    onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="text-center flex flex-col items-center justify-center animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">Preâmbulo</h2>
            <p className="max-w-3xl text-gray-400 leading-relaxed mb-8">
                "Você tomou uma decisão importante, mas ainda não colocou em prática. Antes de seguir em frente, este aplicativo convida você a olhar para essa escolha a partir de outro ponto no tempo — o seu próprio eu futuro.
                <br/><br/>
                Com base na ciência do "Future Self Continuity", o sistema cria uma simulação de conversa entre o "você de agora" e o "você de daqui a alguns anos".
                <br/><br/>
                Você escolhe a idade do seu "eu futuro" — 40, 50, 70 anos — e o aplicativo usa dados e projeções para estimar como essa versão de você avaliaria a decisão de hoje.
                <br/><br/>
                A proposta é simples: ajudar você a pensar nas consequências de longo prazo, de forma racional, empática e fundamentada em evidências sobre comportamento humano e tomada de decisão."
            </p>
            <button
                onClick={onStart}
                className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
                Começar Avaliação
            </button>
        </div>
    );
};

export default WelcomeScreen;
