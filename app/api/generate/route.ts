import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const SEAZONE_CONTEXT = `Você é uma IA especialista em criação de criativos de alta conversão para investimentos em Airbnb operados pela Seazone.

TOM DE VOZ OBRIGATÓRIO:
- Consultivo, direto, orientado a decisão
- Sem floreio, sem clichê, baseado em argumento
- Focada em investimento, não em imóvel
- Direta sobre dinheiro — números claros
- Sem linguagem de construtora/imobiliária

PROIBIDO: "oportunidade imperdível", "qualidade de vida", "viva bem", "paraíso", "alto padrão", linguagem emocional genérica.

ESTRUTURA OBRIGATÓRIA de todo criativo:
1. Quebra de padrão
2. Construção de raciocínio
3. Prova (localização + dados)
4. Produto como consequência
5. Número
6. Remoção de fricção (gestão Seazone)
7. CTA

Se essa sequência não estiver presente, o criativo está errado.
A copy deve parecer escrita por humano experiente, sem estrutura robótica.

FOTOS DISPONÍVEIS para fundo (use exatamente estes nomes):
fachada, fachada-lateral, fachada-close, fachada-render, aereo-pin, aereo-tag, rooftop, rooftop-vista, praia`

export async function POST(req: NextRequest) {
  try {
    const { type, briefing } = await req.json()

    let userPrompt = ''

    if (type === 'static') {
      userPrompt = `Com base neste briefing, gere EXATAMENTE 1 peça estática para Instagram (formato 4:5).

BRIEFING: ${JSON.stringify(briefing)}

LAYOUT DA PEÇA (seguir exatamente):
- TOPO: pill com localização do empreendimento
- MEIO: foto de fundo do empreendimento (60% da peça)
- ABAIXO DA FOTO: fundo navy escuro com headline impactante (palavras-chave em negrito)
- NÚMERO DESTAQUE: valor financeiro grande dentro de cápsula arredondada (ex: "R$ 5.535 líquidos por mês*" ou "Invista a partir de R$ 335 mil")
- RODAPÉ: texto de gestão + logos

Responda APENAS com JSON válido (sem markdown, sem backticks, sem texto antes ou depois):
{"localizacao_pill":"texto curto da localização (ex: Campeche • Florianópolis)","headline":"frase impactante com palavras-chave entre ** para bold (ex: Airbnb **pé na areia** em Florianópolis)","numero_prefixo":"texto antes do número grande (ex: R$ ou Invista a partir de R$)","numero_destaque":"número grande (ex: 5.535 ou 335 mil)","numero_sufixo":"texto depois do número (ex: líquidos por mês* ou )","texto_gestao":"frase de gestão (ex: Gestão **operacional e estratégica completa** Seazone)","fundo":"qual foto usar: fachada, fachada-lateral, aereo-pin, rooftop, praia, aereo-tag, rooftop-vista, fachada-close ou fachada-render","badge":"badge de urgência curto ou null","score":{"hook":8,"clareza":8,"argumento":8,"comercial":8,"tom":8}}`
    } else if (type === 'video-narrado') {
      userPrompt = `Com base neste briefing, gere EXATAMENTE 1 roteiro de vídeo narrado (formato Reels 9:16, 15-30 segundos).

BRIEFING: ${JSON.stringify(briefing)}

Responda APENAS com JSON válido (sem markdown, sem backticks):
{"titulo":"nome do criativo","duracao":"duração em segundos","cenas":[{"numero":1,"duracao":"Xs","visual":"descrição do que aparece","narracao":"texto da narração","overlay_texto":"texto sobreposto ou null"}],"prompt_video":"prompt em inglês para gerar este vídeo com IA Kling, max 200 palavras","score":{"hook":8,"clareza":8,"argumento":8,"comercial":8,"tom":8}}`
    } else if (type === 'video-monica') {
      userPrompt = `Com base neste briefing, gere EXATAMENTE 1 roteiro de vídeo com Mônica Medeiros (sócia-fundadora Seazone, formato Reels 9:16, 20-40 segundos). Tom de autoridade, direto pra câmera, consultivo.

BRIEFING: ${JSON.stringify(briefing)}

Responda APENAS com JSON válido (sem markdown, sem backticks):
{"titulo":"nome do criativo","duracao":"duração em segundos","cenario":"praia ou escritório","cenas":[{"numero":1,"duracao":"Xs","enquadramento":"plano médio/close/aberto","fala_monica":"texto que ela fala","overlay_texto":"texto na tela ou null","direcao":"direção de cena"}],"prompt_video":"prompt em inglês para gerar vídeo com IA Kling de mulher brasileira ~35 anos falando pra câmera, max 200 palavras","score":{"hook":8,"clareza":8,"argumento":8,"comercial":8,"tom":8}}`
    } else {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY não configurada' }, { status: 500 })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: SEAZONE_CONTEXT },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenRouter error:', JSON.stringify(data))
      return NextResponse.json({ error: data.error?.message || 'API error: ' + response.status }, { status: 500 })
    }

    const text = data.choices?.[0]?.message?.content
    if (!text) {
      console.error('No content:', JSON.stringify(data))
      return NextResponse.json({ error: 'Resposta vazia. Verifique créditos no OpenRouter.' }, { status: 500 })
    }

    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({ result: parsed })
      }
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr)
    }

    return NextResponse.json({ error: 'Não foi possível interpretar a resposta da IA' }, { status: 500 })
  } catch (err: any) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
