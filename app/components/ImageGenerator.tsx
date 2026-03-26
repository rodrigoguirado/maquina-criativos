"use client";
import { useState } from "react";

interface ImagePrompt {
  id: string;
  titulo: string;
  prompt: string;
  aspect: "square" | "portrait" | "landscape";
  uso: string;
}

const ASPECT_MAP = {
  square: { w: 1080, h: 1080 },
  portrait: { w: 1080, h: 1920 },
  landscape: { w: 1200, h: 628 },
};

const DEFAULT_PROMPTS: ImagePrompt[] = [
  {
    id: "IMG1",
    titulo: "Vista aérea Praia do Campeche",
    prompt: "aerial drone shot of a stunning tropical beach in Florianopolis Brazil, turquoise ocean water, white sand, lush green coastline, golden hour lighting, photorealistic, 8k, cinematic",
    aspect: "landscape",
    uso: "Background para anúncios e abertura de vídeos",
  },
  {
    id: "IMG2",
    titulo: "Fachada moderna do empreendimento",
    prompt: "modern luxury apartment building facade, contemporary architecture, glass balconies, tropical landscaping, palm trees, blue sky, real estate photography, professional architectural render, 8k",
    aspect: "portrait",
    uso: "Destaque de fachada nos criativos",
  },
  {
    id: "IMG3",
    titulo: "Rooftop com vista mar ao pôr do sol",
    prompt: "luxury rooftop terrace with infinity pool overlooking the ocean at sunset, modern furniture, warm golden light, tropical setting, premium real estate photography, 8k cinematic",
    aspect: "square",
    uso: "Encerramento de vídeos e peças aspiracionais",
  },
  {
    id: "IMG4",
    titulo: "Interior apartamento Airbnb premium",
    prompt: "modern minimalist apartment interior, bright and airy, white walls, designer furniture, ocean view through large window, airbnb style, warm natural lighting, interior photography, 8k",
    aspect: "square",
    uso: "Mostrar qualidade do produto",
  },
  {
    id: "IMG5",
    titulo: "Lifestyle surfista Campeche",
    prompt: "young professional surfer walking on beautiful brazilian beach carrying surfboard, Florianopolis Campeche beach, golden hour, lifestyle photography, authentic natural moment, 8k",
    aspect: "portrait",
    uso: "Stories e conteúdo de lifestyle",
  },
  {
    id: "IMG6",
    titulo: "Vista panorâmica da região",
    prompt: "panoramic aerial view of Campeche neighborhood Florianopolis Brazil, beach coastline, urban area with modern buildings, mountains in background, real estate development area, drone photography, 8k",
    aspect: "landscape",
    uso: "Contextualização da localização",
  },
  {
    id: "IMG7",
    titulo: "Investimento e dados financeiros",
    prompt: "clean modern business background, abstract blue gradient with subtle geometric shapes, corporate finance aesthetic, minimalist, perfect for text overlay, 8k",
    aspect: "square",
    uso: "Background para overlays com dados financeiros",
  },
  {
    id: "IMG8",
    titulo: "Infraestrutura do bairro",
    prompt: "charming tropical neighborhood street with modern cafes restaurants and bike lanes, palm trees, young professionals, Florianopolis Brazil urban lifestyle, warm afternoon light, street photography, 8k",
    aspect: "landscape",
    uso: "Mostrar infraestrutura e estilo de vida local",
  },
  {
    id: "IMG9",
    titulo: "Background para anúncio escuro",
    prompt: "dark navy blue abstract background with subtle wave patterns and light blue accents, corporate luxury real estate aesthetic, perfect for white text overlay, minimalist elegant, 8k",
    aspect: "square",
    uso: "Background para peças com texto branco",
  },
  {
    id: "IMG10",
    titulo: "Praia ao entardecer - aspiracional",
    prompt: "beautiful tropical beach sunset in Florianopolis Brazil, silhouette of modern building, warm orange and blue sky, reflection on wet sand, cinematic mood, travel destination photography, 8k",
    aspect: "portrait",
    uso: "Stories aspiracionais e encerramento",
  },
];

function pollinationsUrl(prompt: string, w: number, h: number, seed?: number): string {
  const encoded = encodeURIComponent(prompt);
  const s = seed || Math.floor(Math.random() * 999999);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&seed=${s}&nologo=true&enhance=true`;
}

export default function ImageGenerator() {
  const [images, setImages] = useState<Record<string, { url: string; loading: boolean; error?: string }>>({});
  const [generatingAll, setGeneratingAll] = useState(false);

  function generateOne(prompt: ImagePrompt) {
    const dims = ASPECT_MAP[prompt.aspect];
    setImages(prev => ({
      ...prev,
      [prompt.id]: { url: pollinationsUrl(prompt.prompt, dims.w, dims.h), loading: true },
    }));
  }

  async function generateAll() {
    setGeneratingAll(true);
    for (const p of DEFAULT_PROMPTS) {
      generateOne(p);
      await new Promise(r => setTimeout(r, 500)); // small delay between requests
    }
    setGeneratingAll(false);
  }

  function handleImageLoad(id: string) {
    setImages(prev => ({ ...prev, [id]: { ...prev[id], loading: false } }));
  }

  function handleImageError(id: string) {
    setImages(prev => ({ ...prev, [id]: { ...prev[id], loading: false, error: "Erro ao gerar" } }));
  }

  function regenerate(prompt: ImagePrompt) {
    const dims = ASPECT_MAP[prompt.aspect];
    setImages(prev => ({
      ...prev,
      [prompt.id]: { url: pollinationsUrl(prompt.prompt, dims.w, dims.h, Math.floor(Math.random() * 999999)), loading: true },
    }));
  }

  const generatedCount = Object.values(images).filter(i => !i.loading && !i.error).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-sz-navy">Geração de Imagens com IA</h3>
          <p className="text-xs text-sz-gray">
            {generatedCount > 0 ? `${generatedCount}/${DEFAULT_PROMPTS.length} imagens geradas` : "Clique para gerar imagens reais com IA"}
          </p>
        </div>
        <button
          onClick={generateAll}
          disabled={generatingAll}
          className="bg-sz-blue hover:bg-sz-blue-dark disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {generatingAll ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
            </svg>
          ) : "🎨"}
          {generatingAll ? "Gerando..." : "Gerar todas as imagens"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEFAULT_PROMPTS.map((p) => {
          const img = images[p.id];
          const dims = ASPECT_MAP[p.aspect];
          const previewH = p.aspect === "portrait" ? 320 : p.aspect === "landscape" ? 180 : 250;

          return (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-fade-in hover:shadow-md transition-shadow">
              {/* Image area */}
              <div
                className="relative bg-sz-navy/5 flex items-center justify-center overflow-hidden"
                style={{ height: previewH }}
              >
                {img && !img.error ? (
                  <>
                    {img.loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-sz-navy/10 z-10">
                        <svg className="animate-spin h-8 w-8 text-sz-blue mb-2" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                        </svg>
                        <span className="text-xs text-sz-gray">Gerando com IA...</span>
                      </div>
                    )}
                    <img
                      src={img.url}
                      alt={p.titulo}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${img.loading ? "opacity-0" : "opacity-100"}`}
                      onLoad={() => handleImageLoad(p.id)}
                      onError={() => handleImageError(p.id)}
                    />
                  </>
                ) : img?.error ? (
                  <div className="text-center p-4">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-xs text-sz-gray mt-1">{img.error}</p>
                    <button onClick={() => regenerate(p)} className="text-xs text-sz-blue mt-2 hover:underline">Tentar novamente</button>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <span className="text-4xl opacity-30">🖼️</span>
                    <p className="text-xs text-sz-gray mt-2">Clique em "Gerar" abaixo</p>
                  </div>
                )}

                {/* Format badge */}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
                  {dims.w}×{dims.h}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold text-sz-blue">{p.id}</span>
                    <h4 className="text-sm font-medium text-sz-navy">{p.titulo}</h4>
                  </div>
                </div>
                <p className="text-xs text-sz-gray mb-3">{p.uso}</p>

                <div className="flex gap-2">
                  {!img || img.error ? (
                    <button
                      onClick={() => generateOne(p)}
                      className="flex-1 bg-sz-blue hover:bg-sz-blue-dark text-white text-xs font-medium py-2 rounded-lg transition-colors"
                    >
                      Gerar imagem
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => regenerate(p)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-sz-navy text-xs font-medium py-2 rounded-lg transition-colors"
                      >
                        ↻ Regenerar
                      </button>
                      {!img.loading && (
                        <a
                          href={img.url}
                          download={`seazone-${p.id}.png`}
                          target="_blank"
                          className="bg-sz-green hover:bg-sz-green/80 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                        >
                          ↓ Baixar
                        </a>
                      )}
                    </>
                  )}
                </div>

                {/* Prompt (collapsible) */}
                <details className="mt-3">
                  <summary className="text-xs text-sz-gray cursor-pointer hover:text-sz-blue">Ver prompt</summary>
                  <p className="text-xs text-sz-gray mt-1 font-mono bg-slate-50 p-2 rounded">{p.prompt}</p>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
