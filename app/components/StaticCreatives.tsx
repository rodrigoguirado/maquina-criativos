"use client";
import { useState } from "react";

const DISCLAIMER = "*Projeção estimada. Este material tem caráter exclusivamente informativo e não constitui uma promessa de rentabilidade futura ou garantia de retorno financeiro.";

const BG_MAP: Record<string, string> = {
  fachada: "/fachada.png",
  "aereo-pin": "/aereo-pin-2.png",
  rooftop: "/rooftop.png",
  "aereo-praia": "/aereo-praia.jpg",
  "rooftop-render": "/rooftop-render.png",
};

interface Variacao {
  id: string;
  frase_destaque: string;
  texto_secundario?: string;
  pontos_fortes?: string;
  badge?: string;
  cta: string;
  visual_fundo?: string;
  score?: any;
  diagnostico?: string;
}

interface Estrutura {
  nome: string;
  foco: string;
  legenda?: string;
  variacoes: Variacao[];
}

const DIM: Record<string, { w: number; h: number; s: number; sf: number }> = {
  sq: { w: 1080, h: 1080, s: 0.32, sf: 0.55 },
  st: { w: 1080, h: 1920, s: 0.2, sf: 0.38 },
  ls: { w: 1200, h: 628, s: 0.35, sf: 0.55 },
};

function AdPiece({ v, fmt = "sq", full = false }: { v: Variacao; fmt?: string; full?: boolean }) {
  const d = DIM[fmt];
  const s = full ? d.sf : d.s;
  const bg = BG_MAP[v.visual_fundo || "aereo-pin"] || BG_MAP["aereo-pin"];

  return (
    <div style={{ width: d.w * s, height: d.h * s, position: "relative", overflow: "hidden", borderRadius: full ? 8 : 6, fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", boxShadow: full ? "0 25px 60px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.15)" }}>
      <img src={bg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,20,61,0.3) 0%, rgba(0,20,61,0.15) 30%, rgba(0,20,61,0.65) 65%, rgba(0,20,61,0.92) 100%)" }} />
      <img src="/logo-seazone-branco.png" alt="" style={{ position: "absolute", top: 14 * s, right: 14 * s, height: 24 * s, objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
      <img src="/logo-spot-branco.png" alt="" style={{ position: "absolute", top: (fmt === "st" ? 55 : 14) * s, left: 18 * s, height: (fmt === "st" ? 65 : 50) * s, objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
      <div style={{ position: "absolute", top: (fmt === "st" ? 140 : 85) * s, right: 18 * s, background: "rgba(0,85,255,0.9)", borderRadius: 100, padding: `${4 * s}px ${12 * s}px`, display: "flex", alignItems: "center", gap: 4 * s }}>
        <span style={{ fontSize: 11 * s }}>📍</span>
        <span style={{ fontSize: 10 * s, fontWeight: 600, color: "white" }}>Campeche, Florianópolis</span>
      </div>
      {v.badge && <div style={{ position: "absolute", left: 18 * s, top: (fmt === "st" ? 190 : 150) * s, background: "#FC6058", borderRadius: 5 * s, padding: `${5 * s}px ${12 * s}px`, boxShadow: "0 2px 8px rgba(252,96,88,0.4)" }}>
        <span style={{ fontSize: 10 * s, fontWeight: 700, color: "white", textTransform: "uppercase" }}>{v.badge}</span>
      </div>}
      <div style={{ position: "absolute", bottom: (fmt === "st" ? 75 : fmt === "ls" ? 16 : 50) * s, left: 18 * s, right: 18 * s }}>
        <p style={{ fontSize: (fmt === "ls" ? 16 : 20) * s, fontWeight: 800, color: "white", lineHeight: 1.25, marginBottom: 8 * s, textShadow: "0 2px 6px rgba(0,0,0,0.3)", whiteSpace: "pre-line" }}>{v.frase_destaque}</p>
        {v.texto_secundario && <p style={{ fontSize: 12 * s, color: "rgba(255,255,255,0.9)", marginBottom: 10 * s, fontWeight: 500 }}>{v.texto_secundario}</p>}
        {v.pontos_fortes && <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", borderRadius: 6 * s, padding: `${5 * s}px ${10 * s}px`, marginBottom: 10 * s, display: "inline-block", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span style={{ fontSize: 10 * s, fontWeight: 600, color: "white", letterSpacing: 1 }}>{v.pontos_fortes}</span>
        </div>}
        <div style={{ background: "#FC6058", borderRadius: 6 * s, padding: `${8 * s}px ${20 * s}px`, display: "inline-block", boxShadow: "0 4px 12px rgba(252,96,88,0.4)" }}>
          <span style={{ fontSize: 12 * s, fontWeight: 700, color: "white" }}>{v.cta}</span>
        </div>
      </div>
      {fmt !== "ls" && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,20,61,0.95)", padding: `${6 * s}px ${14 * s}px` }}>
        <p style={{ fontSize: 8 * s, fontWeight: 600, color: "rgba(255,255,255,0.9)", textAlign: "center" }}>Gestão operacional e estratégica completa Seazone</p>
        <p style={{ fontSize: 4.5 * s, color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 2 * s }}>{DISCLAIMER}</p>
      </div>}
    </div>
  );
}

export default function StaticCreatives({ data }: { data?: any }) {
  const [sel, setSel] = useState<{ est: number; var_: number } | null>(null);

  // If AI-generated data with structures
  if (data?.estruturas) {
    const allVars: { v: Variacao; fmt: string; estIdx: number; varIdx: number }[] = [];
    data.estruturas.forEach((est: Estrutura, ei: number) => {
      const fmts = ["sq", "st", "sq", "ls", "sq"];
      est.variacoes.forEach((v, vi) => {
        allVars.push({ v, fmt: fmts[vi % 5] || "sq", estIdx: ei, varIdx: vi });
      });
    });

    return (
      <div>
        {data.ranking && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo-seazone-azul.png" alt="" className="h-4" />
              <span className="text-xs font-bold text-sz-navy tracking-wider">RANKING</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {data.ranking.slice(0, 5).map((r: any, i: number) => (
                <div key={i} className={`rounded-lg px-3 py-2 text-xs ${i === 0 ? "bg-green-50 border border-green-200" : i === 1 ? "bg-blue-50 border border-blue-200" : "bg-slate-50 border border-slate-200"}`}>
                  <span className="font-bold">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`} {r.id}</span>
                  <span className="ml-2 font-bold text-sz-blue">{typeof r.score === "number" ? r.score.toFixed(1) : r.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.estruturas.map((est: Estrutura, ei: number) => (
          <div key={ei} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold text-sz-navy">{est.nome}</span>
              <span className="text-xs bg-sz-blue-pale text-sz-blue px-2 py-0.5 rounded">{est.foco}</span>
            </div>
            {est.legenda && <p className="text-xs text-sz-gray mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">{est.legenda}</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
              {est.variacoes.map((v, vi) => {
                const fmt = ["sq", "st", "sq", "ls", "sq"][vi % 5];
                return (
                  <div key={vi} className="cursor-pointer hover:scale-[1.03] transition-transform" onClick={() => setSel({ est: ei, var_: vi })}>
                    <AdPiece v={v} fmt={fmt} />
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded">{v.id}</span>
                      {v.score && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${v.score.classificacao === "ESCALAR" ? "bg-green-50 text-green-700" : v.score.classificacao === "TESTAR" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                          {v.score.final?.toFixed(1)} {v.score.classificacao}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {sel && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSel(null)}>
            <div className="animate-fade-in flex flex-col items-center max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <AdPiece v={data.estruturas[sel.est].variacoes[sel.var_]} fmt={["sq", "st", "sq", "ls", "sq"][sel.var_ % 5]} full />
              {data.estruturas[sel.est].variacoes[sel.var_].score && (
                <div className="mt-3 bg-white rounded-lg p-4 max-w-md w-full">
                  <div className="text-xs font-bold text-sz-navy mb-2">Validação</div>
                  <div className="text-xs text-sz-gray">{data.estruturas[sel.est].variacoes[sel.var_].diagnostico}</div>
                </div>
              )}
              <button onClick={() => setSel(null)} className="mt-3 bg-white text-sz-navy px-5 py-2 rounded-lg text-sm font-bold">Fechar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default static ads with real images
  const defaults: Variacao[] = [
    { id: "SQ-01", frase_destaque: "Airbnb bom não começa\nna fachada.\nComeça no lugar.", texto_secundario: "ROI 16,40% ao ano — R$ 5.500/mês líquidos", pontos_fortes: "L | ROI | Re", badge: "Grupo fechando", cta: "Saiba mais", visual_fundo: "aereo-pin" },
    { id: "ST-01", frase_destaque: "Com investimento a partir\nde R$ 335 mil e renda\nestimada de R$ 66 mil/ano", texto_secundario: "Gestão completa pela Seazone", cta: "Ver oportunidade", visual_fundo: "fachada" },
    { id: "SQ-02", frase_destaque: "ROI 16,40% ao ano.\nAcima da Selic.\nAcima dos concorrentes.", texto_secundario: "81% de valorização estimada", pontos_fortes: "ROI | L | V", badge: "49 cotas", cta: "Conheça o SPOT", visual_fundo: "rooftop" },
    { id: "LS-01", frase_destaque: "O que sustenta esse investimento:\ndemanda recorrente + gestão profissional", texto_secundario: "R$ 350 mil ticket médio — R$ 5.500/mês", cta: "Fale com especialista", visual_fundo: "aereo-praia" },
    { id: "SQ-03", frase_destaque: "Renda passiva com Airbnb\nem Florianópolis.\nSem gerir nada.", texto_secundario: "R$ 66 mil líquidos/ano — ROI 16,40%", cta: "Saiba mais", visual_fundo: "rooftop-render" },
    { id: "ST-02", frase_destaque: "Campeche: entre os bairros\ncom maior faturamento\nbruto de Florianópolis", texto_secundario: "R$ 335 mil — menor cota disponível", badge: "Últimas unidades", cta: "Quero investir", visual_fundo: "aereo-praia" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-sz-navy">{defaults.length} peças pré-geradas — clique "Gerar" para criar com IA</h3>
        <p className="text-xs text-sz-gray">Imagens reais do Novo Campeche SPOT II</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
        {defaults.map((v, i) => {
          const fmt = ["sq", "st", "sq", "ls", "sq", "st"][i];
          return (
            <div key={i} className="cursor-pointer hover:scale-[1.03] transition-transform" onClick={() => setSel({ est: 0, var_: i })}>
              <AdPiece v={v} fmt={fmt} />
              <div className="mt-1.5"><span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded">{v.id}</span></div>
            </div>
          );
        })}
      </div>
      {sel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSel(null)}>
          <div className="animate-fade-in flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <AdPiece v={defaults[sel.var_]} fmt={["sq", "st", "sq", "ls", "sq", "st"][sel.var_]} full />
            <button onClick={() => setSel(null)} className="mt-3 bg-white text-sz-navy px-5 py-2 rounded-lg text-sm font-bold">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
