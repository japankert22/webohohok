"use client"

import { Switch } from "@/components/ui/switch"
import { Play, Square } from "lucide-react"

interface VegrehajtasZonaProps {
  onVegrehajtas: () => void
  onStop: () => void
  vegrehajtas: boolean
  spamBekapcsolva: boolean
  setSpamBekapcsolva: (v: boolean) => void
  spamIntervallum: number
  setSpamIntervallum: (v: number) => void
  spamDarab: number
  setSpamDarab: (v: number) => void
}

export function VegrehajtasZona({
  onVegrehajtas, onStop, vegrehajtas, spamBekapcsolva,
  setSpamBekapcsolva, spamIntervallum, setSpamIntervallum,
  spamDarab, setSpamDarab
}: VegrehajtasZonaProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Végrehajtás Vezérlő</h2>
      
      {/* DINAMIKUS GOMB: Ha nem fut, kék Indítás. Ha fut, piros STOP. */}
      {!vegrehajtas ? (
        <button
          onClick={onVegrehajtas}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground border border-primary/50 transition-all hover:brightness-110 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
        >
          <Play size={16} fill="currentColor" /> Webhook Indítása
        </button>
      ) : (
        <button
          onClick={onStop}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-black uppercase tracking-widest bg-red-600 text-white border border-red-400 animate-pulse hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        >
          <Square size={16} fill="currentColor" /> WEBHOOK LEÁLLÍTÁSA
        </button>
      )}

      <div className="border border-border bg-secondary/50 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="spam-valto" className="text-[10px] uppercase font-bold text-muted-foreground">Spam Beállítások</label>
          <Switch id="spam-valto" checked={spamBekapcsolva} onCheckedChange={setSpamBekapcsolva} />
        </div>

        {spamBekapcsolva && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="space-y-1">
              <label className="text-[9px] uppercase text-zinc-500">Időköz (ms)</label>
              <input type="number" min={1} value={spamIntervallum} onChange={e => setSpamIntervallum(Number(e.target.value))} className="w-full bg-background border border-border px-3 py-2 text-sm font-mono" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase text-zinc-500">Mennyiség</label>
              <input type="number" min={1} value={spamDarab} onChange={e => setSpamDarab(Number(e.target.value))} className="w-full bg-background border border-border px-3 py-2 text-sm font-mono" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
