import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300 // 5 min timeout for video generation

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const falKey = process.env.FAL_KEY

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 })
    }

    // Submit video generation job
    const response = await fetch('https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        duration: '5',
        aspect_ratio: '9:16',
      }),
    })

    const data = await response.json()

    // Direct result
    if (data.video?.url) {
      return NextResponse.json({ url: data.video.url })
    }

    // Queue-based: poll for completion
    if (data.request_id) {
      let attempts = 0
      while (attempts < 90) { // up to 3 min polling
        await new Promise(r => setTimeout(r, 2000))
        const statusResp = await fetch(
          `https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video/requests/${data.request_id}/status`,
          { headers: { 'Authorization': `Key ${falKey}` } }
        )
        const statusData = await statusResp.json()
        
        if (statusData.status === 'COMPLETED') {
          const resultResp = await fetch(
            `https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video/requests/${data.request_id}`,
            { headers: { 'Authorization': `Key ${falKey}` } }
          )
          const resultData = await resultResp.json()
          return NextResponse.json({ url: resultData.video?.url })
        }
        if (statusData.status === 'FAILED') {
          return NextResponse.json({ error: 'Video generation failed' }, { status: 500 })
        }
        attempts++
      }
      return NextResponse.json({ error: 'Timeout — video still processing. Try again.' }, { status: 408 })
    }

    return NextResponse.json({ error: 'Unexpected response', data }, { status: 500 })
  } catch (err: any) {
    console.error('Video generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
