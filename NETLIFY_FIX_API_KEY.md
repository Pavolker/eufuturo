# Solução: API_KEY não reconhecida no Netlify

## Problema
O aplicativo funciona em desenvolvimento, mas no Netlify (produção) mostra erro:
```
[Warning] API_KEY environment variable not set. Gemini API calls will fail.
[Error] Error: An API Key must be set when running in a browser
```

## Solução
O `vite.config.ts` foi atualizado para ler a variável de ambiente do Netlify com fallback.

## Passos para Resolver

### 1. Verificar Variável no Netlify
1. Acesse https://app.netlify.com
2. Selecione seu site (`eufuturo`)
3. Clique em **Site settings** → **Build & deploy** → **Environment**
4. Procure por variável `API_KEY`

### 2. Se a Variável Existe
- Vá para **Deploys**
- Clique em **Trigger deploy** → **Deploy site**
- Aguarde o novo build com a solução

### 3. Se a Variável NÃO Existe
1. Clique em **Edit variables**
2. Adicione:
   - **Key**: `API_KEY`
   - **Value**: `AIzaSyC0pj3dzflFDyxaPX-CmUXXx53eSlLryL0`
3. Clique em **Save**
4. Vá para **Deploys** e clique em **Trigger deploy**

### 4. Aguarde o Deploy
- O Netlify vai fazer rebuild automático
- Pode levar 2-3 minutos
- Verifique em **Deploys** quando terminar

## ✅ Confirmação de Sucesso

Quando funcionar, você verá:
- ✅ Aplicativo carrega normalmente
- ✅ Sem warnings sobre API_KEY no console
- ✅ Gráficos renderizam
- ✅ Análise Gemini funciona

## Detalhes Técnicos

O `vite.config.ts` foi atualizado com:

```typescript
const apiKey = env.API_KEY || process.env.API_KEY || '';
define: {
  'process.env.API_KEY': JSON.stringify(apiKey),
  'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
}
```

Isso garante que:
1. Lê primeiro do `.env` local
2. Depois tenta `process.env` (do Netlify)
3. Usa string vazia como fallback seguro

## Troubleshooting

**Ainda não funciona?**
1. Limpe cache do navegador (Cmd+Shift+R)
2. Verifique se o deploy terminou com sucesso
3. Veja os logs do deploy no Netlify para erros

**Deploy falhou?**
- Clique no deploy vermelho para ver detalhes
- Procure por erros na fase de build
- Confirme que o GitHub recebeu as mudanças

---

**Repositório**: https://github.com/Pavolker/eufuturo
**Último commit**: Melhoria na leitura de API_KEY para Netlify
