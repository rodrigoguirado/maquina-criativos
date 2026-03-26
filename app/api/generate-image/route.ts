import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const falKey = process.env.FAL_KEY

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 })
    }

    const response = await fetch('https://queue.fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: { width: 1080, height: 1350 },
        num_images: 1,
        enable_safety_checker: false,
      }),
    })

    const data = await response.json()
    
    if (data.images?.[0]?.url) {
      return NextResponse.json({ url: data.images[0].url })
    }
    
    // If queue-based, poll for result
    if (data.request_id) {
      let attempts = 0
      while (attempts < 30) {
        await new Promise(r => setTimeout(r, 2000))
        const statusResp = await fetch(`https://queue.fal.run/fal-ai/flux/schnell/requests/${data.request_id}/status`, {
          headers: { 'Authorization': `Key ${falKey}` }
        })
        const statusData = await statusResp.json()
        if (statusData.status === 'COMPLETED') {
          const resultResp = await fetch(`https://queue.fal.run/fal-ai/flux/schnell/requests/${data.request_id}`, {
            headers: { 'Authorization': `Key ${falKey}` }
          })
          const resultData = await resultResp.json()
          return NextResponse.json({ url: resultData.images?.[0]?.url })
        }
        if (statusData.status === 'FAILED') {
          return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
        }
        attempts++
      }
    }

    return NextResponse.json({ error: 'Unexpected response', data }, { status: 500 })
  } catch (err: any) {
    console.error('Image generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
