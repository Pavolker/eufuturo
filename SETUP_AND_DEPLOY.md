# 🎯 Próximos Passos - Setup e Deploy

## 1️⃣ Instalação e Setup Local

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

```bash
# 1. Instalar dependências (incluindo as novas: jspdf, html2canvas)
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local

# 3. Editar .env.local com sua chave Gemini
# Obter em: https://aistudio.google.com/app/apikeys
# Exemplo:
# API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 4. Executar em desenvolvimento
npm run dev
# Acesso em: http://localhost:5173

# 5. Build para produção
npm run build

# 6. Preview do build
npm run preview
```

---

## 2️⃣ Checklist de Verificação

### ✅ Funcionalidades Core
- [ ] Wizard de 5 steps funciona sem erros
- [ ] Validações de input aparecem (ex: ano nascimento < 1900)
- [ ] Opção B é customizável (novo campo)
- [ ] Cálculos rodam sem erros no console
- [ ] 3 cenários (conservador/provável/expansivo) são calculados

### ✅ IA & Análise
- [ ] Análises do Gemini carregam em paralelo
- [ ] Tempo total < 10 segundos (antes era ~15s)
- [ ] Prompts usam corretamente A_text e B_text

### ✅ Exportação
- [ ] ✅ JSON export funciona
- [ ] ✅ CSV export funciona  
- [ ] ✅ PDF export funciona (agora com imports corretos)

### ✅ Acessibilidade
- [ ] Labels associadas com inputs (htmlFor)
- [ ] Contrastes WCAG AA (cores mais claras)
- [ ] Tabulação funciona (Tab key)
- [ ] Screen reader consegue ler conteúdo

### ✅ Persistência
- [ ] LocalStorage salva userInput
- [ ] Recarga página = dados ainda estão lá

---

## 3️⃣ Testes Recomendados

### Testes Automatizados
```bash
# (Não há testes configurados - considerar adicionar)
# Sugestão: Adicionar Jest + React Testing Library
npm install --save-dev jest @testing-library/react
```

### Testes de Acessibilidade
```bash
# 1. Instalar axe DevTools chrome extension
# https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnkpklempisson

# 2. Abrir DevTools → axe DevTools → Scan

# 3. Validar WebAIM Contrast
# https://webaim.org/resources/contrastchecker/
```

### Testes Manuais
1. **Wizard completo:**
   - Preencher todos 5 steps
   - Validar erros aparecem corretamente
   - Verificar campos B_text e novo campo

2. **Cenários:**
   - Alterar tolerance ao risco → impactos mudam
   - Alterar saúde → financas mudam
   - Alterar dependentes → proposito muda

3. **Exportação:**
   - Exportar JSON → arquivo downloads
   - Exportar CSV → abrir em Excel
   - Exportar PDF → visualizar em viewer

4. **Acessibilidade:**
   - Tab through form → consegue ler?
   - Aumentar zoom 200% → UI quebra?
   - Modo escuro/claro → cores okay?

---

## 4️⃣ Deploy

### Opções de Deploy

#### Option A: Vercel (Recomendado para Vite)
```bash
npm install -g vercel
vercel
# Seguir prompts, definir API_KEY em environment variables
```

#### Option B: Netlify
```bash
npm install -g netlify-cli
netlify deploy
# Build folder: dist
# Definir API_KEY em Site Settings → Build & Deploy → Environment
```

#### Option C: GitHub Pages
```bash
# Adicionar ao vite.config.ts:
# export default { base: '/nome-repo/', ... }

npm run build
# Upload 'dist' folder para gh-pages branch
```

#### Option D: Azure (Mencionado em README.md original)
```bash
# Usar AI Studio: https://ai.studio/apps/temp/2
# (Pré-configurado conforme README.md)
```

---

## 5️⃣ Variáveis de Ambiente - Security

### Nunca fazer:
```bash
# ❌ ERRADO - expor chave no código
const API_KEY = "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ❌ ERRADO - commitar .env.local
git add .env.local
```

### Fazer isso:
```bash
# ✅ CERTO - usar .env.local (gitignored)
API_KEY=seu_valor_aqui

# ✅ CERTO - em produção, usar platform's secrets
# Vercel: Project Settings → Environment Variables
# Netlify: Site Settings → Build & Deploy → Environment

# ✅ CERTO - .gitignore
echo ".env.local" >> .gitignore
```

---

## 6️⃣ Troubleshooting

### Problema: "Cannot find module 'react'"
```bash
# Solução: Limpar node_modules e reinstalar
rm -rf node_modules
npm install
```

### Problema: "API_KEY is undefined"
```bash
# Verificar:
# 1. .env.local existe na raiz?
# 2. Variável se chama API_KEY (não GEMINI_API_KEY)?
# 3. Vite recarregou (npm run dev)?
console.log(import.meta.env.API_KEY)  // deve mostrar chave
```

### Problema: "HTML2Canvas export fails"
```bash
# Verificar:
# 1. npm install completou sem erros?
# 2. Elemento #results-container existe no DOM?
# 3. Canvas size é razoável (< 1920px)?
```

### Problema: "Análises não carregam"
```bash
# Verificar:
# 1. API_KEY é válida em Gemini?
# 2. Rate limit não foi excedido?
# 3. Network tab mostra 200 em requests?
# 4. Browser console mostra erro específico?
```

---

## 7️⃣ Performance & Optimization

### Já implementado:
- ✅ Promise.all para análises paralelas
- ✅ LocalStorage para persistência
- ✅ Lazy loading de componentes (React.lazy via Vite)
- ✅ Dark mode otimizado (menos repaints)

### Próximas otimizações (opcional):
1. **Caching de resultados:** Redis/IndexedDB para não recalcular
2. **Memoization:** React.memo em ScenarioCard
3. **Code splitting:** Separar calculationService em worker
4. **CDN:** Servir assets via CDN (Vercel edge network)

---

## 8️⃣ Monitoramento & Analytics

### Recomendações:
- **Sentry:** Error tracking (https://sentry.io/)
- **Posthog:** Analytics (https://posthog.com/)
- **LogRocket:** Session replay (https://logrocket.com/)

```typescript
// Exemplo: Adicionar Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "sua_dsn_aqui",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});
```

---

## 9️⃣ Suporte & Feedback

### Onde pedir ajuda:
- **Documentação Gemini:** https://ai.google.dev/
- **React:** https://react.dev/
- **Vite:** https://vitejs.dev/
- **Tailwind:** https://tailwindcss.com/
- **Recharts:** https://recharts.org/

### Feedback do usuário:
- Implementar analytics para uso patterns
- Coletar respostas "essa análise foi útil?"
- A/B test diferentes algoritmos

---

## 🔟 Roadmap Futuro (Sugestões)

### MVP (feito ✅)
- [x] Wizard 5 steps
- [x] MCDA algorithm
- [x] Gemini integration
- [x] 3 scenarios
- [x] Exportação

### v1.1 (próximo)
- [ ] Light mode toggle
- [ ] Multiple languages (PT/EN/ES)
- [ ] User accounts & history
- [ ] Shareable results
- [ ] API REST (backend)

### v2.0 (future)
- [ ] Mobile app (React Native)
- [ ] Team collaboration
- [ ] Decision templates
- [ ] Advanced analytics
- [ ] Integração com Google Calendar

---

## 📞 Contato & Créditos

**Desenvolvido por:** GitHub Copilot  
**Framework:** React 19 + TypeScript + Vite  
**IA:** Google Gemini 2.5 Flash  
**Design:** Tailwind CSS + Recharts  
**Data última atualização:** 12 de novembro de 2025

---

**Bom deploy! 🚀**
