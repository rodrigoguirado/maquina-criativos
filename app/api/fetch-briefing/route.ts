import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 })
    }

    // Fetch the Lovable page HTML
    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const html = await pageRes.text()

    // Use Claude to extract briefing data from the HTML
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
            content: `Extraia os dados do briefing deste HTML de um empreendimento imobiliário Seazone SPOT. 
            
Retorne APENAS JSON válido (sem markdown, sem backticks):
{"empreendimento":"nome","localizacao":"endereço completo","ticket_medio":"valor","menor_cota":"valor","roi":"percentual","renda_liquida_ano":"valor/ano","renda_liquida_mes":"valor/mês","valorizacao":"percentual","cotas":"quantidade","gestao":"Gestão completa pela Seazone","disclaimer":"*Projeção estimada. Este material tem caráter exclusivamente informativo e não constitui promessa de rentabilidade futura ou garantia de retorno financeiro."}

Se algum campo não estiver no HTML, use "N/D".

HTML (primeiros 5000 caracteres):
${html.slice(0, 5000)}`
          }
        ],
        max_tokens: 1000,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Erro ao processar briefing' }, { status: 500 })
    }

    const text = data.choices?.[0]?.message?.content || ''

    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({ briefing: parsed })
      }
    } catch (e) {
      // fall through
    }

    return NextResponse.json({ error: 'Não foi possível extrair o briefing' }, { status: 500 })
  } catch (err: any) {
    console.error('Fetch briefing error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
