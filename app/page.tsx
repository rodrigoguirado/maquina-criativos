'use client'
import { useState } from 'react'
import { toPng } from 'html-to-image'

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

/* ========== SCORE ========== */
function ScoreBar({ label, value, weight }: { label: string; value: number; weight: string }) {
  const color = value >= 8 ? '#22c55e' : value >= 6 ? '#eab308' : '#ef4444'
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 text-gray-500">{label} <span className="text-[10px]">({weight})</span></span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value * 10}%`, background: color }} />
      </div>
      <span className="w-8 text-right font-bold" style={{ color }}>{value}</span>
    </div>
  )
}

function ScoreCard({ score }: { score: any }) {
  if (!score) return null
  const w = { hook: 0.25, clareza: 0.20, argumento: 0.20, comercial: 0.20, tom: 0.15 }
  const final = ((score.hook||0)*w.hook + (score.clareza||0)*w.clareza + (score.argumento||0)*w.argumento + (score.comercial||0)*w.comercial + (score.tom||0)*w.tom).toFixed(1)
  const n = parseFloat(final)
  const status = n >= 9 ? 'ESCALAR' : n >= 8 ? 'TESTAR' : n >= 6 ? 'AJUSTAR' : 'DESCARTAR'
  const sc = n >= 9 ? '#22c55e' : n >= 8 ? '#3b82f6' : n >= 6 ? '#eab308' : '#ef4444'
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-gray-400">VALIDADOR SEAZONE</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black" style={{ color: sc }}>{final}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: sc, color: '#000' }}>{status}</span>
        </div>
      </div>
      <ScoreBar label="Hook" value={score.hook||0} weight="25%" />
      <ScoreBar label="Clareza" value={score.clareza||0} weight="20%" />
      <ScoreBar label="Argumento" value={score.argumento||0} weight="20%" />
      <ScoreBar label="Comercial" value={score.comercial||0} weight="20%" />
      <ScoreBar label="Tom Seazone" value={score.tom||0} weight="15%" />
    </div>
  )
}

/* ========== STATIC PREVIEW (matches real Seazone ads) ========== */
function StaticPreview({ data, briefing }: { data: any; briefing: any }) {
  const bgImage = FUNDOS[data.fundo] || FUNDOS['fachada']

  // Parse bold markers ** **
  const renderBold = (text: string) => {
    if (!text) return text
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
  }

  const downloadImage = async () => {
    const el = document.getElementById('static-preview')
    if (!el) return
    try {
      const dataUrl = await toPng(el, { pixelRatio: 3, cacheBust: true })
      const link = document.createElement('a')
      link.download = `criativo-seazone-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Download error:', err)
      alert('Erro ao baixar. Tente: clique direito na peça → Salvar imagem como...')
    }
  }

  return (
    <div className="w-full max-w-[420px] mx-auto space-y-3">
      <div id="static-preview" className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '4/5', background: '#00143D' }}>

        {/* TOP: Location pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
            <span className="text-[#FC6058] text-sm">📍</span>
            <span className="text-[#00143D] text-xs font-semibold">{data.localizacao_pill || 'Campeche • Florianópolis'}</span>
          </div>
        </div>

        {/* Badge */}
        {data.badge && (
          <div className="absolute top-4 right-4 z-20">
            <span className="bg-[#FC6058] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
              {data.badge}
            </span>
          </div>
        )}

        {/* PHOTO: top 58% */}
        <div className="absolute top-0 left-0 right-0" style={{ height: '58%' }}>
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#00143D] to-transparent" />
        </div>

        {/* BOTTOM: Navy section with content */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end px-6 pb-4" style={{ height: '48%' }}>

          {/* Headline */}
          <div className="text-center mb-5">
            <p className="text-white text-[22px] leading-snug" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              {renderBold(data.headline || '')}
            </p>
          </div>

          {/* Number capsule */}
          <div className="w-full mb-5">
            <div className="border border-[#6593FF]/30 rounded-[32px] py-4 px-8 flex items-baseline justify-center gap-1" style={{ background: 'linear-gradient(135deg, rgba(0,30,80,0.95) 0%, rgba(0,20,61,0.8) 100%)' }}>
              <span className="text-white/60 text-base font-light">{data.numero_prefixo || 'R$'}</span>
              <span className="text-white font-black tracking-tight" style={{ fontSize: '48px', lineHeight: '1' }}>{data.numero_destaque || '5.535'}</span>
              <span className="text-white/60 text-sm font-light leading-tight ml-1 whitespace-pre-line">{data.numero_sufixo || 'líquidos\npor mês*'}</span>
            </div>
          </div>

          {/* Footer: gestao + logos */}
          <div className="w-full flex items-center justify-between mb-2.5">
            <div className="flex-1 pr-3">
              <p className="text-white/70 text-[11px] leading-tight" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                {renderBold(data.texto_gestao || 'Gestão **operacional e estratégica completa** Seazone')}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <img src="/logo-spot-branco.png" alt="SPOT" className="h-9 object-contain" />
              <img src="/logo-seazone-branco.png" alt="Seazone" className="h-5 object-contain" />
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-white/15 text-[5.5px] leading-tight text-left w-full">
            {briefing?.disclaimer || DEFAULT_BRIEFING.disclaimer}
          </p>
        </div>
      </div>

      {/* Download button */}
      <button onClick={downloadImage}
        className="w-full py-2.5 rounded-lg text-xs font-bold bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border border-gray-200 shadow-sm transition-all">
        💾 Baixar Peça Estática
      </button>
    </div>
  )
}

/* ========== VIDEO SCRIPT ========== */
function VideoScript({ data, type }: { data: any; type: 'narrado' | 'monica' }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{data.titulo}</h3>
        <p className="text-gray-400 text-sm">{data.duracao}s • Reels 9:16{type === 'monica' ? ` • ${data.cenario}` : ''}</p>
      </div>
      <div className="space-y-3">
        {(data.cenas || []).map((cena: any, i: number) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#0055FF] text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">{cena.numero || i+1}</span>
              <span className="text-gray-400 text-xs">{cena.duracao}</span>
              {type === 'monica' && cena.enquadramento && <span className="text-[#FC6058] text-xs">• {cena.enquadramento}</span>}
            </div>
            {type === 'narrado' ? (
              <>
                <p className="text-gray-400 text-xs mb-1">🎥 {cena.visual}</p>
                <p className="text-gray-800 font-medium text-sm">🎙️ &ldquo;{cena.narracao}&rdquo;</p>
                {cena.overlay_texto && <p className="text-[#FC6058] text-xs mt-1">📝 {cena.overlay_texto}</p>}
              </>
            ) : (
              <>
                <p className="text-gray-800 font-medium text-sm">🗣️ &ldquo;{cena.fala_monica}&rdquo;</p>
                {cena.overlay_texto && <p className="text-[#FC6058] text-xs mt-1">📝 {cena.overlay_texto}</p>}
                {cena.direcao && <p className="text-gray-300 text-xs mt-1">🎬 {cena.direcao}</p>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== VIDEO GENERATOR (fal.ai Kling) with polling ========== */
function VideoGenerator({ prompt }: { prompt: string }) {
  const [generating, setGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState('')

  const generate = async () => {
    setGenerating(true)
    setError(null)
    setVideoUrl(null)
    setStatusMsg('Enviando para fal.ai...')

    try {
      // Step 1: Submit the job
      const submitRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const submitData = await submitRes.json()
      
      if (submitData.error) throw new Error(submitData.error)

      // If video came back directly
      if (submitData.status === 'COMPLETED' && submitData.url) {
        setVideoUrl(submitData.url)
        setGenerating(false)
        return
      }

      // Step 2: Poll for completion
      if (submitData.request_id) {
        const reqId = submitData.request_id
        setStatusMsg('Vídeo na fila... aguardando geração')
        
        for (let i = 0; ; i++) {
          await new Promise(r => setTimeout(r, 10000)) // wait 10s between polls
          const mins = Math.floor((i + 1) * 10 / 60)
          const secs = ((i + 1) * 10) % 60
          setStatusMsg(`Gerando vídeo... ${mins > 0 ? mins + 'min ' : ''}${secs}s — não feche a página`)

          const pollRes = await fetch('/api/generate-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ request_id: reqId }),
          })
          const pollData = await pollRes.json()

          if (pollData.error) throw new Error(pollData.error)

          if (pollData.status === 'COMPLETED' && pollData.url) {
            setVideoUrl(pollData.url)
            setGenerating(false)
            return
          }

          if (pollData.status === 'FAILED') {
            throw new Error(pollData.error || 'Geração de vídeo falhou')
          }

          // Still processing, continue polling
          if (pollData.status === 'IN_QUEUE' || pollData.status === 'IN_PROGRESS') {
            setStatusMsg(`Gerando vídeo... ${(i + 1) * 5}s (${pollData.status})`)
          }
        }
        
        // Should never reach here - loop runs until COMPLETED or FAILED
        throw new Error('Loop encerrado inesperadamente')
      }

      throw new Error('Resposta inesperada do servidor')
    } catch (err: any) {
      setError(err.message)
    }
    setGenerating(false)
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-widest text-gray-400">GERAR VÍDEO COM IA</span>
        <button onClick={generate} disabled={generating}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${generating ? 'bg-gray-200 text-gray-400 cursor-wait' : 'bg-[#FC6058] hover:bg-[#e5544d] text-white'}`}>
          {generating ? '⏳ Gerando...' : '🎬 Gerar com Kling'}
        </button>
      </div>
      <p className="text-gray-300 text-[10px] mb-2 truncate">Prompt: {prompt?.slice(0, 150)}...</p>
      {generating && (
        <div className="flex items-center gap-3 py-8 justify-center">
          <div className="spinner" />
          <span className="text-gray-400 text-sm">{statusMsg}</span>
        </div>
      )}
      {videoUrl && <video src={videoUrl} controls className="w-full rounded-lg max-h-[500px]" />}
      {error && <p className="text-[#FC6058] text-xs mt-2">Erro: {error}</p>}
    </div>
  )
}

/* ========== IMAGE GENERATOR (fal.ai Flux) ========== */
function ImageGenerator({ fundo }: { fundo: string }) {
  const [generating, setGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const prompts: Record<string, string> = {
    'fachada': 'Modern boutique hotel facade, concrete and wood, tropical plants, golden hour, Florianopolis Brazil, professional architecture photo, 4K',
    'aereo-pin': 'Aerial drone photo of beach neighborhood Campeche Florianopolis Brazil, ocean view, residential buildings, sunny day, 4K',
    'rooftop': 'Luxury rooftop pool with ocean view, modern building, Florianopolis Brazil, sunset, cinematic, 4K',
    'praia': 'Aerial coastline photo Campeche beach Florianopolis Brazil, turquoise water, white sand, buildings, 4K',
  }

  const generate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const prompt = prompts[fundo] || prompts['fachada']
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setImageUrl(data.url)
    } catch (err: any) {
      setError(err.message)
    }
    setGenerating(false)
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-widest text-gray-400">GERAR IMAGEM COM IA (FAL.AI FLUX)</span>
        <button onClick={generate} disabled={generating}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${generating ? 'bg-gray-200 text-gray-400 cursor-wait generating' : 'bg-[#0055FF] hover:bg-[#0044CC] text-white'}`}>
          {generating ? '⏳ Gerando...' : '🖼️ Gerar Imagem'}
        </button>
      </div>
      {generating && (
        <div className="flex items-center gap-3 py-6 justify-center">
          <div className="spinner" />
          <span className="text-gray-400 text-sm">Gerando imagem com fal.ai Flux...</span>
        </div>
      )}
      {imageUrl && <img src={imageUrl} alt="Gerada por IA" className="w-full rounded-lg" />}
      {error && <p className="text-[#FC6058] text-xs mt-2">Erro: {error}</p>}
    </div>
  )
}

/* ========== MAIN PAGE ========== */
export default function Home() {
  const [tab, setTab] = useState<'static' | 'narrado' | 'monica'>('static')
  const [briefing, setBriefing] = useState(DEFAULT_BRIEFING)
  const [loading, setLoading] = useState(false)
  const [staticResult, setStaticResult] = useState<any>(null)
  const [narradoResult, setNarradoResult] = useState<any>(null)
  const [monicaResult, setMonicaResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [briefingUrl, setBriefingUrl] = useState('')
  const [briefingSource, setBriefingSource] = useState<string>('Novo Campeche SPOT II')
  const [showBriefingEdit, setShowBriefingEdit] = useState(false)
  const [fetchingBriefing, setFetchingBriefing] = useState(false)

  // Fetch briefing automatically from Lovable URL
  const fetchBriefing = async () => {
    if (!briefingUrl.trim()) return
    setFetchingBriefing(true)
    setError(null)
    try {
      const res = await fetch('/api/fetch-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: briefingUrl.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (data.briefing) {
        // Only update fields that have real data (not N/D)
        const newBriefing = { ...briefing }
        for (const [key, value] of Object.entries(data.briefing)) {
          if (value && value !== 'N/D' && (value as string).trim() !== '') {
            (newBriefing as any)[key] = value
          }
        }
        setBriefing(newBriefing)
        setBriefingSource(data.briefing.empreendimento && data.briefing.empreendimento !== 'N/D' ? data.briefing.empreendimento : 'Briefing importado')
        setStaticResult(null)
        setNarradoResult(null)
        setMonicaResult(null)
        setShowBriefingEdit(true)
      }
    } catch (err: any) {
      setError('Erro ao puxar briefing: ' + err.message)
    }
    setFetchingBriefing(false)
  }

  const updateBriefingField = (field: string, value: string) => {
    setBriefing((prev: any) => ({ ...prev, [field]: value }))
  }

  // Generate creative
  const generateCreative = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: tab === 'static' ? 'static' : tab === 'narrado' ? 'video-narrado' : 'video-monica',
          briefing,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (!data.result) throw new Error('Resposta vazia da IA')

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
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="border-b border-gray-200 bg-[#00143D] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-seazone-branco.png" alt="Seazone" className="h-7" />
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="text-white font-bold text-sm">Máquina de Criativos</h1>
              <p className="text-white/40 text-[10px]">IA Autônoma — Hackathon 2026</p>
            </div>
          </div>
          <span className="text-[10px] text-white/20 font-mono">v2.1</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Briefing - auto fetch from URL */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-spot-azul.png" alt="SPOT" className="h-10" />
            <div>
              <h2 className="text-[#00143D] font-bold">Briefing: {briefingSource}</h2>
              <p className="text-gray-400 text-xs">Cole o link do Lovable e clique Puxar — os dados são extraídos automaticamente</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input type="url" value={briefingUrl} onChange={(e) => setBriefingUrl(e.target.value)}
              placeholder="https://novocampechespotiilancamento.lovable.app/"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 text-sm placeholder:text-gray-300 outline-none focus:border-[#0055FF]/50" />
            <button onClick={fetchBriefing} disabled={fetchingBriefing || !briefingUrl.trim()}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                fetchingBriefing ? 'bg-white/10 text-white/30 generating' : 'bg-[#0055FF] hover:bg-[#0044CC] text-white'
              } disabled:opacity-30`}>
              {fetchingBriefing ? '⏳ Puxando...' : '📥 Puxar'}
            </button>
          </div>

          <button onClick={() => setShowBriefingEdit(!showBriefingEdit)}
            className="text-gray-400 text-xs hover:text-white/60 transition-colors">
            {showBriefingEdit ? '▲ Fechar edição' : '✏️ Editar dados manualmente'}
          </button>

          {showBriefingEdit && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { key: 'empreendimento', label: 'Empreendimento' },
                { key: 'localizacao', label: 'Localização' },
                { key: 'ticket_medio', label: 'Ticket Médio' },
                { key: 'menor_cota', label: 'Menor Cota' },
                { key: 'roi', label: 'ROI' },
                { key: 'renda_liquida_ano', label: 'Renda Líquida/Ano' },
                { key: 'renda_liquida_mes', label: 'Renda Líquida/Mês' },
                { key: 'valorizacao', label: 'Valorização' },
                { key: 'cotas', label: 'Cotas' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-gray-400 text-[10px] uppercase tracking-widest">{f.label}</label>
                  <input type="text" value={(briefing as any)[f.key] || ''}
                    onChange={(e) => { updateBriefingField(f.key, e.target.value); if (f.key === 'empreendimento') setBriefingSource(e.target.value) }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm outline-none focus:border-[#0055FF]/50" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Briefing Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'ROI Estimado', value: briefing.roi, color: '#22c55e' },
            { label: 'Renda Anual', value: briefing.renda_liquida_ano, color: '#0055FF' },
            { label: 'Ticket Médio', value: briefing.ticket_medio, color: '#FC6058' },
            { label: 'Valorização', value: briefing.valorizacao, color: '#eab308' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-xl font-black" style={{ color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'static' as const, icon: '🖼️', label: 'Peças Estáticas', sub: '4:5 Feed' },
            { id: 'narrado' as const, icon: '🎙️', label: 'Vídeos Narrados', sub: '9:16 Reels' },
            { id: 'monica' as const, icon: '🎬', label: 'Vídeos Mônica', sub: '9:16 Reels' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 px-2 rounded-lg text-center transition-all ${tab === t.id ? 'bg-[#0055FF] text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
              <span className="text-lg">{t.icon}</span>
              <p className="text-xs font-bold mt-1">{t.label}</p>
              <p className="text-[10px] opacity-60">{t.sub}</p>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button onClick={generateCreative} disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${loading ? 'bg-gray-200 text-gray-400 cursor-wait generating' : 'bg-[#FC6058] hover:bg-[#e5544d] text-white hover:scale-[1.01] active:scale-[0.99]'}`}>
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="spinner !w-5 !h-5 !border-2" />
              Gerando criativo com IA...
            </span>
          ) : (
            `⚡ Gerar 1 ${tab === 'static' ? 'Peça Estática (4:5)' : tab === 'narrado' ? 'Vídeo Narrado (9:16)' : 'Vídeo Mônica (9:16)'}`
          )}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
            Erro: {error}
          </div>
        )}

        {/* RESULTS */}
        {currentResult && (
          <div className="space-y-6">
            {/* FIX #2: Static with working image gen */}
            {tab === 'static' && staticResult && (
              <>
                <StaticPreview data={staticResult} briefing={briefing} />
                <ScoreCard score={staticResult.score} />
                <ImageGenerator fundo={staticResult.fundo || 'fachada'} />
              </>
            )}

            {/* FIX #3: Video Narrado - roteiro + video generation */}
            {tab === 'narrado' && narradoResult && (
              <>
                <VideoScript data={narradoResult} type="narrado" />
                <ScoreCard score={narradoResult.score} />
                {narradoResult.prompt_video && (
                  <VideoGenerator prompt={narradoResult.prompt_video} />
                )}
              </>
            )}

            {/* FIX #4: Video Monica - roteiro + video generation */}
            {tab === 'monica' && monicaResult && (
              <>
                <VideoScript data={monicaResult} type="monica" />
                <ScoreCard score={monicaResult.score} />
                {monicaResult.prompt_video && (
                  <VideoGenerator prompt={monicaResult.prompt_video} />
                )}
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {!currentResult && !loading && (
          <div className="text-center py-16 text-gray-300">
            <p className="text-4xl mb-3">{tab === 'static' ? '🖼️' : tab === 'narrado' ? '🎙️' : '🎬'}</p>
            <p className="text-sm">Clique em gerar para criar 1 {tab === 'static' ? 'peça estática (4:5)' : tab === 'narrado' ? 'vídeo narrado (9:16)' : 'vídeo com Mônica (9:16)'}</p>
            <p className="text-xs mt-1 text-gray-300">Cada geração é única — gere quantas vezes quiser</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6 text-center">
        <img src="/logo-seazone-azul.png" alt="Seazone" className="h-5 mx-auto mb-2 opacity-30" />
        <p className="text-gray-300 text-[10px]">Marketing AI Hackathon 2026 — Máquina de Criativos</p>
      </footer>
    </div>
  )
}
