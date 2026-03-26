import { NextRequest, NextResponse } from 'next/server'

const SEAZONE_SYSTEM = `Você é uma IA especialista em criação de criativos de alta conversão para investimentos em Airbnb operados pela Seazone.

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
A copy deve parecer escrita por humano experiente, sem estrutura robótica.`

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        messages: [
          { role: 'system', content: SEAZONE_SYSTEM },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
      }),
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || 'Erro na geração'
    
    return NextResponse.json({ text })
  } catch (err: any) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
