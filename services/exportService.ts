
import { UserInput, Results } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

export const exportJSON = (userInput: UserInput, results: Results) => {
    const data = {
        userInput,
        results
    };
    const content = JSON.stringify(data, null, 2);
    downloadFile('simulador-eu-aos-50.json', content, 'application/json');
};

export const exportCSV = (results: Results) => {
    const headers = 'cenario,U_A,U_B,delta,financas_A,saude_energia_A,relacoes_A,tempo_autonomia_A,proposito_aprendizado_A,regret_A,regret_B';
    const rows = (Object.keys(results) as Array<keyof Results>).map(scenarioKey => {
        const r = results[scenarioKey];
        return [
            scenarioKey,
            r.U_A.toFixed(2),
            r.U_B.toFixed(2),
            r.delta.toFixed(2),
            r.domainScoresA.financas.toFixed(2),
            r.domainScoresA.saude_energia.toFixed(2),
            r.domainScoresA.relacoes.toFixed(2),
            r.domainScoresA.tempo_autonomia.toFixed(2),
            r.domainScoresA.proposito_aprendizado.toFixed(2),
            r.regretA.toFixed(2),
            r.regretB.toFixed(2)
        ].join(',');
    });
    const content = [headers, ...rows].join('\n');
    downloadFile('simulador-eu-aos-50.csv', content, 'text/csv;charset=utf-8;');
};

export const exportPDF = async (elementId: string) => {
    const canvas = await html2canvas(document.getElementById(elementId) as HTMLElement, {
        backgroundColor: '#1e1e1e', // Match the dark theme background
        scale: 2 // Improve resolution
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('simulador-eu-aos-50.pdf');
};