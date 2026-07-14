"use client"

type Row = {
  cluster: string
  finding: string
  evidence: string
  status: string
  color: string
}

const ROWS: Row[] = [
  { cluster: "Category recommendation", finding: "Brand is omitted from the shortlist", evidence: "Four recurring competitor sources", status: "PRIORITY", color: "#f87171" },
  { cluster: "Integration fit", finding: "Owned integration page is outdated", evidence: "Current product documentation", status: "READY TO TEST", color: "#4ade80" },
  { cluster: "Compliance proof", finding: "Claims are broad and weakly substantiated", evidence: "Competitor certification and case evidence", status: "NEEDS EVIDENCE", color: "#facc15" },
  { cluster: "Third-party comparison", finding: "High-influence page omits the brand", evidence: "Repeated citation across observations", status: "OUTREACH", color: "#60a5fa" },
  { cluster: "Control group", finding: "Comparable untreated questions selected", evidence: "Baseline observation history", status: "ACTIVE", color: "#4ade80" },
]

const GRID = "1fr 1.3fr 1.3fr 100px"

export function LiveAgentFeed() {
  return (
    <div style={{
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 16,
      overflow: "hidden",
      background: "rgba(255,255,255,0.7)",
    }}>
      {/* Table header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: GRID,
        padding: "8px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(0,0,0,0.03)",
        gap: 8,
      }}>
        {["PROMPT CLUSTER", "FINDING", "EVIDENCE", "STATUS"].map(h => (
          <span key={h} style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(0,0,0,0.30)", fontFamily: "monospace" }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div>
        {ROWS.map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: GRID,
              padding: "12px 16px",
              borderBottom: i < ROWS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
              gap: 8,
              alignItems: "center",
              animation: `rowSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both`,
            }}
          >
            {/* Cluster */}
            <div style={{ fontSize: 10, color: "rgba(0,0,0,0.7)", fontWeight: 500, lineHeight: 1.35 }}>{row.cluster}</div>

            {/* Finding */}
            <div style={{ fontSize: 10, color: "rgba(0,0,0,0.5)", lineHeight: 1.35 }}>{row.finding}</div>

            {/* Evidence */}
            <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", lineHeight: 1.35 }}>{row.evidence}</div>

            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: row.color,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 7.5, fontFamily: "monospace", color: "rgba(0,0,0,0.45)", letterSpacing: "0.08em" }}>{row.status}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
