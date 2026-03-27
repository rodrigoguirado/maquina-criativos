import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const FAL_MODEL = 'fal-ai/kling-video/v1.6/standard/text-to-video'

// Try to find video URL in any response structure
function findVideoUrl(data: any): string | null {
  if (!data) return null
  // Direct video.url
  if (data.video?.url) return data.video.url
  // Output wrapper
  if (data.output?.video?.url) return data.output.video.url
  // Array of videos
  if (data.videos?.[0]?.url) return data.videos[0].url
  // Data wrapper
  if (data.data?.video?.url) return data.data.video.url
  // Direct URL field
  if (data.url && typeof data.url === 'string') return data.url
  // Search recursively for any .url that looks like a video
  const json = JSON.stringify(data)
  const urlMatch = json.match(/"url"\s*:\s*"(https:\/\/[^"]+\.mp4[^"]*)"/i) 
    || json.match(/"url"\s*:\s*"(https:\/\/[^"]+video[^"]*)"/i)
    || json.match(/"url"\s*:\s*"(https:\/\/v3\.fal\.media[^"]*)"/i)
    || json.match(/"url"\s*:\s*"(https:\/\/fal\.media[^"]*)"/i)
  if (urlMatch) return urlMatch[1]
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const falKey = process.env.FAL_KEY

    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY não configurada' }, { status: 500 })
    }

    // === POLLING ===
    if (body.request_id) {
      const statusUrl = `https://queue.fal.run/${FAL_MODEL}/requests/${body.request_id}/status`
      const statusResp = await fetch(statusUrl, {
        method: 'GET',
        headers: { 'Authorization': `Key ${falKey}`, 'Accept': 'application/json' },
      })
      const statusText = await statusResp.text()
      let statusData: any
      try { statusData = JSON.parse(statusText) } catch { 
        return NextResponse.json({ error: `Poll parse error: ${statusText.slice(0, 200)}` }, { status: 500 }) 
      }

      if (statusData.status === 'COMPLETED') {
        const resultUrl = `https://queue.fal.run/${FAL_MODEL}/requests/${body.request_id}`
        const resultResp = await fetch(resultUrl, {
          method: 'GET',
          headers: { 'Authorization': `Key ${falKey}`, 'Accept': 'application/json' },
        })
        const resultText = await resultResp.text()
        let resultData: any
        try { resultData = JSON.parse(resultText) } catch {
          return NextResponse.json({ error: `Result parse error: ${resultText.slice(0, 200)}` }, { status: 500 })
        }
        const videoUrl = findVideoUrl(resultData)
        if (videoUrl) {
          return NextResponse.json({ status: 'COMPLETED', url: videoUrl })
        }
        return NextResponse.json({ error: `URL do vídeo não encontrada. Resposta: ${JSON.stringify(resultData).slice(0, 500)}` }, { status: 500 })
      }

      if (statusData.status === 'FAILED') {
        return NextResponse.json({ status: 'FAILED', error: statusData.error || 'Geração falhou' })
      }

      return NextResponse.json({ status: statusData.status || 'IN_QUEUE' })
    }

    // === SUBMIT ===
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
    let submitData: any
    try { submitData = JSON.parse(submitText) } catch {
      return NextResponse.json({ error: `Submit parse error: ${submitText.slice(0, 200)}` }, { status: 500 })
    }

    if (!submitResp.ok) {
      return NextResponse.json({ error: `fal.ai erro ${submitResp.status}: ${JSON.stringify(submitData).slice(0, 300)}` }, { status: 500 })
    }

    // Check if result came back directly (sync response)
    const directUrl = findVideoUrl(submitData)
    if (directUrl) {
      return NextResponse.json({ status: 'COMPLETED', url: directUrl })
    }

    // Queue response
    if (submitData.request_id) {
      return NextResponse.json({ status: 'QUEUED', request_id: submitData.request_id })
    }

    // Unknown response - return it for debugging
    return NextResponse.json({ error: `Resposta fal.ai: ${JSON.stringify(submitData).slice(0, 500)}` }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 })
  }
}
