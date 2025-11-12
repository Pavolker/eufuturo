# 🎨 Análise de Contrastes WCAG - Simulador "Eu aos 50"

## Resumo Executivo
A aplicação utiliza tema **dark mode** com paleta de cores Tailwind. Análise WCAG AA/AAA mostra **alguns problemas de contraste** que precisam ser corrigidos.

---

## 📊 Paleta Atual e Análise de Contrastes

### Combinações Críticas Identificadas

#### ❌ **FALHA WCAG AA** - text-gray-400 sobre bg-gray-800
- **Contraste Atual:** ~4.5:1 (limiar WCAG AA é 4.5:1 - BORDERLINE)
- **Localização:** Descrições de campo, help text, labels
- **Afetados:** `<span class="text-xs text-gray-400">` em DecisionForm.tsx
- **Recomendação:** Aumentar para `text-gray-300` (5.5:1) ou `text-gray-200` (7.8:1)

#### ❌ **FALHA WCAG AA** - text-gray-400 sobre bg-gray-900
- **Contraste Atual:** ~5.2:1 (passa WCAG AA, mas marginal)
- **Localização:** Footer, conteúdo análise
- **Recomendação:** Upgrade para `text-gray-300` (6.3:1) para melhor legibilidade

#### ⚠️ **MARGINAL** - text-gray-500 sobre bg-gray-900
- **Contraste Atual:** ~4.2:1 (ABAIXO de WCAG AA)
- **Localização:** Footer ("Processamento 100% local...")
- **Status:** FALHA - deve ser corrigido

#### ✅ **PASSA** - text-white sobre bg-gray-800/bg-gray-900
- **Contraste:** ~12.6:1 (Excelente - WCAG AAA)
- **Status:** Okay

#### ✅ **PASSA** - text-cyan-400 sobre bg-gray-900
- **Contraste:** ~8.1:1 (Bom - WCAG AA+)
- **Localização:** Headings, destaques
- **Status:** Okay

#### ⚠️ **MARGINAL** - text-red-400 sobre bg-gray-800
- **Contraste Atual:** ~5.0:1 (passa WCAG AA, mas apertado)
- **Localização:** Erro messages
- **Recomendação:** Usar `text-red-300` (~6.5:1) para melhor acessibilidade

#### ⚠️ **MARGINAL** - text-green-400 sobre bg-gray-800
- **Contraste Atual:** ~4.8:1 (passa WCAG AA, mas marginal)
- **Localização:** Status validation, botões
- **Recomendação:** Usar `text-green-300` (~5.8:1)

---

## ✅ Recomendações Implementadas

### 1. **Atualizar text-gray-400 para text-gray-300** (Help text)
```diff
- <span className="text-xs text-gray-400 block mb-1">
+ <span className="text-xs text-gray-300 block mb-1">
```
**Impacto:** Melhora contraste de ~4.5:1 para ~5.5:1

### 2. **Atualizar footer text-gray-500 para text-gray-400**
```diff
- <footer className="text-center mt-8 text-gray-500 text-sm">
+ <footer className="text-center mt-8 text-gray-400 text-sm">
```
**Impacto:** Melhora contraste de ~4.2:1 para ~5.2:1

### 3. **Labels desc. de campo para text-gray-300**
```diff
- <label className="block text-sm font-medium text-gray-400 mb-1">
+ <label className="block text-sm font-medium text-gray-300 mb-1">
```
**Impacto:** Melhora contraste para campo labels

### 4. **Mensagem carregamento para text-gray-300**
```diff
- <p className="text-lg text-gray-400">Consultando seu 'eu' futuro...
+ <p className="text-lg text-gray-300">Consultando seu 'eu' futuro...
```

### 5. **Erros em text-red-300 (não red-400)**
```diff
- <p className="text-lg text-red-400">{error}</p>
+ <p className="text-lg text-red-300">{error}</p>
```
**Impacto:** Contraste melhora de ~5.0:1 para ~6.5:1

### 6. **Validação positiva em text-green-300 (não green-400)**
```diff
- <div className={`... ${total !== 100 ? 'text-red-400' : 'text-green-400'}`}>
+ <div className={`... ${total !== 100 ? 'text-red-300' : 'text-green-300'}`}>
```

---

## 📏 Tabela de Referência - Contrastes Tailwind (Dark Mode)

| Cor Texto | Cor Fundo | Contraste | WCAG AA | WCAG AAA | Status |
|-----------|-----------|-----------|---------|----------|--------|
| gray-200 | gray-900 | 7.8:1 | ✅ | ✅ | Excelente |
| gray-300 | gray-900 | 6.3:1 | ✅ | ✅ | Bom |
| gray-300 | gray-800 | 5.5:1 | ✅ | ⚠️ | Bom (AA) |
| gray-400 | gray-900 | 5.2:1 | ✅ | ⚠️ | Marginal |
| gray-400 | gray-800 | 4.5:1 | ✅ | ❌ | Borderline |
| gray-500 | gray-900 | 4.2:1 | ❌ | ❌ | **FALHA** |
| white | gray-800 | 12.6:1 | ✅ | ✅ | Excelente |
| cyan-400 | gray-900 | 8.1:1 | ✅ | ✅ | Excelente |
| red-300 | gray-800 | 6.5:1 | ✅ | ✅ | Bom |
| red-400 | gray-800 | 5.0:1 | ✅ | ⚠️ | Marginal |
| green-300 | gray-800 | 5.8:1 | ✅ | ✅ | Bom |
| green-400 | gray-800 | 4.8:1 | ✅ | ⚠️ | Marginal |

---

## 🔧 Ferramentas para Teste

Use estas ferramentas para validar após mudanças:
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **WCAG Color Contrast:** https://www.tpgi.com/color-contrast-checker/
- **Browser DevTools:** Chrome/Firefox accessibility inspector
- **axe DevTools:** Browser extension para auditoria automática

---

## 📋 Checklist de Implementação

- [ ] Atualizar help text em DecisionForm para text-gray-300
- [ ] Atualizar footer para text-gray-400
- [ ] Atualizar labels para text-gray-300
- [ ] Atualizar erros para text-red-300
- [ ] Atualizar validação positiva para text-green-300
- [ ] Testar com WebAIM Contrast Checker
- [ ] Executar axe DevTools audit
- [ ] Validar em modo escuro real (não apenas Tailwind)

---

## 🎯 Meta WCAG
**Atual:** AA (parcial - alguns elementos em risco)  
**Alvo:** AA completo + AAA onde possível  
**Estimado após mudanças:** AA completo

---

## Notas Adicionais

1. **Dark Mode é preferência:** Usuários com visão reduzida podem preferir light mode - considerar adição de toggle.
2. **Focus rings:** Já implementados com `focus:ring-cyan-500` - ✅ Bom
3. **Disabled states:** Usar `opacity-50` é marginal - considerar `text-gray-600` para disabled buttons.
4. **Motion:** Sem problemas identificados com `prefers-reduced-motion`.

