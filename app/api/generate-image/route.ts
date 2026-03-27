import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const falKey = process.env.FAL_KEY

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY não configurada' }, { status: 500 })
    }

    // Use fal.ai synchronous endpoint
    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: { width: 1080, height: 1350 },
        num_images: 1,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('fal.ai image error:', response.status, errText)
      return NextResponse.json({ error: `fal.ai erro ${response.status}: ${errText.slice(0, 200)}` }, { status: 500 })
    }

    const data = await response.json()

    if (data.images?.[0]?.url) {
      return NextResponse.json({ url: data.images[0].url })
    }

    console.error('fal.ai unexpected response:', JSON.stringify(data))
    return NextResponse.json({ error: 'Resposta inesperada do fal.ai' }, { status: 500 })
  } catch (err: any) {
    console.error('Image generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
