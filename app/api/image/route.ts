import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, width, height } = await request.json();
    const falKey = process.env.FAL_KEY;

    if (!falKey) {
      // Fallback to Pollinations (free)
      const encoded = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 999999);
      const url = `https://image.pollinations.ai/prompt/${encoded}?width=${width || 1080}&height=${height || 1080}&seed=${seed}&nologo=true&enhance=true`;
      return NextResponse.json({ url, source: "pollinations" });
    }

    // Use Flux Pro via fal.ai for premium quality
    const response = await fetch("https://queue.fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${falKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: { width: width || 1080, height: height || 1080 },
        num_images: 1,
        enable_safety_checker: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      // Fallback to Pollinations
      const encoded = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 999999);
      const url = `https://image.pollinations.ai/prompt/${encoded}?width=${width || 1080}&height=${height || 1080}&seed=${seed}&nologo=true&enhance=true`;
      return NextResponse.json({ url, source: "pollinations", note: `fal.ai indisponível: ${err}` });
    }

    const data = await response.json();
    const imageUrl = data.images?.[0]?.url;

    if (imageUrl) {
      return NextResponse.json({ url: imageUrl, source: "fal-flux-pro" });
    }

    // If queue-based, return request ID
    return NextResponse.json({ 
      request_id: data.request_id,
      source: "fal-flux-pro",
      message: "Imagem sendo gerada..."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
