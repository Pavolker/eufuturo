# Checklist de Deploy no Netlify

## ✅ Arquivos Preparados

- ✅ `netlify.toml` - Configuração completa de build
- ✅ `DEPLOY_NETLIFY.md` - Guia detalhado de deploy
- ✅ `.gitignore` - Proteção de arquivo `.env.local`
- ✅ `.env.example` - Template para variáveis
- ✅ Build testado localmente - Funciona sem erros

## 📋 Passos Rápidos para Deploy

### 1. Criar Repositório GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USER/SEU_REPO.git
git push -u origin main
```

### 2. Conectar no Netlify
1. Vá para https://app.netlify.com
2. Clique "New site from Git"
3. Selecione GitHub
4. Escolha o repositório

### 3. Configurar Build
- Build command: `npm run build`
- Publish directory: `dist`

### 4. Adicionar Variável de Ambiente
**Name:** `API_KEY`
**Value:** `AIzaSyC0pj3dzflFDyxaPX-CmUXXx53eSlLryL0` (sua chave)

### 5. Deploy
Clique "Deploy site" e aguarde!

## 🎯 Resultado Esperado

- ✅ Site online em `seu-site.netlify.app`
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Deploy automático ao fazer push no GitHub
- ✅ API funcionando com Gemini

## ⚠️ Avisos Importantes

1. **Nunca commitar `.env.local`** - Já está no `.gitignore`
2. **Adicionar API_KEY no Netlify**, não no repositório
3. **Testar localmente antes** com `npm run build && npm run preview`
4. **Observar logs** no Netlify se algo falhar

## 📊 Status do Build

```
✓ 887 modules transformed
✓ dist/index.html - 1.31 kB
✓ dist/assets/index.es-BRTPfi0G.js - 159.36 kB
✓ dist/assets/index-Cl8noTPh.js - 1,359.92 kB (com Recharts/Google GenAI)
✓ Built in 2.48s
```

O tamanho é normal por causa das dependências (Recharts, Google GenAI, React).

## 🚀 Próximos Passos Após Deploy

1. Testar todas as funcionalidades no site live
2. Configurar domínio personalizado (opcional)
3. Monitorar performance no Netlify Analytics
4. Configurar notificações de erro

---

**Documentação completa**: Veja `DEPLOY_NETLIFY.md`
