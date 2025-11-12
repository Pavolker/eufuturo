# Deploy no Netlify - Guia Completo

## Pré-requisitos
- Conta no GitHub
- Conta no Netlify (https://netlify.com)
- Chave da API do Google Gemini

## Passo 1: Preparar o Repositório Git

```bash
# Na raiz do projeto
git init
git add .
git commit -m "Initial commit: Conselho do Meu Eu Futuro"
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

## Passo 2: Configurar Variáveis de Ambiente no Netlify

1. Acesse https://app.netlify.com
2. Clique em "New site from Git"
3. Conecte sua conta GitHub
4. Selecione o repositório do projeto
5. Configure as build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Clique em "Advanced build settings"
7. Adicione variável de ambiente:
   - **Key**: `API_KEY`
   - **Value**: `sua_chave_gemini_aqui` (copie de .env.local)

## Passo 3: Deploy

Clique em "Deploy site" e aguarde a compilação. O site estará disponível em poucos minutos!

## Passo 4: Atualizar domínio (opcional)

1. Acesse as configurações do site no Netlify
2. Em "Domain management", configure um domínio personalizado
3. Configure DNS ou use o domínio .netlify.app automático

## Arquivos Importantes para Deploy

- `netlify.toml` - Configuração de build e headers de segurança
- `.env.example` - Template de variáveis (sempre commitar)
- `.env.local` - Nunca fazer commit (já no .gitignore)
- `vite.config.ts` - Configuração do build
- `package.json` - Dependências do projeto

## Build Local (Teste antes de fazer deploy)

```bash
npm run build
npm run preview
```

Isso cria a pasta `dist` com o site pronto para produção.

## Troubleshooting

### Erro: "API_KEY environment variable not set"
- Verifique se adicionou a variável de ambiente no Netlify
- Redeploy o site após adicionar

### Erro: "Port already in use"
- Normal em desenvolvimento local
- Vite usa automaticamente outra porta

### CSS não carregando
- Verifique se o arquivo `index.css` existe
- Rebuild com `npm run build`

## Segurança

✅ Chave da API não é commitada (`.env.local` no `.gitignore`)
✅ Headers de segurança configurados no `netlify.toml`
✅ Cache adequado para arquivos estáticos
✅ Redirects SPA configurado para funcionar com React Router

## Performance

- Build otimizado com Vite
- React 19 com tree-shaking
- CSS Tailwind incluído via CDN (considerar PostCSS para produção)
- Gzip automático no Netlify
- Cache de assets com hash

---

Para dúvidas ou suporte, consulte:
- Documentação Netlify: https://docs.netlify.com
- Documentação Vite: https://vitejs.dev/guide/
