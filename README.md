# 🏠 Máquina de Criativos — Seazone

> Geração autônoma de criativos de marketing com IA para empreendimentos SPOT.

## O que é

Uma máquina que recebe um briefing de empreendimento e gera automaticamente todos os criativos necessários para campanhas de mídia paga:

- **🎬 Vídeos com Apresentadora** — Roteiros completos para 3 estruturas × 5 variações com Mônica Medeiros
- **🎙️ Vídeos Narrados** — Scripts de narração em off com descrições visuais frame a frame
- **🖼️ Peças Estáticas** — 8 variações visuais renderizadas com identidade Seazone (logo, cores, tipografia, badges, disclaimers)
- **📸 Imagens IA** — Geração de imagens reais com IA (Pollinations.ai gratuito + fal.ai/Flux Pro para alta qualidade)
- **🎨 Prompts de Imagem** — 10 prompts otimizados para Midjourney/DALL-E/Flux, copiáveis com um clique
- **🎥 Vídeos IA** — Geração de vídeos com Kling via fal.ai (requer API key)

## Ferramentas Integradas

| Ferramenta | Uso | Custo |
|---|---|---|
| **Claude AI** (via OpenRouter) | Geração de roteiros, copies e estratégia criativa | Pay-per-use |
| **Pollinations.ai** | Geração de imagens (integrado, sem API key) | Gratuito |
| **fal.ai / Flux Pro** | Geração de imagens premium (opcional) | ~$0.01/imagem |
| **fal.ai / Kling** | Geração de vídeos (opcional) | ~$0.10-0.50/vídeo |

## Contexto Seazone Integrado

A IA opera com conhecimento profundo da marca:

- **Tom de voz:** Consultivo, direto, orientado a decisão. Fala como operador de investimento, não como corretor.
- **Identidade visual:** Cores (#0055FF, #00143D, #FC6058), Helvetica, formas orgânicas, casinha Seazone
- **Do's e Don'ts:** Regras claras do que reforçar e o que evitar em cada criativo
- **Público-alvo:** Segmentação por prioridade (Sudeste > Regional > Nacional)
- **Estrutura de fala:** Quebra de expectativa → Tese → Prova → Produto → Número → Remoção de fricção → CTA
- **Mônica Medeiros:** Tom de autoridade, postura confiante, credibilidade sobre atuação

## Autonomia

A máquina recebe o briefing e executa sozinha:

1. Analisa dados financeiros (ROI, ticket, rendimento)
2. Identifica pontos fortes e posicionamento
3. Aplica o tom de voz Seazone automaticamente
4. Gera todas as variações respeitando as regras de marca
5. Entrega criativos prontos para produção

## Stack

- **Frontend:** Next.js 14 + React 18 + Tailwind CSS
- **IA:** Claude (via OpenRouter API)
- **Deploy:** Vercel

## Como usar

### Desenvolvimento local

```bash
npm install
cp .env.example .env.local
# Edite .env.local com sua chave OpenRouter
npm run dev
```

### Deploy na Vercel

1. Push para GitHub
2. Conecte o repositório na Vercel
3. Configure a variável de ambiente `OPENROUTER_API_KEY`
4. Deploy automático

## Estrutura do Projeto

```
maquina-criativos/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # Claude AI - roteiros e copies
│   │   ├── image/route.ts       # fal.ai Flux Pro + Pollinations fallback
│   │   └── video/route.ts       # fal.ai Kling - geração de vídeos
│   ├── components/
│   │   ├── StaticCreatives.tsx   # Peças visuais renderizadas com brand Seazone
│   │   └── ImageGenerator.tsx    # Geração de imagens com IA
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Interface principal
├── context/
│   └── seazone-context.md        # Documento de contexto completo
├── .env.example
├── package.json
├── CLAUDE.md
└── README.md
```

## Pronto para Uso

A máquina está pronta para o time usar no dia seguinte:
- Interface intuitiva — qualquer pessoa do time consegue operar
- Briefing editável — funciona com qualquer empreendimento SPOT
- Criativos organizados por tipo — fácil de distribuir para o time de criação
- Prompts de imagem copiáveis — prontos para colar no Midjourney/DALL-E

---

**Marketing AI Hackathon 2026 — Seazone**
