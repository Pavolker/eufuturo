
import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import DecisionForm from './components/DecisionForm';
import ResultsScreen from './components/ResultsScreen';
import { UserInput, Results, ScenarioResult, DecisionType, Domain } from './types';
import { DEFAULT_USER_INPUT } from './constants';
import { calculateScores } from './services/calculationService';
import { generateAnalysis } from './services/geminiService';

const App: React.FC = () => {
    const [screen, setScreen] = useState<'welcome' | 'form' | 'results'>('welcome');
    const [userInput, setUserInput] = useState<UserInput>(() => {
        try {
            const savedInput = localStorage.getItem('userInput');
            return savedInput ? JSON.parse(savedInput) : DEFAULT_USER_INPUT;
        } catch (error) {
            console.error('Error parsing user input from localStorage', error);
            return DEFAULT_USER_INPUT;
        }
    });
    const [results, setResults] = useState<Results | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('userInput', JSON.stringify(userInput));
        } catch (error) {
            console.error('Error saving user input to localStorage', error);
        }
    }, [userInput]);

    const handleStart = () => {
        setScreen('form');
    };

    const handleFormSubmit = useCallback(async (data: UserInput) => {
        setIsLoading(true);
        setError(null);
        setUserInput(data);
        try {
            const calculatedResults = calculateScores(data);

            const scenariosToAnalyze: [keyof Results, string][] = [
                ['provavel', 'Provável'],
                ['conservador', 'Conservador'],
                ['expansivo', 'Expansivo']
            ];

            // Execute all analysis calls in parallel using Promise.all
            const analysisPromises = scenariosToAnalyze.map(([scenarioKey, scenarioName]) => {
                const scenarioResult = calculatedResults[scenarioKey];
                return generateAnalysis(data, scenarioResult, scenarioName)
                    .then(analysisText => ({ scenarioKey, analysisText }))
                    .catch(error => {
                        console.error(`Error generating analysis for ${scenarioName}:`, error);
                        return { scenarioKey, analysisText: '' };
                    });
            });

            const analysisResults = await Promise.all(analysisPromises);

            // Apply analysis results to calculated results
            analysisResults.forEach(({ scenarioKey, analysisText }) => {
                calculatedResults[scenarioKey as keyof Results].analysis = analysisText;
            });
            
            setResults(calculatedResults);
            setScreen('results');
        } catch (e) {
            console.error("Error during calculation or analysis:", e);
            setError("Ocorreu um erro ao gerar a análise. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleEditDecision = () => {
        setResults(null);
        setScreen('form');
    };
    
    const handleReset = () => {
        localStorage.removeItem('userInput');
        setUserInput(DEFAULT_USER_INPUT);
        setResults(null);
        setScreen('welcome');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
            <div className="w-full max-w-5xl mx-auto">
                <header className="flex items-center justify-center gap-6 mb-8 bg-white rounded-xl p-6 shadow-lg">
                    <img src="/centauro.jpg" alt="Centauro" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                            <span className="text-cyan-600">Avaliação Racional</span> de Decisões
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">Conselho do Meu Eu Futuro</p>
                    </div>
                    <img src="/mdh.gif" alt="MDH" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                </header>
                <main className="bg-gray-800 rounded-xl shadow-2xl shadow-black/30 p-6 md:p-8">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center space-y-4 h-96">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                            <p className="text-lg text-gray-300">Consultando seu 'eu' futuro... Isso pode levar um momento.</p>
                        </div>
                    )}
                    {!isLoading && error && (
                         <div className="flex flex-col items-center justify-center space-y-4 h-96 bg-red-900/20 rounded-lg p-4">
                            <p className="text-lg text-red-300">{error}</p>
                            <button onClick={handleEditDecision} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Voltar ao Formulário
                            </button>
                        </div>
                    )}
                    {!isLoading && !error && (
                        <>
                            {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}
                            {screen === 'form' && <DecisionForm initialData={userInput} onSubmit={handleFormSubmit} />}
                            {screen === 'results' && results && userInput && (
                                <ResultsScreen 
                                    results={results} 
                                    userInput={userInput} 
                                    onEdit={handleEditDecision}
                                    onReset={handleReset}
                                />
                            )}
                        </>
                    )}
                </main>
                 <footer className="text-center mt-8 text-gray-400 text-sm">
                    <p>Processamento 100% local. Seus dados nunca saem do seu navegador.</p>
                    <p>&copy; 2025 Versão 1.0. Desenvolvido por PVolker - Todos os direitos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
