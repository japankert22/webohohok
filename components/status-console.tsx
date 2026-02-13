"use client"

import { useEffect, useRef } from "react"

export interface NaploBejegyzes {
  type: "RENDSZER" | "INFO" | "HIBA" | "SIKERES" | "FIGYELEM"
  message: string
  timestamp: Date
}

const cimkeSzinek: Record<NaploBejegyzes["type"], string> = {
  RENDSZER: "text-zinc-500",
  INFO: "text-blue-400",
  HIBA: "text-red-500 font-bold",
  SIKERES: "text-green-400",
  FIGYELEM: "text-yellow-500",
}

export function AllapotKonzol({ naplok }: { naplok: NaploBejegyzes[] }) {
  const gorgetesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (gorgetesRef.current) {
      gorgetesRef.current.scrollTop = gorgetesRef.current.scrollHeight
    }
  }, [naplok])

  return (
    <section>
      <h2 className="text-xs uppercase tracking-widest text-white font-bold mb-2">Rendszer Napló</h2>
      <div
        ref={gorgetesRef}
        className="h-48 overflow-y-auto border border-zinc-800 bg-black/80 p-4 text-[11px] font-mono leading-relaxed"
      >
        {naplok.map((naplo, i) => {
          const ido = naplo.timestamp.toLocaleTimeString()
          return (
            <div key={i} className="mb-1 flex gap-2 items-start">
              <span className="text-zinc-600 shrink-0">[{ido}]</span>
              <span className={`${cimkeSzinek[naplo.type]} shrink-0 uppercase`}>[{naplo.type}]</span>
              <span className="text-zinc-300">{naplo.message}</span>
            </div>
          )
        })}
        {naplok.length === 0 && <span className="text-zinc-700 italic">{">"} Várakozás bemenetre...</span>}
      </div>
    </section>
  )
}
