import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const FAL_MODEL = 'fal-ai/kling-video/v1.6/standard/text-to-video'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const falKey = process.env.FAL_KEY

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY não configurada' }, { status: 500 })
    }

    // === POLLING: check status of existing request ===
    if (body.request_id) {
      const statusUrl = `https://queue.fal.run/${FAL_MODEL}/requests/${body.request_id}/status`
      
      const statusResp = await fetch(statusUrl, {
        method: 'GET',
        headers: { 
          'Authorization': `Key ${falKey}`,
          'Accept': 'application/json',
        },
      })

      const statusText = await statusResp.text()
      
      let statusData
      try {
        statusData = JSON.parse(statusText)
      } catch (e) {
        return NextResponse.json({ error: `Invalid status response: ${statusText.slice(0, 200)}` }, { status: 500 })
      }

      if (!statusResp.ok) {
        return NextResponse.json({ error: `Status error ${statusResp.status}: ${JSON.stringify(statusData).slice(0, 200)}` }, { status: 500 })
      }

      if (statusData.status === 'COMPLETED') {
        const resultUrl = `https://queue.fal.run/${FAL_MODEL}/requests/${body.request_id}`
        const resultResp = await fetch(resultUrl, {
          method: 'GET',
          headers: { 
            'Authorization': `Key ${falKey}`,
            'Accept': 'application/json',
          },
        })
        const resultText = await resultResp.text()
        let resultData
        try {
          resultData = JSON.parse(resultText)
        } catch (e) {
          return NextResponse.json({ error: `Invalid result response` }, { status: 500 })
        }
        const videoUrl = resultData?.video?.url
        return NextResponse.json({ status: 'COMPLETED', url: videoUrl })
      }

      if (statusData.status === 'FAILED') {
        return NextResponse.json({ status: 'FAILED', error: statusData.error || 'Geração falhou' })
      }

      return NextResponse.json({ status: statusData.status || 'IN_QUEUE' })
    }

    // === SUBMIT: new video generation job ===
    if (!body.prompt) {
      return NextResponse.json({ error: 'Prompt não fornecido' }, { status: 400 })
    }

    const submitResp = await fetch(`https://queue.fal.run/${FAL_MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        prompt: body.prompt,
        duration: '5',
        aspect_ratio: '9:16',
      }),
    })

    const submitText = await submitResp.text()
    
    let submitData
    try {
      submitData = JSON.parse(submitText)
    } catch (e) {
      return NextResponse.json({ error: `Invalid submit response: ${submitText.slice(0, 200)}` }, { status: 500 })
    }

    if (!submitResp.ok) {
      return NextResponse.json({ error: `fal.ai erro ${submitResp.status}: ${JSON.stringify(submitData).slice(0, 300)}` }, { status: 500 })
    }

    if (submitData?.video?.url) {
      return NextResponse.json({ status: 'COMPLETED', url: submitData.video.url })
    }

    if (submitData.request_id) {
      return NextResponse.json({ status: 'QUEUED', request_id: submitData.request_id })
    }

    return NextResponse.json({ error: `Resposta inesperada: ${JSON.stringify(submitData).slice(0, 300)}` }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 })
  }
}
