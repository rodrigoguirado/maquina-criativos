"use client";
import { useState } from "react";
import StaticCreatives from "./components/StaticCreatives";
import ScoreCard, { RankingPanel } from "./components/ScoreCard";

const BRIEFING_DEFAULT = `Nome: Novo Campeche SPOT II
Endereço: Rua Otávio Cruz, bairro Campeche, CEP 88063-620, Florianópolis - SC

DADOS FINANCEIROS:
- Ticket médio: R$ 350.190,82
- Menor valor da cota: R$ 335.291,87
- Rentabilidade líquida estimada: R$ 66.424,18/ano (~R$ 5.535/mês)
- ROI estimado: 16,40%
- Valorização estimada: 81%
- Quantidade: 49 cotas + 3 lojas
- Preço médio concorrentes: R$ 584.166,08
- Concorrentes diretos: 8

CARACTERÍSTICAS DA REGIÃO:
- Localização premium próxima à praia
- Praia do Novo Campeche: mar azul, areia clara, ondas consistentes
- Acesso próximo à Ilha do Campeche — "Caribe brasileiro"
- Lifestyle forte: nômades digitais, expatriados, alta renda, surfistas
- Alta demanda turística o ano inteiro (baixa sazonalidade)
- Infraestrutura completa: mercados, cafés, restaurantes, farmácias, ciclovias

PONTOS FORTES:
1. ROI 16,40% — acima da Selic e superior aos concorrentes
2. Localização — entre os bairros com maior faturamento bruto de Florianópolis
3. Rendimento mensal ~R$ 5.500/mês
4. Fachada — padrão visual do Novo Campeche Spot (referência de sucesso)
5. Vista do atrativo — rooftop com vista mar (complemento)

PÚBLICO-ALVO:
- P1: Investidores do Sudeste (SP/MG) — racional, orientado a ROI
- P2: Regional qualificado (SC/PR/RS)
- P3: Nacional (RJ, BA, GO, MT, DF, PA, CE, PE)

DO'S: Modelo SPOT para short stay, Gestão profissional Seazone, Foco em renda passiva, Proximidade ao aeroporto
DON'TS: Não dizer "ticket baixo", não dizer "vista mar" (só rooftop), não dizer "pé na areia", não mencionar distância exata, não dizer "único lançamento"`;

const TABS = [
  { id: "estaticos", label: "Peças Estáticas", icon: "🖼️", desc: "3 estruturas × 5 variações" },
  { id: "video_narrado", label: "Vídeos Narrados", icon: "🎙️", desc: "2 estruturas × 5 variações" },
  { id: "video_apresentadora", label: "Vídeos Mônica", icon: "🎬", desc: "2 estruturas × 5 variações" },
  { id: "prompts_imagem", label: "Prompts de Imagem", icon: "🎨", desc: "10 prompts para IA" },
];

function Spinner() {
  return <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#0055FF" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round"/></svg>;
}

function VideoView({ data, type }: { data: any; type: "narrado" | "apresentadora" }) {
  const [openE, setOpenE] = useState(0);
  const [openV, setOpenV] = useState("");
  if (!data?.estruturas) return <RawView data={data} />;
  return (
    <div className="space-y-4">
      {data.ranking && <RankingPanel ranking={data.ranking} recomendacao={data.recomendacao} />}
      {data.estruturas.map((est: any, i: number) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button onClick={() => setOpenE(openE === i ? -1 : i)} className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-sz-blue-pale/40 transition-colors">
            <div>
              <span className="text-sm font-bold text-sz-blue">{est.nome}</span>
              <p className="text-xs text-sz-gray mt-0.5">{est.tese || est.conceito || ""}</p>
            </div>
            <span className="text-sz-blue">{openE === i ? "−" : "+"}</span>
          </button>
          {openE === i && est.variacoes && (
            <div className="px-5 pb-4 space-y-3">
              {est.variacoes.map((v: any) => (
                <div key={v.id} className="border border-slate-100 rounded-lg overflow-hidden">
                  <button onClick={() => setOpenV(openV === v.id ? "" : v.id)} className="w-full text-left px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${v.duracao?.includes("1") ? "bg-sz-coral/10 text-sz-coral" : "bg-sz-blue/10 text-sz-blue"}`}>{v.duracao}</span>
                      <span className="text-sm font-medium text-sz-text">{v.id}</span>
                      {v.score && <ScoreCard score={v.score} compact />}
                    </div>
                    <span className="text-sz-gray text-xs">{openV === v.id ? "▲" : "▼"}</span>
                  </button>
                  {openV === v.id && v.cenas && (
                    <div className="p-4 space-y-3">
                      {v.cenas.map((c: any, k: number) => (
                        <div key={k} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${k * 60}ms` }}>
                          <div className="shrink-0 w-14 h-14 rounded-lg bg-sz-navy flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">{c.tempo}</span>
                          </div>
                          <div className="flex-1 space-y-1 text-xs">
                            <p className="text-sz-gray"><b className="text-sz-text">Visual:</b> {c.visual}</p>
                            {c.camera && <p className="text-slate-400"><b>Câmera:</b> {c.camera}</p>}
                            {c.narracao && <p><b className="text-sz-blue">Narração:</b> "{c.narracao}"</p>}
                            {c.fala_monica && <p><b className="text-sz-coral">Mônica:</b> "{c.fala_monica}"</p>}
                            {c.texto_tela && <p><b className="text-sz-navy">Tela:</b> {c.texto_tela}</p>}
                            {c.transicao && <p className="text-slate-400 italic">↓ {c.transicao}</p>}
                          </div>
                        </div>
                      ))}
                      {v.score && <ScoreCard score={v.score} diagnostico={v.diagnostico} />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PromptsView({ data }: { data: any }) {
  const [copied, setCopied] = useState("");
  if (!data?.prompts) return <RawView data={data} />;
  return (
    <div className="space-y-3">
      {data.prompts.map((p: any) => (
        <div key={p.id} className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-sz-blue">{p.id}</span>
              <h3 className="text-sm font-bold text-sz-navy">{p.titulo}</h3>
            </div>
            <div className="flex gap-1.5">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">{p.aspect_ratio}</span>
              <span className="text-[10px] bg-sz-blue-pale text-sz-blue px-2 py-0.5 rounded">{p.estilo}</span>
            </div>
          </div>
          <div className="bg-sz-navy rounded-lg p-3 mb-2 relative group cursor-pointer" onClick={() => { navigator.clipboard.writeText(p.prompt_en); setCopied(p.id); setTimeout(() => setCopied(""), 2000); }}>
            <p className="text-xs text-white font-mono leading-relaxed">{p.prompt_en}</p>
            <span className="absolute top-2 right-2 bg-white/20 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {copied === p.id ? "✓ Copiado!" : "Copiar"}
            </span>
          </div>
          <div className="flex gap-3 text-[10px] text-sz-gray">
            <span><b>Uso:</b> {p.uso}</span>
            {p.negative && <span><b>Evitar:</b> {p.negative}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function RawView({ data }: { data: any }) {
  return <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs overflow-auto max-h-[500px] whitespace-pre-wrap">{typeof data === "string" ? data : JSON.stringify(data, null, 2)}</pre>;
}

export default function Home() {
  const [briefing, setBriefing] = useState(BRIEFING_DEFAULT);
  const [lovableUrl, setLovableUrl] = useState("");
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [briefingSource, setBriefingSource] = useState("Novo Campeche SPOT II");
  const [activeTab, setActiveTab] = useState("estaticos");
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBriefing, setShowBriefing] = useState(false);

  async function fetchLovable() {
    if (!lovableUrl) return;
    setLoadingBriefing(true);
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: lovableUrl }),
      });
      const data = await res.json();
      if (data.content) {
        setBriefing(data.content);
        setBriefingSource(lovableUrl.split("/").pop() || "Lovable");
        setResults({});
      } else {
        alert("Erro ao buscar briefing: " + (data.error || "desconhecido"));
      }
    } catch (e: any) { alert("Erro: " + e.message); }
    setLoadingBriefing(false);
  }

  async function generate(type: string) {
    setLoading(p => ({ ...p, [type]: true }));
    setErrors(p => ({ ...p, [type]: "" }));
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefing, type }),
      });
      const data = await res.json();
      if (data.error) setErrors(p => ({ ...p, [type]: data.error }));
      else setResults(p => ({ ...p, [type]: data.result || data.raw }));
    } catch (e: any) { setErrors(p => ({ ...p, [type]: e.message })); }
    setLoading(p => ({ ...p, [type]: false }));
  }

  async function generateAll() { for (const t of TABS) await generate(t.id); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sz-blue-pale/30">
      {/* Header */}
      <header className="bg-sz-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-seazone-branco.png" alt="Seazone" className="h-6" />
            <div className="h-5 w-px bg-white/20" />
            <div>
              <h1 className="text-base font-bold tracking-tight">Máquina de Criativos</h1>
              <p className="text-[10px] text-sz-blue-light">IA Autônoma — Hackathon 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Powered by Claude AI</span>
            <div className="w-1.5 h-1.5 rounded-full bg-sz-green animate-pulse" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Briefing URL Input */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo-spot-azul.png" alt="" className="h-5" />
            <span className="text-sm font-bold text-sz-navy">Briefing do Empreendimento</span>
            <span className="text-[10px] bg-sz-blue-pale text-sz-blue px-2 py-0.5 rounded ml-auto">{briefingSource}</span>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={lovableUrl} onChange={e => setLovableUrl(e.target.value)}
              placeholder="Cole o link do Lovable com o briefing (ex: https://nome-do-spot.lovable.app/)"
              className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sz-blue/20 focus:border-sz-blue outline-none" />
            <button onClick={fetchLovable} disabled={loadingBriefing || !lovableUrl}
              className="bg-sz-blue hover:bg-sz-blue-dark disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              {loadingBriefing ? <Spinner /> : "📥"} Puxar briefing
            </button>
          </div>
          <button onClick={() => setShowBriefing(!showBriefing)} className="text-xs text-sz-blue hover:text-sz-blue-dark">
            {showBriefing ? "Ocultar" : "Ver/editar"} briefing completo {showBriefing ? "▲" : "▼"}
          </button>
          {showBriefing && (
            <textarea value={briefing} onChange={e => setBriefing(e.target.value)}
              className="w-full h-48 mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-sz-text font-mono resize-none focus:ring-2 focus:ring-sz-blue/20 outline-none" />
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "ROI Estimado", value: "16,40%", color: "text-sz-green" },
            { label: "Renda Anual", value: "R$ 66.424", color: "text-sz-blue" },
            { label: "Ticket Médio", value: "R$ 350 mil", color: "text-sz-navy" },
            { label: "Valorização", value: "81%", color: "text-sz-coral" },
          ].map((m, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
              <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
              <p className="text-[10px] text-sz-gray">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Generate buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={generateAll} disabled={Object.values(loading).some(Boolean)}
            className="bg-sz-blue hover:bg-sz-blue-dark disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-sz-blue/20">
            {Object.values(loading).some(Boolean) ? <Spinner /> : "⚡"} Gerar todos os criativos
          </button>
          <button onClick={() => generate(activeTab)} disabled={loading[activeTab]}
            className="bg-white border-2 border-sz-blue text-sz-blue hover:bg-sz-blue-pale disabled:opacity-50 font-medium px-5 py-3 rounded-xl transition-colors flex items-center gap-2">
            {loading[activeTab] ? <Spinner /> : null} Gerar: {TABS.find(t => t.id === activeTab)?.label}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
          {TABS.map(tab => {
            const hasR = !!results[tab.id];
            const isL = loading[tab.id];
            const isA = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${isA ? "bg-sz-navy text-white shadow-md" : "text-sz-gray hover:bg-slate-50"}`}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {isL && <Spinner />}
                {hasR && !isL && <span className="w-1.5 h-1.5 rounded-full bg-sz-green" />}
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="min-h-[400px]">
          {loading[activeTab] && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <Spinner />
              <p className="text-sm font-medium text-sz-navy mt-4">Gerando {TABS.find(t => t.id === activeTab)?.label}...</p>
              <p className="text-xs text-sz-gray mt-1">Analisando briefing → Criando variações → Validando qualidade → Rankeando</p>
            </div>
          )}

          {errors[activeTab] && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="text-sm text-red-700 font-medium">Erro</p>
              <p className="text-xs text-red-500 mt-1">{errors[activeTab]}</p>
            </div>
          )}

          {activeTab === "estaticos" && (
            <StaticCreatives data={results.estaticos} />
          )}

          {activeTab === "video_narrado" && results.video_narrado && !loading.video_narrado && (
            <VideoView data={results.video_narrado} type="narrado" />
          )}

          {activeTab === "video_apresentadora" && results.video_apresentadora && !loading.video_apresentadora && (
            <VideoView data={results.video_apresentadora} type="apresentadora" />
          )}

          {activeTab === "prompts_imagem" && results.prompts_imagem && !loading.prompts_imagem && (
            <PromptsView data={results.prompts_imagem} />
          )}

          {!results[activeTab] && !loading[activeTab] && !errors[activeTab] && activeTab !== "estaticos" && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-3xl mb-3">{TABS.find(t => t.id === activeTab)?.icon}</span>
              <p className="text-sm font-medium text-sz-navy">Pronto para gerar</p>
              <p className="text-xs text-sz-gray mt-1">{TABS.find(t => t.id === activeTab)?.desc}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/logo-seazone-azul.png" alt="Seazone" className="h-4" />
          <p className="text-[10px] text-sz-gray">Marketing AI Hackathon 2026 — Máquina de Criativos</p>
        </div>
      </footer>
    </div>
  );
}
