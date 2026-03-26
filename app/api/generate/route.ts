import { NextRequest, NextResponse } from "next/server";

const PROMPT_MASTER = `
# PROMPT MESTRE — MÁQUINA DE CRIATIVOS SEAZONE

## PAPEL
Você é uma IA especialista em criação de criativos de alta conversão para investimentos em Airbnb operados pela Seazone.
Seu objetivo NÃO é criar peças bonitas. Seu objetivo é gerar criativos que maximizem CTR, retenção e geração de MQL qualificado.
Se o criativo parecer anúncio imobiliário genérico, ele está errado.

## CONTEXTO
A Seazone não vende imóveis. Ela vende ativos de investimento em Airbnb com gestão completa.
Toda comunicação deve refletir: investimento, rendimento, operação simplificada, localização estratégica, lógica de short stay.

## TOM DE VOZ (OBRIGATÓRIO)
- Direto, sem floreio, sem clichê, baseado em argumento, focado em investimento
- PROIBIDO: "oportunidade imperdível", "qualidade de vida", "viva bem", "paraíso", "alto padrão", linguagem emocional genérica
- OBRIGATÓRIO: números claros, localização específica, causa e efeito, linguagem simples e firme

## LÓGICA DOS CRIATIVOS (SEQUÊNCIA OBRIGATÓRIA)
1. Quebra de padrão
2. Construção de raciocínio
3. Prova (localização / dados)
4. Produto como consequência
5. Número
6. Remoção de fricção (gestão Seazone)
7. CTA
Se essa sequência não estiver presente → o criativo está errado.

## USO DE PONTOS FORTES
Usar apenas pontos fortes REAIS do briefing. Nunca inventar.
Os pontos fortes devem aparecer completos no conteúdo e abreviados (ex: L | D | Re | T) nas estruturas.

## QUALIDADE DE COPY
A copy deve parecer escrita por humano experiente. Sem estrutura robótica, sem padrões repetitivos.
ERRADO: "O empreendimento oferece excelente oportunidade de investimento"
CERTO: "Com investimento a partir de R$ 250 mil e renda estimada acima de R$ 44 mil por ano"

## CRITÉRIOS DE REPROVAÇÃO
Reprovar automaticamente qualquer criativo que: pareça anúncio imobiliário, use clichê, não tenha número, não tenha lógica clara, não conecte localização com demanda, não explique o "porquê".

## REGRA FINAL
Se estiver em dúvida entre ser bonito ou ser claro → ser claro.
Se estiver em dúvida entre ser criativo ou converter → converter.

## IDENTIDADE VISUAL
- Cores: Azul #0055FF, Navy #00143D, Coral #FC6058
- Fonte: Helvetica
- Logo SPOT com O vermelho/coral
- Elementos: pins de localização, fotos aéreas, fachadas, números grandes
- Disclaimer legal obrigatório no rodapé

## APRESENTADORA — MÔNICA MEDEIROS
- Sócia-Fundadora da Seazone
- Tom: autoridade — como se fosse dona do empreendimento. Mais credibilidade, menos atriz.
- Cenários: praia (roupa azul elegante) ou escritório/cidade (camiseta preta Seazone)
- Fala direto para câmera com naturalidade e confiança

## REGRAS VISUAIS PARA VÍDEOS
- NÃO usar efeitos que escureçam a imagem
- NÃO colocar molduras no vídeo
- NÃO borrar as laterais da tela
- SEMPRE colocar pin de SPOT onde é o terreno/prédio
- Mudanças de take leves — sem raios/efeitos escuros

## DO's
- Modelo SPOT pensado para short stay
- Gestão profissional Seazone (operação completa)
- Investimento com foco em performance e renda passiva
- Proximidade ao aeroporto

## DON'Ts
- NÃO dizer "ticket baixo" / posicionar como acessível
- NÃO dizer "vista para o mar" (só rooftop tem)
- NÃO dizer "pé na areia" (usar "proximidade com a praia")
- NÃO mencionar distância exata da praia
- NÃO dizer "único lançamento"
`;

const VALIDATOR_PROMPT = `
Após gerar, avalie CADA variação com estes 5 critérios (0-10):
1. Clareza (peso 20%) — Fácil de entender em 3 segundos?
2. Hook/Abertura (peso 25%) — Prende atenção ou parece mais do mesmo?
3. Construção de raciocínio (peso 20%) — Existe lógica ou só frases soltas?
4. Força comercial (peso 20%) — Ajuda a vender ou só informa?
5. Tom Seazone (peso 15%) — Investimento ou imobiliária genérica?

Score final = média ponderada. Classificação:
- 0-5: DESCARTAR | 6-7: AJUSTAR | 8: TESTAR | 9: ESCALAR | 10: EXCEPCIONAL

ALERTAS CRÍTICOS automáticos se houver: clichê imobiliário, falta de número, falta de localização, promessa vaga, ausência de CTA.
Se parecer anúncio de construtora, post bonito de Instagram, ou institucional genérico → REPROVAR sem hesitar.
`;

function buildPrompt(briefing: string, type: string) {
  const prompts: Record<string, string> = {
    estaticos: `Com base no briefing abaixo, gere PEÇAS ESTÁTICAS seguindo EXATAMENTE esta estrutura:

3 ESTRUTURAS:
- Estrutura 1: FACHADA como protagonista
- Estrutura 2: LOCALIZAÇÃO como protagonista (aérea/mapa)
- Estrutura 3: PRODUTO/INVESTIMENTO como protagonista

Para CADA estrutura, gere 5 VARIAÇÕES com:
- frase_destaque (headline principal — disruptiva, sem clichê)
- texto_secundario (complemento com dado financeiro)
- pontos_fortes_abreviados (ex: "L | ROI | Re" — só os que aparecem)
- badge (urgência, se aplicável)
- cta (chamada para ação)
- visual_fundo (qual imagem usar: fachada, aereo-pin, rooftop, aereo-praia, rooftop-render)

Gere também 1 LEGENDA única para cada estrutura (texto para o corpo do anúncio no Meta Ads).

${VALIDATOR_PROMPT}

Responda em JSON:
{
  "estruturas": [
    {
      "nome": "...",
      "foco": "fachada|localizacao|produto",
      "legenda": "...",
      "variacoes": [
        {
          "id": "E1V1",
          "frase_destaque": "...",
          "texto_secundario": "...",
          "pontos_fortes": "...",
          "badge": "...",
          "cta": "...",
          "visual_fundo": "...",
          "score": { "clareza": 0, "hook": 0, "construcao": 0, "comercial": 0, "tom": 0, "final": 0.0, "classificacao": "TESTAR" },
          "diagnostico": "..."
        }
      ]
    }
  ],
  "ranking": [
    { "posicao": 1, "id": "...", "score": 0.0, "motivo": "..." }
  ],
  "recomendacao": { "escalar": ["..."], "testar": ["..."], "ajustar": ["..."], "pausar": ["..."] }
}`,

    video_narrado: `Com base no briefing abaixo, gere VÍDEOS NARRADOS (sem apresentadora, narração em off):

2 ESTRUTURAS completas.
Para CADA estrutura, 5 VARIAÇÕES com:
- cenas numeradas com: tempo, visual (descrição exata da cena), narracao (texto do voice-over), texto_tela (overlay)
- direção de câmera (movimento, ângulo)
- transição entre cenas
- mood/música sugerida
- Duração: 3 variações de 30-40s, 2 variações de 10-20s

${VALIDATOR_PROMPT}

Responda em JSON:
{
  "estruturas": [
    {
      "nome": "...",
      "conceito": "...",
      "variacoes": [
        {
          "id": "VN-E1V1",
          "duracao": "35s",
          "mood": "...",
          "cenas": [
            { "numero": 1, "tempo": "0-5s", "visual": "...", "camera": "...", "narracao": "...", "texto_tela": "...", "transicao": "..." }
          ],
          "score": { "clareza": 0, "hook": 0, "construcao": 0, "comercial": 0, "tom": 0, "final": 0.0, "classificacao": "..." },
          "diagnostico": "..."
        }
      ]
    }
  ],
  "ranking": [ { "posicao": 1, "id": "...", "score": 0.0, "motivo": "..." } ],
  "recomendacao": { "escalar": [], "testar": [], "ajustar": [], "pausar": [] }
}`,

    video_apresentadora: `Com base no briefing abaixo, gere VÍDEOS COM APRESENTADORA (Mônica Medeiros, Sócia-Fundadora Seazone):

2 ESTRUTURAS completas.
Para CADA estrutura, 5 VARIAÇÕES com:
- Mônica como ESPECIALISTA (não atriz)
- Narrativa baseada em TESE (não apresentação genérica)
- cenas numeradas com: tempo, visual, camera, fala_monica (o que ela diz), texto_tela, transicao
- Testes A/B entre variações
- Duração: 3 variações de 30-40s, 2 variações de 10-20s

Tom da Mônica: Autoridade — como se fosse dona do empreendimento. Mais credibilidade, menos atriz.

${VALIDATOR_PROMPT}

Responda em JSON:
{
  "estruturas": [
    {
      "nome": "...",
      "tese": "...",
      "variacoes": [
        {
          "id": "VA-E1V1",
          "duracao": "35s",
          "cenas": [
            { "numero": 1, "tempo": "0-5s", "visual": "...", "camera": "...", "fala_monica": "...", "texto_tela": "...", "transicao": "..." }
          ],
          "score": { "clareza": 0, "hook": 0, "construcao": 0, "comercial": 0, "tom": 0, "final": 0.0, "classificacao": "..." },
          "diagnostico": "..."
        }
      ]
    }
  ],
  "ranking": [ { "posicao": 1, "id": "...", "score": 0.0, "motivo": "..." } ],
  "recomendacao": { "escalar": [], "testar": [], "ajustar": [], "pausar": [] }
}`,

    prompts_imagem: `Com base no briefing abaixo, gere 10 PROMPTS DE GERAÇÃO DE IMAGEM otimizados para Midjourney/DALL-E/Flux:

Para cada prompt:
- prompt_en (em inglês, otimizado para IA generativa)
- estilo (fotorrealista, render, aéreo, drone, lifestyle)
- aspect_ratio
- uso (onde será usado: fundo de estático, cena de vídeo, stories)
- negative_prompt (o que evitar)

Responda em JSON:
{
  "prompts": [
    { "id": "IMG1", "titulo": "...", "prompt_en": "...", "estilo": "...", "aspect_ratio": "...", "uso": "...", "negative": "..." }
  ]
}`
  };

  return `${PROMPT_MASTER}\n\n# BRIEFING DO EMPREENDIMENTO\n${briefing}\n\n# TAREFA\n${prompts[type] || prompts.estaticos}\n\nResponda APENAS com o JSON válido. Sem markdown, sem explicações, sem \`\`\`.`;
}

export async function POST(request: NextRequest) {
  try {
    const { briefing, type } = await request.json();
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key não configurada" }, { status: 500 });

    const isOR = apiKey.startsWith("sk-or-");
    const prompt = buildPrompt(briefing, type);

    if (isOR) {
      const models = ["anthropic/claude-sonnet-4", "anthropic/claude-3.5-sonnet", "anthropic/claude-3-5-sonnet-20241022"];
      let lastErr = "";

      for (const model of models) {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              model,
              max_tokens: 8000,
              messages: [
                { role: "system", content: prompt },
                { role: "user", content: "Gere os criativos. Responda APENAS com JSON válido." },
              ],
            }),
          });
          if (!res.ok) { lastErr = await res.text(); continue; }
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content || "";
          const clean = text.replace(/```json\n?|```\n?/g, "").trim();
          try { return NextResponse.json({ result: JSON.parse(clean), raw: text, model }); }
          catch { return NextResponse.json({ result: null, raw: text, model }); }
        } catch (e: any) { lastErr = e.message; continue; }
      }
      return NextResponse.json({ error: `Nenhum modelo disponível. Último erro: ${lastErr}` }, { status: 500 });
    } else {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: prompt,
          messages: [{ role: "user", content: "Gere os criativos. Responda APENAS com JSON válido." }],
        }),
      });
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json\n?|```\n?/g, "").trim();
      try { return NextResponse.json({ result: JSON.parse(clean), raw: text }); }
      catch { return NextResponse.json({ result: null, raw: text }); }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
