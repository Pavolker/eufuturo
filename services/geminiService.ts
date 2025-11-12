
import { GoogleGenAI } from "@google/genai";
import { UserInput, ScenarioResult, Domain } from '../types';
import { DOMAIN_LABELS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getTopDrivers = (userInput: UserInput, scenarioResult: ScenarioResult): string[] => {
    const contributions: { domain: Domain; value: number }[] = (Object.keys(userInput.value_weights) as Domain[]).map(domain => {
        const weight = userInput.value_weights[domain] / 100;
        const scoreA = scenarioResult.domainScoresA[domain];
        // Contribution is the weighted difference from the baseline of 50
        const contribution = weight * (scoreA - 50);
        return { domain, value: contribution };
    });

    contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    
    return contributions.slice(0, 2).map(c => {
        const direction = c.value > 0 ? 'positivamente' : 'negativamente';
        return `${DOMAIN_LABELS[c.domain]} (impactando ${direction})`;
    });
};

export const generateAnalysis = async (userInput: UserInput, scenarioResult: ScenarioResult, scenarioName: string): Promise<string> => {
    if (!API_KEY) {
        return "Análise não disponível: a chave da API do Gemini não está configurada.";
    }

    const topDrivers = getTopDrivers(userInput, scenarioResult);

    const prompt = `
        Você é a versão de ${userInput.target_age} anos do usuário, oferecendo uma análise racional e neutra sobre uma decisão.
        O usuário tem ${new Date().getFullYear() - userInput.birth_year} anos e está considerando como seria aos ${userInput.target_age} anos.
        A decisão é: "${userInput.A_text}" (Opção A) versus "${userInput.B_text}" (Opção B).
        O horizonte da decisão é de ${userInput.decision_horizon_months} meses.

        Com base no cenário **${scenarioName}**, os cálculos resultaram em:
        - Utilidade da Opção A: ${scenarioResult.U_A.toFixed(1)}/100
        - Utilidade da Opção B: ${scenarioResult.U_B.toFixed(1)}/100
        - Diferença (A - B): ${scenarioResult.delta.toFixed(1)}
        - Principais impulsionadores da diferença: ${topDrivers.join(', ')}.
        - Nível de irreversibilidade da decisão (1-5): ${userInput.reversibility_1_5}
        - Arrependimento previsto para a Opção A (se B for melhor): ${scenarioResult.regretA.toFixed(1)}
        - Arrependimento previsto para a Opção B (se A for melhor): ${scenarioResult.regretB.toFixed(1)}

        Gere um parecer curto e direto em Markdown, usando o seguinte formato estrito:

        ### Parecer do Cenário ${scenarioName}

        *   **Comparativo Geral:** A Opção A ({U_A}/100) parece [ligeiramente melhor/significativamente melhor/praticamente igual/pior] que a Opção B ({U_B}/100), com uma diferença de {delta} pontos.
        *   **Principais Fatores:** A sua decisão é mais influenciada por [mencione os top 2 drivers de forma fluida].
        *   **Riscos e Arrependimento:** Dado que a decisão tem uma dificuldade de reversão de {reversibility}/5, o arrependimento previsto caso a Opção A não corresponda às expectativas é de {regretA}. Por outro lado, o arrependimento de não agir (Opção B) é de {regretB}.

        Seja conciso, use os valores exatos fornecidos, e preencha os colchetes com a análise apropriada (ex: 'ligeiramente melhor').
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        // Fallback text
        return `
### Parecer do Cenário ${scenarioName}

*   **Comparativo Geral:** Opção A: ${scenarioResult.U_A.toFixed(1)}/100. Opção B: ${scenarioResult.U_B.toFixed(1)}/100. Diferença: ${scenarioResult.delta.toFixed(1)} pontos.
*   **Principais Fatores:** Os principais fatores nesta análise são ${topDrivers.join(' e ')}.
*   **Riscos e Arrependimento:** Irreversibilidade: ${userInput.reversibility_1_5}/5. Arrependimento esperado para A: ${scenarioResult.regretA.toFixed(1)}. Arrependimento esperado para B: ${scenarioResult.regretB.toFixed(1)}.
(Ocorreu um erro ao gerar a análise narrativa.)
        `;
    }
};

