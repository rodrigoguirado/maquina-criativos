import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const falKey = process.env.FAL_KEY

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY não configurada' }, { status: 500 })
    }

    // === POLLING: check status ===
    if (body.request_id) {
      // fal.ai status endpoint uses POST not GET
      const statusUrl = `https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video/requests/${body.request_id}/status`
      const statusResp = await fetch(statusUrl, {
        method: 'POST',
        headers: { 
          'Authorization': `Key ${falKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      // If POST doesn't work, try GET
      let statusText = ''
      if (statusResp.status === 405) {
        const getResp = await fetch(statusUrl, {
          method: 'GET',
          headers: { 'Authorization': `Key ${falKey}` },
        })
        statusText = await getResp.text()
      } else {
        statusText = await statusResp.text()
      }

      // Try alternative URL format if still failing
      if (statusText.includes('Method Not Allowed') || statusText.includes('405')) {
        const altUrl = `https://rest.alpha.fal.ai/fal-ai/kling-video/v1.6/standard/text-to-video/requests/${body.request_id}/status`
        const altResp = await fetch(altUrl, {
          method: 'GET',
          headers: { 'Authorization': `Key ${falKey}` },
        })
        statusText = await altResp.text()
      }

      let statusData: any
      try { 
        statusData = JSON.parse(statusText) 
      } catch {
        return NextResponse.json({ error: `Poll error: ${statusText.slice(0, 300)}` }, { status: 500 })
      }

      if (statusData.status === 'COMPLETED') {
        // Fetch result
        const resultUrl = `https://queue.fal.run/fal-ai/kling-video/v1.6/standard/text-to-video/requests/${body.request_id}`
        let resultText = ''
        
        // Try POST first, then GET
        const resultResp = await fetch(resultUrl, {
          method: 'POST',
          headers: { 'Authorization': `Key ${falKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        if (resultResp.status === 405) {
          const getResp = await fetch(resultUrl, {
            method: 'GET',
            headers: { 'Authorization': `Key ${falKey}` },
          })
          resultText = await getResp.text()
        } else {
          resultText = await resultResp.text()
        }

        let resultData: any
        try { resultData = JSON.parse(resultText) } catch {
          return NextResponse.json({ error: `Result parse error` }, { status: 500 })
        }

        // Find video URL in response
        const url = resultData?.video?.url 
          || resultData?.output?.video?.url 
          || resultData?.videos?.[0]?.url
        
        if (url) return NextResponse.json({ status: 'COMPLETED', url })
        
        // Search for any URL that looks like video
        const json = JSON.stringify(resultData)
        const match = json.match(/"url"\s*:\s*"(https:\/\/[^"]*(?:\.mp4|fal\.media|video)[^"]*)"/i)
        if (match) return NextResponse.json({ status: 'COMPLETED', url: match[1] })

        return NextResponse.json({ error: `Video URL not found: ${json.slice(0, 500)}` }, { status: 500 })
      }

      if (statusData.status === 'FAILED') {
        return NextResponse.json({ status: 'FAILED', error: statusData.error || 'Falhou' })
      }

      return NextResponse.json({ status: statusData.status || 'IN_QUEUE' })
    }

    // === SUBMIT new job ===
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

    const submitText = await submitResp.text()
    let submitData: any
    try { submitData = JSON.parse(submitText) } catch {
      return NextResponse.json({ error: `Submit error: ${submitText.slice(0, 300)}` }, { status: 500 })
    }

    if (!submitResp.ok) {
      return NextResponse.json({ error: `fal.ai ${submitResp.status}: ${JSON.stringify(submitData).slice(0, 300)}` }, { status: 500 })
    }

    // Check direct result
    const directUrl = submitData?.video?.url || submitData?.videos?.[0]?.url
    if (directUrl) return NextResponse.json({ status: 'COMPLETED', url: directUrl })

    // Queue response
    if (submitData.request_id) {
      return NextResponse.json({ status: 'QUEUED', request_id: submitData.request_id })
    }

    return NextResponse.json({ error: `Unexpected: ${JSON.stringify(submitData).slice(0, 300)}` }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
