"use client"

import { useState } from "react"

const TEXT_FIELDS: { name: string; label: string; type?: string; placeholder?: string }[] = [
  { name: "fullName", label: "Full name" },
  { name: "workEmail", label: "Work email", type: "email" },
  { name: "company", label: "Company" },
  { name: "website", label: "Company website", placeholder: "https://" },
  { name: "role", label: "Role" },
  { name: "category", label: "Product category" },
  { name: "competitors", label: "Primary competitors" },
  { name: "seoTeamSize", label: "Current SEO or content team size" },
  { name: "aiTools", label: "Current AI-visibility tools" },
  { name: "analytics", label: "Analytics platform" },
]

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1000+"]
const IMPLEMENT_OPTIONS = ["Yes", "No", "Not sure yet"]

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-[11px] tracking-widest uppercase text-black/40 mb-2">{children}</span>
}

const inputClass =
  "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/25 focus:outline-none focus:border-black/30 transition-colors"

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">
      {/* Simple top bar */}
      <header className="px-6 md:px-12 lg:px-20 py-6 border-b border-black/[0.06]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-pixel text-xs tracking-[0.25em] text-black/70 hover:text-black transition-colors"><img src="/images/logo.svg" alt="" className="h-4" />GLLEAM</a>
          <a href="/" className="text-[11px] text-black/50 hover:text-black transition-colors tracking-widest">← BACK</a>
        </div>
      </header>

      <main className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="rounded-2xl border border-black/[0.08] bg-white p-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-600/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                APPLICATION RECEIVED
              </div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-4">Thank you.</h1>
              <p className="text-sm text-black/45 leading-relaxed max-w-md mx-auto">
                The GLLEAM team will review your application and contact suitable design partners directly.
              </p>
              <a href="/" className="inline-block mt-8 px-8 py-3 bg-[#111] text-white text-xs rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium">
                RETURN HOME
              </a>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04] mb-5">
                  DESIGN PARTNERS
                </span>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-5 text-balance">
                  Apply for a GLLEAM design-partner pilot.
                </h1>
                <p className="text-sm text-black/45 leading-relaxed max-w-xl">
                  Tell us about your category, current AI-discovery concerns, and the experiment your team may be able to implement.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (acknowledged) setSubmitted(true)
                }}
                className="rounded-2xl border border-black/[0.08] bg-white p-6 md:p-10 flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {TEXT_FIELDS.map((f) => (
                    <label key={f.name} className="block">
                      <Label>{f.label}</Label>
                      <input
                        name={f.name}
                        type={f.type ?? "text"}
                        placeholder={f.placeholder}
                        required={f.name === "fullName" || f.name === "workEmail" || f.name === "company"}
                        className={inputClass}
                      />
                    </label>
                  ))}

                  <label className="block">
                    <Label>Company size</Label>
                    <select name="companySize" required defaultValue="" className={inputClass}>
                      <option value="" disabled>Select…</option>
                      {COMPANY_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <Label>Implement one experiment within 30 days</Label>
                    <select name="canImplement" required defaultValue="" className={inputClass}>
                      <option value="" disabled>Select…</option>
                      {IMPLEMENT_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <Label>Main AI-discovery concern</Label>
                  <textarea name="concern" rows={3} className={inputClass} />
                </label>

                <label className="block">
                  <Label>Additional context</Label>
                  <textarea name="context" rows={4} className={inputClass} />
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#111]"
                  />
                  <span className="text-xs text-black/50 leading-relaxed">
                    I understand that GLLEAM measures and tests AI-discovery outcomes but does not guarantee placement or recommendation by third-party AI systems.
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full sm:w-auto self-start px-8 py-3 bg-[#111] text-white text-xs rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!acknowledged}
                >
                  SUBMIT APPLICATION
                </button>

                <p className="text-[11px] text-black/30 leading-relaxed">
                  We will use the information you provide to evaluate your application and contact you about GLLEAM. We will not sell your contact information.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
