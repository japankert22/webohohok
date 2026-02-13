"use client"

import { Switch } from "@/components/ui/switch"

interface VegrehajtasZonaProps {
  onVegrehajtas: () => void
  vegrehajtas: boolean
  spamBekapcsolva: boolean
  onStop: () => void
  setSpamBekapcsolva: (v: boolean) => void
  spamIntervallum: number
  setSpamIntervallum: (v: number) => void
  spamDarab: number
  setSpamDarab: (v: number) => void
}

export function VegrehajtasZona({
  onVegrehajtas,
  vegrehajtas,
  spamBekapcsolva,
  setSpamBekapcsolva,
  spamIntervallum,
  setSpamIntervallum,
  spamDarab,
  setSpamDarab,
}: VegrehajtasZonaProps) {
  return (
    <section aria-label="Végrehajtás Zóna">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
        Végrehajtás Zóna
      </h2>
      <div className="space-y-3">
        <button
          onClick={onVegrehajtas}
          disabled={vegrehajtas}
          className="w-full relative py-3 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground border border-primary/50 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]"
        >
        {vegrehajtas ? (
          <button onClick={onVegrehajtas} className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase">
            Webhook Indítása
          </button>
        ) : (
          <button onClick={onStop} className="w-full py-4 bg-red-600 text-white font-black uppercase animate-pulse">
            WEBHOOK LEÁLLÍTÁSA
          </button>
        )}
        </button>

        <div className="border border-border bg-secondary p-3 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="spam-valto" className="text-xs text-muted-foreground cursor-pointer">
              Spam Beállítások
            </label>
            <Switch
              id="spam-valto"
              checked={spamBekapcsolva}
              onCheckedChange={setSpamBekapcsolva}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {spamBekapcsolva && (
            <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="spam-intervallum" className="block text-xs text-muted-foreground mb-1">
                    Időköz (ms)
                  </label>
                  <input
                    id="spam-intervallum"
                    type="number"
                    min={1}
                    value={spamIntervallum}
                    onChange={(e) => {
                      const ertek = Number(e.target.value)
                      setSpamIntervallum(ertek < 1 ? 1 : ertek)
                    }}
                    className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="spam-darab" className="block text-xs text-muted-foreground mb-1">
                    Üzenetek Száma
                  </label>
                  <input
                    id="spam-darab"
                    type="number"
                    min={1}
                    value={spamDarab}
                    onChange={(e) => {
                      const ertek = Number(e.target.value)
                      setSpamDarab(ertek < 1 ? 1 : ertek)
                    }}
                    className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  />
                </div>
              </div>

              {/* Ajánlások */}
              <div className="border border-border/50 bg-background/50 px-3 py-2 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-yellow-400/80 font-bold">Ajánlott beállítások</p>
                <ul className="text-[10px] text-muted-foreground space-y-0.5 list-none">
                  <li>{'>'} Ajánlott időköz: 1000-5000ms (Discord limit: ~5 üzenet/5mp)</li>
                  <li>{'>'} Ajánlott darabszám: 10-20 db egymás után</li>
                  <li>{'>'} Túl gyors küldés = webhook törlése a Discord által</li>
                  <li>{'>'} Rate limit esetén az állapot konzol figyelmeztet</li>
                  <li>{'>'} Nincs korlátozás, de a konzol kiírja a kockázatot</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
