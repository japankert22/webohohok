"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { ChevronDown } from "lucide-react"

interface UzenetSzerkesztoProps {
  tartalom: string
  setTartalom: (v: string) => void
  embedHasznalata: boolean
  setEmbedHasznalata: (v: boolean) => void
  embedSzin: string
  setEmbedSzin: (v: string) => void
  lablecSzoveg: string
  setLablecSzoveg: (v: string) => void
  fejlecSzoveg: string
  setFejlecSzoveg: (v: string) => void
  egyediIdopont: string
  setEgyediIdopont: (v: string) => void
  embedKulsoSzoveg: string
  setEmbedKulsoSzoveg: (v: string) => void
}

export function UzenetSzerkeszto({
  tartalom,
  setTartalom,
  embedHasznalata,
  setEmbedHasznalata,
  embedSzin,
  setEmbedSzin,
  lablecSzoveg,
  setLablecSzoveg,
  fejlecSzoveg,
  setFejlecSzoveg,
  egyediIdopont,
  setEgyediIdopont,
  embedKulsoSzoveg,
  setEmbedKulsoSzoveg,
}: UzenetSzerkesztoProps) {
  const [stilusNyitva, setStilusNyitva] = useState(false)

  return (
    <section aria-label="Uzenet Szerkeszto">
      <h2 className="text-xs uppercase tracking-widest text-white font-bold mb-3">
        {"Üzenet Szerkesztő"}
      </h2>
      <div className="space-y-3">
        
        <div>
          <label htmlFor="uzenet-tartalom" className="sr-only">{"Uzenet Tartalom"}</label>
          <textarea
            id="uzenet-tartalom"
            rows={5}
            placeholder={"\u00cdrd be az \u00fczenet tartalm\u00e1t..."}
            value={tartalom}
            onChange={(e) => setTartalom(e.target.value)}
            className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between border border-border bg-secondary px-3 py-2.5">
          <label htmlFor="embed-valto" className="text-xs text-muted-foreground cursor-pointer">
            {"Embed St\u00edlus Haszn\u00e1lata"}
          </label>
          <Switch
            id="embed-valto"
            checked={embedHasznalata}
            onCheckedChange={setEmbedHasznalata}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {embedHasznalata && (
          <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">

            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-tighter">
                {"Embed K\u00edv\u00fcli Sz\u00f6veg (Content)"}
              </label>
              <input
                type="text"
                placeholder={"pl. @everyone, @here, vagy b\u00e1rmilyen sz\u00f6veg..."}
                value={embedKulsoSzoveg}
                onChange={(e) => setEmbedKulsoSzoveg(e.target.value)}
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                {"Ez a sz\u00f6veg az embed F\u00d6L\u00d6TT jelenik meg (opcion\u00e1lis)"}
              </p>
            </div>
            
            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-tighter">
                {"Fejl\u00e9c Sz\u00f6veg (C\u00edm)"}
              </label>
              <input
                type="text"
                placeholder={"Embed c\u00edme..."}
                value={fejlecSzoveg}
                onChange={(e) => setFejlecSzoveg(e.target.value)}
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="embed-szin" className="block text-xs text-muted-foreground mb-1 uppercase tracking-tighter">
                  {"Embed Sz\u00edn"}
                </label>
                <div className="flex items-center gap-2 bg-secondary border border-border px-3 py-2 h-[38px]">
                  <input
                    type="color"
                    value={embedSzin}
                    onChange={(e) => setEmbedSzin(e.target.value)}
                    className="w-6 h-6 border-0 bg-transparent cursor-pointer p-0"
                    aria-label={"Embed sz\u00edn v\u00e1laszt\u00f3"}
                  />
                  <input
                    id="embed-szin"
                    type="text"
                    value={embedSzin}
                    onChange={(e) => setEmbedSzin(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground focus:outline-none uppercase"
                    maxLength={7}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lablec-szoveg" className="block text-xs text-muted-foreground mb-1 uppercase tracking-tighter">
                  {"L\u00e1bl\u00e9c Sz\u00f6veg"}
                </label>
                <div className="h-[38px]">
                  <input
                    id="lablec-szoveg"
                    type="text"
                    placeholder={"Opcion\u00e1lis l\u00e1bl\u00e9c..."}
                    value={lablecSzoveg}
                    onChange={(e) => setLablecSzoveg(e.target.value)}
                    className="w-full h-full bg-secondary border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-tighter">
                {"Egyedi Id\u0151pont (Timestamp)"}
              </label>
              <input
                type="datetime-local"
                value={egyediIdopont}
                onChange={(e) => setEgyediIdopont(e.target.value)}
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
            
          </div>
        )}

        {/* Stilus Segedlet - ugyanolyan formatum mint a Spam Beallitasok */}
        <div className="border border-border bg-secondary/50 p-4 space-y-4">
          <button
            type="button"
            onClick={() => setStilusNyitva(!stilusNyitva)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              {"St\u00edlus Seg\u00e9dlet (Markdown)"}
            </span>
            <ChevronDown
              size={14}
              className={`text-muted-foreground transition-transform duration-200 ${stilusNyitva ? "rotate-180" : ""}`}
            />
          </button>

          {stilusNyitva && (
            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-200">
              <p>{"Vastag: "}<span className="text-white font-bold">{"**sz\u00f6veg**"}</span></p>
              <p>{"D\u0151lt: "}<span className="text-white italic">{"*sz\u00f6veg*"}</span></p>
              <p>{"\u00c1th\u00fazott: "}<span className="text-white line-through">{"~~sz\u00f6veg~~"}</span></p>
              <p>{"Al\u00e1h\u00fazott: "}<span className="text-white underline">{"__sz\u00f6veg__"}</span></p>
              <p>{"K\u00f3d: "}<code className="text-green-500 bg-background px-1 py-0.5 border border-border">{"`sz\u00f6veg`"}</code></p>
              <p>{"Id\u00e9zet: "}<span className="text-white">{"> sz\u00f6veg"}</span></p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
