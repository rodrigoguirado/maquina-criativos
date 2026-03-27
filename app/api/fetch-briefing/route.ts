import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 })
    }

    // Step 1: Use Jina Reader to render JavaScript and extract text
    const jinaUrl = `https://r.jina.ai/${url.trim()}`
    const jinaRes = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-Timeout': '30000',
        'X-Wait-For-Selector': 'body',
      },
    })

    if (!jinaRes.ok) {
      return NextResponse.json({ error: `Erro ao acessar página: ${jinaRes.status}` }, { status: 500 })
    }

    const pageText = await jinaRes.text()

    if (!pageText || pageText.length < 50) {
      return NextResponse.json({ error: 'Página retornou conteúdo vazio' }, { status: 500 })
    }

    // Step 2: Use Claude to extract structured briefing from the text
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
          {
            role: 'user',
            content: `Extraia os dados do briefing deste texto de um empreendimento imobiliário Seazone SPOT.

Procure por: nome do empreendimento, localização/endereço, ticket médio, menor cota, ROI, renda líquida anual, renda líquida mensal, valorização estimada, quantidade de cotas/unidades.

Retorne APENAS JSON válido (sem markdown, sem backticks, sem texto antes ou depois):
{"empreendimento":"nome do SPOT","localizacao":"endereço ou cidade","ticket_medio":"R$ valor","menor_cota":"R$ valor","roi":"percentual%","renda_liquida_ano":"R$ valor/ano","renda_liquida_mes":"R$ valor/mês","valorizacao":"percentual%","cotas":"X cotas","gestao":"Gestão completa pela Seazone","disclaimer":"*Projeção estimada. Este material tem caráter exclusivamente informativo e não constitui promessa de rentabilidade futura ou garantia de retorno financeiro."}

Se algum campo não for encontrado, use "N/D".

TEXTO DA PÁGINA:
${pageText.slice(0, 8000)}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Erro na API' }, { status: 500 })
    }

    const content = data.choices?.[0]?.message?.content || ''

    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({ briefing: parsed })
      }
    } catch (e) {
      console.error('Parse error:', e)
    }

    return NextResponse.json({ error: 'Não foi possível extrair dados da página' }, { status: 500 })
  } catch (err: any) {
    console.error('Fetch briefing error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
