import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const falKey = process.env.FAL_KEY

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY não configurada' }, { status: 500 })
    }

    // === POLLING: check status of existing request ===
    if (body.request_id) {
      try {
        const statusResp = await fetch(
          `https://queue.fal.run/requests/${body.request_id}/status`,
          { 
            method: 'GET',
            headers: { 'Authorization': `Key ${falKey}` } 
          }
        )
        
        if (!statusResp.ok) {
          const errText = await statusResp.text()
          return NextResponse.json({ error: `Status check failed: ${statusResp.status} - ${errText.slice(0, 200)}` }, { status: 500 })
        }

        const statusData = await statusResp.json()

        if (statusData.status === 'COMPLETED') {
          // Fetch the result
          const resultResp = await fetch(
            `https://queue.fal.run/requests/${body.request_id}`,
            { 
              method: 'GET',
              headers: { 'Authorization': `Key ${falKey}` } 
            }
          )
          const resultData = await resultResp.json()
          const videoUrl = resultData?.video?.url || resultData?.output?.video?.url
          return NextResponse.json({ status: 'COMPLETED', url: videoUrl })
        }

        if (statusData.status === 'FAILED') {
          return NextResponse.json({ status: 'FAILED', error: statusData.error || 'Geração falhou' })
        }

        // Still processing
        return NextResponse.json({ 
          status: statusData.status || 'IN_PROGRESS',
          position: statusData.queue_position 
        })
      } catch (pollErr: any) {
        return NextResponse.json({ error: `Poll error: ${pollErr.message}` }, { status: 500 })
      }
    }

    // === SUBMIT: new video generation job ===
    if (!body.prompt) {
      return NextResponse.json({ error: 'Prompt não fornecido' }, { status: 400 })
    }

    const submitResp = await fetch('https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: body.prompt,
        duration: '5',
        aspect_ratio: '9:16',
      }),
    })

    if (!submitResp.ok) {
      const errText = await submitResp.text()
      return NextResponse.json({ error: `fal.ai erro ${submitResp.status}: ${errText.slice(0, 300)}` }, { status: 500 })
    }

    const submitData = await submitResp.json()

    // Direct result (unlikely for video)
    if (submitData?.video?.url) {
      return NextResponse.json({ status: 'COMPLETED', url: submitData.video.url })
    }

    // Queue response
    if (submitData.request_id) {
      return NextResponse.json({ status: 'QUEUED', request_id: submitData.request_id })
    }

    return NextResponse.json({ error: `Resposta inesperada: ${JSON.stringify(submitData).slice(0, 300)}` }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 })
  }
}
