# Máquina de Criativos — Seazone

## Projeto
Geração autônoma de criativos de marketing com IA para empreendimentos SPOT.

## Stack
- Next.js 14 + React 18 + Tailwind CSS
- Claude AI via OpenRouter
- fal.ai (Flux para imagens, Kling para vídeos)

## Variáveis de Ambiente
- OPENROUTER_API_KEY — chave do OpenRouter
- FAL_KEY — chave do fal.ai

## Comandos
- `npm run dev` — desenvolvimento local
- `npm run build` — build para produção

## Estrutura
- app/page.tsx — interface principal
- app/api/generate/route.ts — geração de roteiros e copies com Claude
- app/api/generate-image/route.ts — geração de imagens com fal.ai Flux
- app/api/generate-video/route.ts — geração de vídeos com fal.ai Kling
- context/seazone-context.md — contexto da marca
- public/ — logos e fotos reais

## Formatos
- Estático: 4:5 (1080x1350) — Instagram Feed
- Vídeo: 9:16 (1080x1920) — Reels

## Regras de Marca
- Tom consultivo, direto, orientado a decisão
- Sem clichês imobiliários
- Números sempre presentes
- Lógica: quebra → raciocínio → prova → produto → número → gestão → CTA
