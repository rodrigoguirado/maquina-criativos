import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, image_url } = await request.json();
    const falKey = process.env.FAL_KEY;

    if (!falKey) {
      return NextResponse.json({ 
        error: "FAL_KEY não configurada. Adicione nas variáveis de ambiente.",
        setup: "Acesse fal.ai → Keys → Crie uma API key → Adicione como FAL_KEY na Vercel" 
      }, { status: 500 });
    }

    // Use Kling for video generation via fal.ai
    const response = await fetch("https://queue.fal.run/fal-ai/kling-video/v1.6/standard/image-to-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${falKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        image_url: image_url,
        duration: "5",
        aspect_ratio: "9:16",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Erro fal.ai: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    
    // fal.ai queue returns a request_id for async processing
    return NextResponse.json({ 
      request_id: data.request_id,
      status_url: data.status_url,
      message: "Vídeo sendo gerado... aguarde 1-3 minutos"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
