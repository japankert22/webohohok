export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { webhookUrl, megpitoNev, avatarUrl, tartalom, embedHasznalata, embedSzin, lablecSzoveg, fejlecSzoveg, egyediIdopont } = body

    if (!webhookUrl || !tartalom) {
      return NextResponse.json({ error: "Hiányzó webhook URL vagy tartalom" }, { status: 400 })
    }

    // Discord webhook URL ellenőrzés
    const urlMinta = /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/.+$/
    if (!urlMinta.test(webhookUrl)) {
      return NextResponse.json({ error: "Érvénytelen Discord webhook URL" }, { status: 400 })
    }

    // Payload összeállítás
    const payload: Record<string, unknown> = {
      content: embedHasznalata ? undefined : tartalom,
    }

    if (megpitoNev) payload.username = megpitoNev
    if (avatarUrl) payload.avatar_url = avatarUrl

    if (embedHasznalata) {
      const szinSzam = embedSzin ? parseInt(embedSzin.replace("#", ""), 16) : undefined
      payload.embeds = [
        {
          title: fejlecSzoveg || undefined,
          description: tartalom,
          color: szinSzam,
          timestamp: egyediIdopont,
          ...(lablecSzoveg ? { footer: { text: lablecSzoveg } } : {}),
        },
      ]
    }

    const valasz = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (valasz.status === 429) {
      let pihenoMp = 5
      try {
        const rateLimitAdat = await valasz.json()
        if (rateLimitAdat.retry_after) {
          pihenoMp = Math.ceil(rateLimitAdat.retry_after)
        }
      } catch {
        // ha nem sikerül kiolvasni, marad az alapértelmezett
      }
      return NextResponse.json(
        { error: "RATE_LIMIT", retryAfter: pihenoMp },
        { status: 429 }
      )
    }

    if (!valasz.ok) {
      const hibaSzoveg = await valasz.text()
      return NextResponse.json(
        { error: `Discord API hiba: ${valasz.status}`, details: hibaSzoveg },
        { status: valasz.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const uzenet = err instanceof Error ? err.message : "Ismeretlen hiba"
    return NextResponse.json({ error: uzenet }, { status: 500 })
  }
}
