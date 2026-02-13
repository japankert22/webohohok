"use client"

import { useState, useCallback, useRef } from "react"
import { WebhookBeallitasok } from "@/components/webhook-config"
import { UzenetSzerkeszto } from "@/components/message-composer"
import { VegrehajtasZona } from "@/components/execution-zone"
import { AllapotKonzol, type NaploBejegyzes } from "@/components/status-console"

export default function Fooldal() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [megpitoNev, setMegpitoNev] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [tartalom, setTartalom] = useState("")
  const [embedHasznalata, setEmbedHasznalata] = useState(false)
  const [embedSzin, setEmbedSzin] = useState("#5865f2")
  const [lablecSzoveg, setLablecSzoveg] = useState("")
  const [vegrehajtas, setVegrehajtas] = useState(false)
  const [spamBekapcsolva, setSpamBekapcsolva] = useState(false)
  const [egyediIdopont, setEgyediIdopont] = useState(new Date().toISOString().slice(0, 16));
  const [spamIntervallum, setSpamIntervallum] = useState(1000)
  const [spamDarab, setSpamDarab] = useState(5)
  const [naplok, setNaplok] = useState<NaploBejegyzes[]>([
    { type: "RENDSZER", message: "Kész. Webhook beállításra vár.", timestamp: new Date() },
  ])

  const megszakitasRef = useRef(false)

  const naploHozzaadas = useCallback((type: NaploBejegyzes["type"], message: string) => {
    setNaplok((elozo) => [...elozo, { type, message, timestamp: new Date() }])
  }, [])

  const stopFolyamat = useCallback(() => {
    megszakitasRef.current = true
    naploHozzaadas("HIBA", "LEÁLLÍTÁS: A folyamat megállítva a felhasználó által.")
  }, [naploHozzaadas])

  const webhookKuldes = useCallback(async (): Promise<{ success?: boolean; rateLimited?: boolean; retryAfter?: number }> => {
    const valasz = await fetch("/api/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhookUrl, megpitoNev, avatarUrl, tartalom, embedHasznalata, embedSzin, lablecSzoveg }),
    })
    const adat = await valasz.json()
    if (valasz.status === 429) return { rateLimited: true, retryAfter: adat.retryAfter || 5 }
    if (!valasz.ok) throw new Error(adat.error || "Kérés sikertelen")
    return { success: true }
  }, [webhookUrl, megpitoNev, avatarUrl, tartalom, embedHasznalata, embedSzin, lablecSzoveg, egyediIdopont])

  const vegrehajtasInditasa = useCallback(async () => {
    if (!webhookUrl.trim() || !tartalom.trim()) {
      naploHozzaadas("HIBA", "Webhook URL és tartalom kötelező.")
      return
    }

    setVegrehajtas(true)
    megszakitasRef.current = false
    const osszesen = spamBekapcsolva ? spamDarab : 1

    for (let i = 0; i < osszesen; i++) {
      if (megszakitasRef.current) break

      naploHozzaadas("INFO", `Üzenet küldése ${i + 1}/${osszesen}...`)
      try {
        const eredmeny = await webhookKuldes()
        if (eredmeny.rateLimited) {
          const piheno = eredmeny.retryAfter || 5
          naploHozzaadas("FIGYELEM", `Rate limit! Várakozás ${piheno} mp...`)
          for (let s = piheno; s > 0; s--) {
            await new Promise(r => setTimeout(r, 1000))
            if (megszakitasRef.current) break
          }
          if (megszakitasRef.current) break
          i-- // Újrapróbálkozás
          continue
        }
        naploHozzaadas("SIKERES", `Üzenet ${i + 1}/${osszesen} elküldve.`)
      } catch (err) {
        naploHozzaadas("HIBA", "Sikertelen küldés.")
        break
      }
      if (spamBekapcsolva && i < osszesen - 1) {
        await new Promise(r => setTimeout(r, spamIntervallum))
      }
    }

    setVegrehajtas(false)
    naploHozzaadas("RENDSZER", "Végrehajtás befejezve.")
  }, [webhookUrl, tartalom, spamBekapcsolva, spamDarab, spamIntervallum, webhookKuldes, naploHozzaadas])

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-10 bg-background">
      <div className="w-full max-w-[600px] border border-border bg-card shadow-2xl">
        {/* Fejléc v2.0 */}
        <div className="border-b-2 border-primary bg-primary/5 px-6 py-8">
          <h1 className="text-4xl font-black italic tracking-tighter text-primary uppercase">Webohohok v2.0</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mt-1">Discord Webhook Automation Center</p>
        </div>

        <div className="p-6 space-y-8">
          <WebhookBeallitasok webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} megpitoNev={megpitoNev} setMegpitoNev={setMegpitoNev} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
          <div className="border-t border-border" />
          <UzenetSzerkeszto tartalom={tartalom} setTartalom={setTartalom} embedHasznalata={embedHasznalata} setEmbedHasznalata={setEmbedHasznalata} embedSzin={embedSzin} setEmbedSzin={setEmbedSzin} lablecSzoveg={lablecSzoveg} setLablecSzoveg={setLablecSzoveg} />
          <div className="border-t border-border" />
          
          <VegrehajtasZona 
            onVegrehajtas={vegrehajtasInditasa} 
            onStop={stopFolyamat} 
            vegrehajtas={vegrehajtas}
            spamBekapcsolva={spamBekapcsolva} setSpamBekapcsolva={setSpamBekapcsolva}
            spamIntervallum={spamIntervallum} setSpamIntervallum={setSpamIntervallum}
            spamDarab={spamDarab} setSpamDarab={setSpamDarab}
          />

          <div className="border-t border-border" />

          {/* Stílus Segédlet - GRID FORMÁTUM */}
          <section>
            <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-bold italic">Markdown Segédlet</h2>
            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono bg-black/40 p-4 border border-zinc-800">
              <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Vastag:</span> <span className="text-primary">**szöveg**</span></div>
              <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Dőlt:</span> <span className="text-primary">*szöveg*</span></div>
              <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Áthúzott:</span> <span className="text-primary">~~szöveg~~</span></div>
              <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Kód:</span> <span className="text-primary">`szöveg`</span></div>
              <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Aláhúzott:</span> <span className="text-primary">__szöveg__</span></div>
              <div className="flex justify-between border-b border-zinc-800 pb-1"><span>Idézet:</span> <span className="text-primary">{">"} szöveg</span></div>
            </div>
          </section>

          <div className="border-t border-border" />
          <AllapotKonzol naplok={naplok} />
        </div>
      </div>
    </main>
  )
}
