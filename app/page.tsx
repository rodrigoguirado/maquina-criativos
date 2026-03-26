'use client'
import { useState } from 'react'

// ========== BRIEFING DATA ==========
const DEFAULT_BRIEFING = {
  empreendimento: 'Novo Campeche SPOT II',
  localizacao: 'Rua Otávio Cruz, Campeche, Florianópolis-SC',
  ticket_medio: 'R$ 350.190',
  menor_cota: 'R$ 335.291',
  roi: '16,40%',
  renda_liquida_ano: 'R$ 66.424/ano',
  renda_liquida_mes: '~R$ 5.535/mês',
  valorizacao: '81%',
  cotas: '49 cotas + 3 lojas',
  gestao: 'Gestão completa pela Seazone',
  disclaimer: '*Projeção estimada. Este material tem caráter exclusivamente informativo e não constitui promessa de rentabilidade futura ou garantia de retorno financeiro.',
}

const FUNDOS: Record<string, string> = {
  'fachada': '/fachada-frontal.png',
  'fachada-lateral': '/fachada-lateral.png',
  'fachada-close': '/fachada-close.png',
  'fachada-render': '/fachada.png',
  'aereo-pin': '/aereo-pin-2.png',
  'aereo-tag': '/aereo-tag.png',
  'rooftop': '/rooftop.png',
  'rooftop-vista': '/rooftop-vista.png',
  'praia': '/aereo-praia.png',
}

// ========== SCORE COMPONENT ==========
function ScoreBar({ label, value, weight }: { label: string; value: number; weight: string }) {
  const color = value >= 8 ? '#22c55e' : value >= 6 ? '#eab308' : '#ef4444'
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 text-white/60">{label} <span className="text-[10px]">({weight})</span></span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value * 10}%`, background: color }} />
      </div>
      <span className="w-8 text-right font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

function ScoreCard({ score }: { score: any }) {
  if (!score) return null
  const weights = { hook: 0.25, clareza: 0.20, argumento: 0.20, comercial: 0.20, tom: 0.15 }
  const final = (
    (score.hook || 0) * weights.hook +
    (score.clareza || 0) * weights.clareza +
    (score.argumento || 0) * weights.argumento +
    (score.comercial || 0) * weights.comercial +
    (score.tom || 0) * weights.tom
  ).toFixed(1)
  const finalNum = parseFloat(final)
  const status = finalNum >= 9 ? 'ESCALAR' : finalNum >= 8 ? 'TESTAR' : finalNum >= 6 ? 'AJUSTAR' : 'DESCARTAR'
  const statusColor = finalNum >= 9 ? '#22c55e' : finalNum >= 8 ? '#3b82f6' : finalNum >= 6 ? '#eab308' : '#ef4444'

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-white/40">VALIDADOR SEAZONE</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black" style={{ color: statusColor }}>{final}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: statusColor, color: '#000' }}>{status}</span>
        </div>
      </div>
      <ScoreBar label="Hook" value={score.hook || 0} weight="25%" />
      <ScoreBar label="Clareza" value={score.clareza || 0} weight="20%" />
      <ScoreBar label="Argumento" value={score.argumento || 0} weight="20%" />
      <ScoreBar label="Comercial" value={score.comercial || 0} weight="20%" />
      <ScoreBar label="Tom Seazone" value={score.tom || 0} weight="15%" />
    </div>
  )
}

// ========== STATIC CREATIVE PREVIEW ==========
function StaticPreview({ data }: { data: any }) {
  const bgImage = FUNDOS[data.fundo] || FUNDOS['fachada']
  return (
    <div className="w-full max-w-[400px] mx-auto">
      {/* 4:5 aspect ratio container */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '4/5' }}>
        {/* Background photo */}
        <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {/* Top: logos + badge */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-seazone-branco.png" alt="Seazone" className="h-6 object-contain" />
              <img src="/logo-spot-branco.png" alt="SPOT" className="h-8 object-contain" />
            </div>
            {data.badge && (
              <span className="bg-[#FC6058] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {data.badge}
              </span>
            )}
          </div>

          {/* Middle: location pin */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center gap-1 text-white/80 text-xs mb-3">
                <span>📍</span>
                <span>Campeche, Florianópolis</span>
              </div>
              {/* Headline */}
              <h2 className="text-white text-2xl font-bold leading-tight mb-3 drop-shadow-lg">
                {data.headline}
              </h2>
              {/* Subheadline */}
              <p className="text-white/90 text-sm font-medium">
                {data.subheadline}
              </p>
            </div>
          </div>

          {/* Bottom: CTA + disclaimer */}
          <div className="space-y-3">
            {data.pontos_fortes && (
              <div className="text-white/50 text-[10px] text-center tracking-widest font-medium">
                {data.pontos_fortes}
              </div>
            )}
            <button className="w-full bg-[#0055FF] hover:bg-[#0044CC] text-white font-bold py-3 rounded-lg text-sm transition-colors">
              {data.cta || 'Saiba mais'}
            </button>
            <p className="text-white/30 text-[7px] leading-tight text-center">
              {DEFAULT_BRIEFING.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== VIDEO SCRIPT DISPLAY ==========
function VideoScript({ data, type }: { data: any; type: 'narrado' | 'monica' }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{data.titulo}</h3>
          <p className="text-white/50 text-sm">{data.duracao}s • Reels 9:16{type === 'monica' ? ` • Cenário: ${data.cenario}` : ''}</p>
        </div>
      </div>

      <div className="space-y-3">
        {(data.cenas || []).map((cena: any, i: number) => (
          <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#0055FF] text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cena.numero || i + 1}
              </span>
              <span className="text-white/50 text-xs">{cena.duracao}</span>
              {type === 'monica' && cena.enquadramento && (
                <span className="text-[#FC6058] text-xs">• {cena.enquadramento}</span>
              )}
            </div>
            {type === 'narrado' ? (
              <>
                <p className="text-white/40 text-xs mb-1">🎥 {cena.visual}</p>
                <p className="text-white font-medium text-sm">🎙️ "{cena.narracao}"</p>
                {cena.overlay_texto && (
                  <p className="text-[#FC6058] text-xs mt-1">📝 {cena.overlay_texto}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-white font-medium text-sm">🗣️ "{cena.fala_monica}"</p>
                {cena.overlay_texto && (
                  <p className="text-[#FC6058] text-xs mt-1">📝 {cena.overlay_texto}</p>
                )}
                {cena.direcao && (
                  <p className="text-white/30 text-xs mt-1">🎬 {cena.direcao}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ========== VIDEO GENERATION COMPONENT ==========
function VideoGenerator({ prompt, label }: { prompt: string; label: string }) {
  const [generating, setGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setVideoUrl(data.url)
    } catch (err: any) {
      setError(err.message)
    }
    setGenerating(false)
  }

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-widest text-white/40">GERAR VÍDEO COM IA</span>
        <button
          onClick={generate}
          disabled={generating}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            generating
              ? 'bg-white/10 text-white/30 cursor-wait generating'
              : 'bg-[#FC6058] hover:bg-[#e5544d] text-white cursor-pointer'
          }`}
        >
          {generating ? '⏳ Gerando vídeo...' : '🎬 Gerar com Kling'}
        </button>
      </div>
      <p className="text-white/30 text-[10px] mb-2">Prompt: {prompt?.slice(0, 100)}...</p>
      {generating && (
        <div className="flex items-center gap-3 py-6 justify-center">
          <div className="spinner" />
          <span className="text-white/50 text-sm">Gerando vídeo... pode levar 2-5 min</span>
        </div>
      )}
      {videoUrl && (
        <video src={videoUrl} controls className="w-full rounded-lg max-h-[400px]" />
      )}
      {error && (
        <p className="text-[#FC6058] text-xs mt-2">Erro: {error}</p>
      )}
    </div>
  )
}

// ========== IMAGE GENERATION COMPONENT ==========
function ImageGenerator({ data }: { data: any }) {
  const [generating, setGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setGenerating(true)
    setError(null)
    const prompt = `Professional real estate marketing photo, ${data.fundo === 'fachada' ? 'modern apartment building facade' : data.fundo === 'aereo-pin' ? 'aerial view of beach neighborhood with location pin' : data.fundo === 'rooftop' ? 'luxury rooftop with ocean view' : 'aerial beach coastline'}, Campeche Florianopolis Brazil, golden hour, cinematic, 4K, professional advertising photography`
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const result = await res.json()
      if (result.error) throw new Error(result.error)
      setImageUrl(result.url)
    } catch (err: any) {
      setError(err.message)
    }
    setGenerating(false)
  }

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-widest text-white/40">GERAR IMAGEM COM IA</span>
        <button
          onClick={generate}
          disabled={generating}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            generating
              ? 'bg-white/10 text-white/30 cursor-wait generating'
              : 'bg-[#0055FF] hover:bg-[#0044CC] text-white cursor-pointer'
          }`}
        >
          {generating ? '⏳ Gerando...' : '🖼️ Gerar com Flux'}
        </button>
      </div>
      {generating && (
        <div className="flex items-center gap-3 py-6 justify-center">
          <div className="spinner" />
          <span className="text-white/50 text-sm">Gerando imagem com fal.ai...</span>
        </div>
      )}
      {imageUrl && (
        <img src={imageUrl} alt="Gerada por IA" className="w-full rounded-lg" />
      )}
      {error && (
        <p className="text-[#FC6058] text-xs mt-2">Erro: {error}</p>
      )}
    </div>
  )
}

// ========== MAIN PAGE ==========
export default function Home() {
  const [tab, setTab] = useState<'static' | 'narrado' | 'monica'>('static')
  const [briefing] = useState(DEFAULT_BRIEFING)
  const [loading, setLoading] = useState(false)
  const [staticResult, setStaticResult] = useState<any>(null)
  const [narradoResult, setNarradoResult] = useState<any>(null)
  const [monicaResult, setMonicaResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [briefingUrl, setBriefingUrl] = useState('')

  const generateCreative = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: tab === 'static' ? 'static' : tab === 'narrado' ? 'video-narrado' : 'video-monica', briefing }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      if (tab === 'static') setStaticResult(data.result)
      else if (tab === 'narrado') setNarradoResult(data.result)
      else setMonicaResult(data.result)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const currentResult = tab === 'static' ? staticResult : tab === 'narrado' ? narradoResult : monicaResult

  return (
    <div className="min-h-screen bg-[#00143D]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#00143D]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-seazone-branco.png" alt="Seazone" className="h-7" />
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-white font-bold text-sm">Máquina de Criativos</h1>
              <p className="text-white/40 text-[10px]">IA Autônoma — Hackathon 2026</p>
            </div>
          </div>
          <span className="text-[10px] text-white/20 font-mono">v2.0</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Briefing URL Input */}
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-spot-azul.png" alt="SPOT" className="h-10" />
            <div>
              <h2 className="text-white font-bold">Briefing do Empreendimento</h2>
              <p className="text-white/40 text-xs">Cole o link do Lovable ou use o briefing padrão</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={briefingUrl}
              onChange={(e) => setBriefingUrl(e.target.value)}
              placeholder="https://lovable.dev/projects/... (opcional)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#0055FF]/50"
            />
            <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
              📥 Puxar
            </button>
          </div>
        </div>

        {/* Briefing Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'ROI Estimado', value: briefing.roi, color: '#22c55e' },
            { label: 'Renda Anual', value: briefing.renda_liquida_ano, color: '#0055FF' },
            { label: 'Ticket Médio', value: briefing.ticket_medio, color: '#FC6058' },
            { label: 'Valorização', value: briefing.valorizacao, color: '#eab308' },
          ].map((card, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-xl font-black" style={{ color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {[
            { id: 'static' as const, icon: '🖼️', label: 'Peças Estáticas', sub: '4:5 Feed' },
            { id: 'narrado' as const, icon: '🎙️', label: 'Vídeos Narrados', sub: '9:16 Reels' },
            { id: 'monica' as const, icon: '🎬', label: 'Vídeos Mônica', sub: '9:16 Reels' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 px-2 rounded-lg text-center transition-all ${
                tab === t.id
                  ? 'bg-[#0055FF] text-white'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <p className="text-xs font-bold mt-1">{t.label}</p>
              <p className="text-[10px] opacity-60">{t.sub}</p>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateCreative}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
            loading
              ? 'bg-white/10 text-white/30 cursor-wait generating'
              : 'bg-[#FC6058] hover:bg-[#e5544d] text-white hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="spinner !w-5 !h-5 !border-2" />
              Gerando criativo com IA...
            </span>
          ) : (
            `⚡ Gerar 1 ${tab === 'static' ? 'Peça Estática' : tab === 'narrado' ? 'Vídeo Narrado' : 'Vídeo Mônica'}`
          )}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
            Erro: {error}
          </div>
        )}

        {/* Results */}
        {currentResult && (
          <div className="space-y-6">
            {tab === 'static' && staticResult && (
              <>
                <StaticPreview data={staticResult} />
                <ScoreCard score={staticResult.score} />
                <ImageGenerator data={staticResult} />
              </>
            )}

            {tab === 'narrado' && narradoResult && (
              <>
                <VideoScript data={narradoResult} type="narrado" />
                <ScoreCard score={narradoResult.score} />
                {narradoResult.prompt_video && (
                  <VideoGenerator prompt={narradoResult.prompt_video} label="Gerar Vídeo Narrado" />
                )}
              </>
            )}

            {tab === 'monica' && monicaResult && (
              <>
                <VideoScript data={monicaResult} type="monica" />
                <ScoreCard score={monicaResult.score} />
                {monicaResult.prompt_video && (
                  <VideoGenerator prompt={monicaResult.prompt_video} label="Gerar Vídeo Mônica" />
                )}
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {!currentResult && !loading && (
          <div className="text-center py-16 text-white/20">
            <p className="text-4xl mb-3">
              {tab === 'static' ? '🖼️' : tab === 'narrado' ? '🎙️' : '🎬'}
            </p>
            <p className="text-sm">Clique em gerar para criar 1 {tab === 'static' ? 'peça estática (4:5)' : tab === 'narrado' ? 'vídeo narrado (9:16)' : 'vídeo com Mônica (9:16)'}</p>
            <p className="text-xs mt-1 text-white/10">Cada geração é única — gere quantas vezes quiser</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 py-6 text-center">
        <img src="/logo-seazone-azul.png" alt="Seazone" className="h-5 mx-auto mb-2 opacity-30" />
        <p className="text-white/15 text-[10px]">Marketing AI Hackathon 2026 — Máquina de Criativos</p>
      </footer>
    </div>
  )
}
