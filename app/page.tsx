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
  
  // -- ÚJ VÁLTOZÓK AZ EMBEDHEZ --
  const [fejlecSzoveg, setFejlecSzoveg] = useState("")
  const [egyediIdopont, setEgyediIdopont] = useState("")

  const [vegrehajtas, setVegrehajtas] = useState(false)
  const [spamBekapcsolva, setSpamBekapcsolva] = useState(false)
  const [spamIntervallum, setSpamIntervallum] = useState(1000)
  const [spamDarab, setSpamDarab] = useState(5)

  const [naplok, setNaplok] = useState<NaploBejegyzes[]>([
    { type: "RENDSZER", message: "Kész. Webhook beállításra vár.", timestamp: new Date() },
  ])

  const megszakitasRef = useRef(false);

  const naploHozzaadas = useCallback((type: NaploBejegyzes["type"], message: string) => {
    setNaplok((elozo) => [...elozo, { type, message, timestamp: new Date() }])
  }, [])

  const stopFolyamat = useCallback(() => {
    megszakitasRef.current = true;
    naploHozzaadas("HIBA", "LEÁLLÍTÁS: A folyamat megállítva.");
  }, [naploHozzaadas]);

  const webhookKuldes = useCallback(async (): Promise<{ success?: boolean; rateLimited?: boolean; retryAfter?: number }> => {
    const valasz = await fetch("/api/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        webhookUrl,
        megpitoNev,
        avatarUrl,
        tartalom,
        embedHasznalata,
        embedSzin,
        lablecSzoveg,
        fejlecSzoveg, // ÚJ
        egyediIdopont // ÚJ
      }),
    })
    const adat = await valasz.json()

    if (valasz.status === 429) {
      return { rateLimited: true, retryAfter: adat.retryAfter || 5 }
    }

    if (!valasz.ok) throw new Error(adat.error || "Kérés sikertelen")
    return { success: true }
  }, [webhookUrl, megpitoNev, avatarUrl, tartalom, embedHasznalata, embedSzin, lablecSzoveg, fejlecSzoveg, egyediIdopont])

  const vegrehajtasInditasa = useCallback(async () => {
    if (!webhookUrl.trim()) {
      naploHozzaadas("HIBA", "Webhook URL megadása kötelező.")
      return
    }
    if (!tartalom.trim()) {
      naploHozzaadas("HIBA", "Üzenet tartalom megadása kötelező.")
      return
    }

    const urlMinta = /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/.+$/
    if (!urlMinta.test(webhookUrl)) {
      naploHozzaadas("HIBA", "Érvénytelen Discord webhook URL formátum.")
      return
    }

    naploHozzaadas("INFO", "Webhook URL ellenőrizve.")

    if (spamBekapcsolva) {
      if (spamIntervallum < 500) {
        naploHozzaadas("FIGYELEM", `Időköz: ${spamIntervallum}ms -- rendkívül alacsony! A Discord szinte biztosan rate limitelni fog.`)
      } else if (spamIntervallum < 1000) {
        naploHozzaadas("FIGYELEM", `Időköz: ${spamIntervallum}ms -- alacsony. Rate limit kockázat fennáll.`)
      }
      if (spamDarab > 50) {
        naploHozzaadas("FIGYELEM", `Darabszám: ${spamDarab} -- nagyon magas. A webhook bannolásának kockázata megnő.`)
      } else if (spamDarab > 20) {
        naploHozzaadas("FIGYELEM", `Darabszám: ${spamDarab} -- magas. Óvatosan, a webhook törölhető.`)
      }
    }

    setVegrehajtas(true)
    megszakitasRef.current = false

    const osszesen = spamBekapcsolva ? spamDarab : 1

    for (let i = 0; i < osszesen; i++) {
      if (megszakitasRef.current) {
        naploHozzaadas("FIGYELEM", "Végrehajtás megszakítva.")
        break
      }

      naploHozzaadas("INFO", `Üzenet küldése ${i + 1}/${osszesen}...`)

      try {
        const eredmeny = await webhookKuldes()

        if (eredmeny.rateLimited) {
          const pihenoMp = eredmeny.retryAfter || 5
          naploHozzaadas("FIGYELEM", `Rate limit! Várakozás ${pihenoMp} másodpercig...`)

          // Visszaszámlálás a konzolban
          for (let mp = pihenoMp; mp > 0; mp--) {
            await new Promise((r) => setTimeout(r, 1000))
            if (megszakitasRef.current) break
            if (mp > 1) {
              naploHozzaadas("FIGYELEM", `Pihenőidőszak: még ${mp - 1} mp...`)
            }
          }

          if (megszakitasRef.current) {
            naploHozzaadas("FIGYELEM", "Végrehajtás megszakítva.")
            break
          }

          // Újrapróbálkozás ugyanazzal az üzenettel
          naploHozzaadas("INFO", `Újrapróbálkozás ${i + 1}/${osszesen}...`)
          try {
            const ujra = await webhookKuldes()
            if (ujra.rateLimited) {
              naploHozzaadas("HIBA", "Ismét rate limit. Küldés leállítva a webhook védelme érdekében.")
              break
            }
            naploHozzaadas("SIKERES", `Üzenet ${i + 1}/${osszesen} kézbesítve (újrapróbálkozás után).`)
          } catch (err2) {
            const uzenet2 = err2 instanceof Error ? err2.message : "Ismeretlen hiba"
            naploHozzaadas("HIBA", `Sikertelen újrapróbálkozás: ${uzenet2}`)
            break
          }
        } else {
          naploHozzaadas("SIKERES", `Üzenet ${i + 1}/${osszesen} kézbesítve.`)
        }
      } catch (err) {
        const uzenet = err instanceof Error ? err.message : "Ismeretlen hiba"
        naploHozzaadas("HIBA", `Sikertelen: ${uzenet}`)
        break
      }

      if (spamBekapcsolva && i < osszesen - 1) {
        await new Promise((resolve) => setTimeout(resolve, spamIntervallum))
      }
    }

    setVegrehajtas(false)
    naploHozzaadas("RENDSZER", "Végrehajtás befejezve.")
  }, [webhookUrl, tartalom, spamBekapcsolva, spamDarab, spamIntervallum, webhookKuldes, naploHozzaadas])

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-[600px] border border-border bg-card">
        {/* Fejléc */}
        <div className="border-b border-border px-5 py-4 flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-500/80 rounded-full" aria-hidden="true" />
            <span className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full" aria-hidden="true" />
            <span className="w-2.5 h-2.5 bg-green-500/80 rounded-full" aria-hidden="true" />
          </div>
          <h1 className="text-xs uppercase tracking-widest text-muted-foreground">
            Discord Webhook Vezérlő
          </h1>
        </div>

        {/* Tartalom */}
        <div className="p-5 space-y-6">
          <WebhookBeallitasok
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            megpitoNev={megpitoNev}
            setMegpitoNev={setMegpitoNev}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
          />

          <div className="border-t border-border" />

          <UzenetSzerkeszto
            tartalom={tartalom}
            setTartalom={setTartalom}
            embedHasznalata={embedHasznalata}
            setEmbedHasznalata={setEmbedHasznalata}
            embedSzin={embedSzin}
            setEmbedSzin={setEmbedSzin}
            lablecSzoveg={lablecSzoveg}
            setLablecSzoveg={setLablecSzoveg}
            fejlecSzoveg={fejlecSzoveg}           // ÚJ
            setFejlecSzoveg={setFejlecSzoveg}     // ÚJ
            egyediIdopont={egyediIdopont}         // ÚJ
            setEgyediIdopont={setEgyediIdopont}   // ÚJ
          />

          <div className="border-t border-border" />

          <VegrehajtasZona
            onVegrehajtas={vegrehajtasInditasa} 
            onStop={stopFolyamat} 
            vegrehajtas={vegrehajtas}
            spamBekapcsolva={spamBekapcsolva}
            setSpamBekapcsolva={setSpamBekapcsolva}
            spamIntervallum={spamIntervallum}
            setSpamIntervallum={setSpamIntervallum}
            spamDarab={spamDarab}
            setSpamDarab={setSpamDarab}
          />

          <div className="border-t border-border" />

          <section aria-label="Stílus Segédlet">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Stílus Segédlet (Markdown)
            </h2>
            <div className="border border-border bg-secondary p-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
              <p>Vastag: <span className="text-foreground font-bold">**szöveg**</span></p>
              <p>Dőlt: <span className="text-foreground italic">*szöveg*</span></p>
              <p>Áthúzott: <span className="text-foreground line-through">~~szöveg~~</span></p>
              <p>Aláhúzott: <span className="text-foreground underline">__szöveg__</span></p>
              <p>Kód: <code className="text-green-500 bg-background px-1 py-0.5 border border-border">`szöveg`</code></p>
              <p>Idézet: <span className="text-foreground">{">"} szöveg</span></p>
            </div>
          </section>

          <div className="border-t border-border" />

          <AllapotKonzol naplok={naplok} />
        </div>
      </div>
    </main>
  )
}
