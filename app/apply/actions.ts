"use server"

import { Resend } from "resend"

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  workEmail: "Work email",
  company: "Company",
  website: "Company website",
  role: "Role",
  category: "Product category",
  competitors: "Primary competitors",
  seoTeamSize: "SEO / content team size",
  aiTools: "Current AI-visibility tools",
  analytics: "Analytics platform",
  companySize: "Company size",
  canImplement: "Can implement one experiment within 30 days",
  concern: "Main AI-discovery concern",
  context: "Additional context",
}

export type SubmitState = { ok: boolean; error?: string }

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function submitApplication(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, error: "The application inbox is not configured yet. Please try again shortly." }
  }

  const entries: [string, string][] = []
  for (const key of Object.keys(FIELD_LABELS)) {
    const raw = formData.get(key)
    const value = typeof raw === "string" ? raw.trim() : ""
    if (value) entries.push([FIELD_LABELS[key], value])
  }

  const fullName = (formData.get("fullName") as string)?.trim() || "Unknown"
  const workEmail = (formData.get("workEmail") as string)?.trim() || ""
  const company = (formData.get("company") as string)?.trim() || "Unknown company"

  if (!workEmail) {
    return { ok: false, error: "A work email is required." }
  }

  const rows = entries
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(
          label,
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td></tr>`,
    )
    .join("")

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;margin:0 auto;">
      <h2 style="font-weight:500;">New GLLEAM design-partner application</h2>
      <p style="color:#555;">${escapeHtml(fullName)} from ${escapeHtml(company)} applied for a pilot.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">${rows}</table>
    </div>`

  const text = entries.map(([label, value]) => `${label}: ${value}`).join("\n")

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: process.env.APPLICATION_FROM_EMAIL || "GLLEAM Applications <onboarding@resend.dev>",
      to: process.env.APPLICATION_TO_EMAIL || "amin.delshad@gmail.com",
      replyTo: workEmail,
      subject: `GLLEAM pilot application — ${company}`,
      html,
      text,
    })

    if (error) {
      console.log("[v0] Resend error:", error)
      return { ok: false, error: "We couldn't send your application. Please try again." }
    }

    return { ok: true }
  } catch (err) {
    console.log("[v0] submitApplication error:", err)
    return { ok: false, error: "Something went wrong. Please try again." }
  }
}
