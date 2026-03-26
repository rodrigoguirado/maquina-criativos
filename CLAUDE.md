# Máquina de Criativos — Seazone

## Projeto
Aplicação Next.js que usa Claude AI para gerar criativos de marketing automaticamente a partir de um briefing de empreendimento SPOT.

## Stack
- Next.js 14, React 18, TypeScript, Tailwind CSS
- API: OpenRouter (anthropic/claude-sonnet-4) ou Anthropic direta
- Deploy: Vercel

## Estrutura
- `app/page.tsx` — Interface principal
- `app/api/generate/route.ts` — Endpoint de geração (chama Claude com contexto Seazone)
- `context/seazone-context.md` — Documento de contexto completo da marca

## Variáveis de Ambiente
- `OPENROUTER_API_KEY` — Chave do OpenRouter (sk-or-...)
- Ou `ANTHROPIC_API_KEY` — Chave direta da Anthropic

## Comandos
- `npm run dev` — Desenvolvimento local
- `npm run build` — Build de produção
- `npm start` — Servidor de produção
