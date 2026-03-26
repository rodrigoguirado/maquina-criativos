import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

fal.config({ credentials: process.env.FAL_KEY })

export async function POST(req: NextRequest) {
  try {
    const { prompt, type = 'image' } = await req.json()
    if (type === 'video') {
      const result = await fal.subscribe('fal-ai/kling-video/v1.6/standard/text-to-video', { input: { prompt, duration: '5', aspect_ratio: '9:16' } }) as any
      return NextResponse.json({ url: result.data?.video?.url })
    }
    const result = await fal.subscribe('fal-ai/flux/schnell', { input: { prompt, image_size: 'square_hd', num_images: 1 } }) as any
    return NextResponse.json({ url: result.data?.images?.[0]?.url })
  } catch (err: any) {
    console.error('fal.ai error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
