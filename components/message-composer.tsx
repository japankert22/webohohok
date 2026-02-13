"use client"

import { Switch } from "@/components/ui/switch"

interface UzenetSzerkesztoProps {
  tartalom: string
  setTartalom: (v: string) => void
  embedHasznalata: boolean
  setEmbedHasznalata: (v: boolean) => void
  embedSzin: string
  setEmbedSzin: (v: string) => void
  lablecSzoveg: string
  setLablecSzoveg: (v: string) => void
  fejlecSzoveg: string      // ÚJ
  setFejlecSzoveg: (v: string) => void
  egyediIdopont: string     // ÚJ
  setEgyediIdopont: (v: string) => void
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
  fejlecSzoveg,         // ÚJ
  setFejlecSzoveg,      // ÚJ
  egyediIdopont,        // ÚJ
  setEgyediIdopont,     // ÚJ
}: UzenetSzerkesztoProps) {
  return (
    <section aria-label="Üzenet Szerkesztő">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
        Üzenet Szerkesztő
      </h2>
      <div className="space-y-3">
        
        <div>
          <label htmlFor="uzenet-tartalom" className="sr-only">Üzenet Tartalom</label>
          <textarea
            id="uzenet-tartalom"
            rows={5}
            placeholder="Írd be az üzenet tartalmát..."
            value={tartalom}
            onChange={(e) => setTartalom(e.target.value)}
            className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between border border-border bg-secondary px-3 py-2.5">
          <label htmlFor="embed-valto" className="text-xs text-muted-foreground cursor-pointer">
            Embed Stílus Használata
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
                Fejléc Szöveg (Cím)
              </label>
              <input
                type="text"
                placeholder="Embed címe..."
                value={fejlecSzoveg}
                onChange={(e) => setFejlecSzoveg(e.target.value)}
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="embed-szin" className="block text-xs text-muted-foreground mb-1 uppercase tracking-tighter">
                  Embed Szín
                </label>
                <div className="flex items-center gap-2 bg-secondary border border-border px-3 py-2">
                  <input
                    type="color"
                    value={embedSzin}
                    onChange={(e) => setEmbedSzin(e.target.value)}
                    className="w-6 h-6 border-0 bg-transparent cursor-pointer p-0"
                    aria-label="Embed szín választó"
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
                  Lábléc Szöveg
                </label>
                <input
                  id="lablec-szoveg"
                  type="text"
                  placeholder="Opcionális lábléc..."
                  value={lablecSzoveg}
                  onChange={(e) => setLablecSzoveg(e.target.value)}
                  className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1 uppercase tracking-tighter">
                Egyedi Időpont (Timestamp)
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
      </div>
    </section>
  )
}
