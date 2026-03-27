import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { prompt, request_id } = await req.json()
    const falKey = process.env.FAL_KEY

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY não configurada' }, { status: 500 })
    }

    // If request_id provided, check status
    if (request_id) {
      const statusResp = await fetch(
        `https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video/requests/${request_id}/status`,
        { headers: { 'Authorization': `Key ${falKey}` } }
      )
      const statusData = await statusResp.json()

      if (statusData.status === 'COMPLETED') {
        const resultResp = await fetch(
          `https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video/requests/${request_id}`,
          { headers: { 'Authorization': `Key ${falKey}` } }
        )
        const resultData = await resultResp.json()
        return NextResponse.json({ status: 'COMPLETED', url: resultData.video?.url })
      }

      if (statusData.status === 'FAILED') {
        return NextResponse.json({ status: 'FAILED', error: 'Geração de vídeo falhou' })
      }

      return NextResponse.json({ status: statusData.status || 'IN_PROGRESS' })
    }

    // Submit new video generation job
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

    if (!response.ok) {
      const errText = await response.text()
      console.error('fal.ai video error:', response.status, errText)
      return NextResponse.json({ error: `fal.ai erro ${response.status}: ${errText.slice(0, 200)}` }, { status: 500 })
    }

    const data = await response.json()

    // Direct result (unlikely for video)
    if (data.video?.url) {
      return NextResponse.json({ status: 'COMPLETED', url: data.video.url })
    }

    // Return request_id for client-side polling
    if (data.request_id) {
      return NextResponse.json({ status: 'QUEUED', request_id: data.request_id })
    }

    console.error('fal.ai unexpected response:', JSON.stringify(data))
    return NextResponse.json({ error: 'Resposta inesperada do fal.ai' }, { status: 500 })
  } catch (err: any) {
    console.error('Video generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
