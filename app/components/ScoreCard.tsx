"use client";

interface Score {
  clareza: number;
  hook: number;
  construcao: number;
  comercial: number;
  tom: number;
  final: number;
  classificacao: string;
}

const CLASSIF_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  DESCARTAR: { bg: "#FFF6F5", text: "#DC2626", border: "#FFCECD" },
  AJUSTAR: { bg: "#FFF8ED", text: "#D88800", border: "#FCC74D" },
  TESTAR: { bg: "#E8EFFE", text: "#0055FF", border: "#6593FF" },
  ESCALAR: { bg: "#E1F8ED", text: "#249555", border: "#77DBA4" },
  EXCEPCIONAL: { bg: "#E1F8ED", text: "#166534", border: "#2BBD68" },
};

function ScoreBar({ label, value, weight }: { label: string; value: number; weight: string }) {
  const pct = value * 10;
  const color = value >= 8 ? "#2BBD68" : value >= 6 ? "#0055FF" : value >= 4 ? "#FAA200" : "#FC6058";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div style={{ width: 110, fontSize: 11, color: "#2E2E2E", fontWeight: 500, display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span style={{ color: "#7C7C7C", fontSize: 10 }}>{weight}</span>
      </div>
      <div style={{ flex: 1, height: 8, background: "#E8EFFE", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ width: 28, fontSize: 12, fontWeight: 700, color, textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default function ScoreCard({ score, diagnostico, compact = false }: { score?: Score; diagnostico?: string; compact?: boolean }) {
  if (!score) return null;
  const cl = CLASSIF_COLORS[score.classificacao] || CLASSIF_COLORS.AJUSTAR;

  if (compact) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: cl.text,
          background: cl.bg, border: `1px solid ${cl.border}`,
          borderRadius: 6, padding: "2px 8px",
        }}>
          {score.final.toFixed(1)} — {score.classificacao}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      background: "white", borderRadius: 10,
      border: `1px solid ${cl.border}`,
      padding: 16, marginTop: 12,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/logo-seazone-azul.png" alt="" style={{ height: 16 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#00143D", letterSpacing: 0.5 }}>VALIDADOR</span>
        </div>
        <div style={{
          background: cl.bg, border: `1.5px solid ${cl.border}`,
          borderRadius: 8, padding: "4px 12px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: cl.text }}>{score.final.toFixed(1)}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: cl.text }}>{score.classificacao}</span>
        </div>
      </div>

      {/* Score bars */}
      <ScoreBar label="Hook" value={score.hook} weight="25%" />
      <ScoreBar label="Clareza" value={score.clareza} weight="20%" />
      <ScoreBar label="Argumento" value={score.construcao} weight="20%" />
      <ScoreBar label="Comercial" value={score.comercial} weight="20%" />
      <ScoreBar label="Tom Seazone" value={score.tom} weight="15%" />

      {/* Diagnostico */}
      {diagnostico && (
        <div style={{
          marginTop: 10, padding: "8px 10px",
          background: "#F8FAFC", borderRadius: 6,
          borderLeft: `3px solid ${cl.border}`,
        }}>
          <p style={{ fontSize: 11, color: "#2E2E2E", lineHeight: 1.5, margin: 0 }}>{diagnostico}</p>
        </div>
      )}
    </div>
  );
}

export function RankingPanel({ ranking, recomendacao }: { ranking?: any[]; recomendacao?: any }) {
  if (!ranking || ranking.length === 0) return null;

  return (
    <div style={{
      background: "white", borderRadius: 12,
      border: "1px solid #E8EFFE",
      padding: 20, marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <img src="/logo-seazone-azul.png" alt="" style={{ height: 18 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#00143D" }}>RANKING DE CRIATIVOS</span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {ranking.slice(0, 5).map((r: any, i: number) => {
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`;
          const bg = i === 0 ? "#E1F8ED" : i === 1 ? "#E8EFFE" : "#F8FAFC";
          const border = i === 0 ? "#2BBD68" : i === 1 ? "#6593FF" : "#E2E8F0";
          return (
            <div key={i} style={{
              background: bg, border: `1px solid ${border}`,
              borderRadius: 8, padding: "8px 14px",
              flex: "1 1 auto", minWidth: 120,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{medal}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#00143D" }}>{r.id}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#0055FF", marginLeft: "auto" }}>{typeof r.score === 'number' ? r.score.toFixed(1) : r.score}</span>
              </div>
              {r.motivo && <p style={{ fontSize: 10, color: "#7C7C7C", margin: 0, lineHeight: 1.4 }}>{r.motivo}</p>}
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {recomendacao && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {recomendacao.escalar?.length > 0 && (
            <span style={{ fontSize: 10, background: "#E1F8ED", color: "#249555", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
              🚀 Escalar: {recomendacao.escalar.join(", ")}
            </span>
          )}
          {recomendacao.testar?.length > 0 && (
            <span style={{ fontSize: 10, background: "#E8EFFE", color: "#0055FF", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
              🧪 Testar: {recomendacao.testar.join(", ")}
            </span>
          )}
          {recomendacao.ajustar?.length > 0 && (
            <span style={{ fontSize: 10, background: "#FFF8ED", color: "#D88800", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
              ✏️ Ajustar: {recomendacao.ajustar.join(", ")}
            </span>
          )}
          {recomendacao.pausar?.length > 0 && (
            <span style={{ fontSize: 10, background: "#FFF6F5", color: "#DC2626", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
              ⏸️ Pausar: {recomendacao.pausar.join(", ")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
