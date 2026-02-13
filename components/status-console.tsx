"use client"

import { useEffect, useRef, useState } from "react"

export interface NaploBejegyzes {
  type: "RENDSZER" | "INFO" | "HIBA" | "SIKER" | "FIGYELEM"
  message: string
  timestamp: Date
}

const cimkeSzinek: Record<NaploBejegyzes["type"], string> = {
  RENDSZER: "text-muted-foreground",
  INFO: "text-blue-400",
  HIBA: "text-red-400",
  SIKER: "text-green-400",
  FIGYELEM: "text-yellow-400",
}

function idoFormazas(datum: Date): string {
  const o = datum.getHours().toString().padStart(2, "0")
  const p = datum.getMinutes().toString().padStart(2, "0")
  const mp = datum.getSeconds().toString().padStart(2, "0")
  return `${o}:${p}:${mp}`
}

export function AllapotKonzol({ naplok }: { naplok: NaploBejegyzes[] }) {
  const gorgetesRef = useRef<HTMLDivElement>(null)
  const [csatlakozott, setCsatlakozott] = useState(false)

  useEffect(() => {
    setCsatlakozott(true)
  }, [])

  useEffect(() => {
    if (gorgetesRef.current) {
      gorgetesRef.current.scrollTop = gorgetesRef.current.scrollHeight
    }
  }, [naplok])

  return (
    <section aria-label="Állapot Konzol">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
        Állapot Konzol
      </h2>
      <div
        ref={gorgetesRef}
        className="h-36 overflow-y-auto border border-border bg-[#050505] p-3 text-xs leading-relaxed"
        role="log"
        aria-live="polite"
      >
        {naplok.map((naplo, i) => {
          const ido = csatlakozott ? idoFormazas(naplo.timestamp) : "--:--:--"
          return (
            <div key={i} className="whitespace-pre-wrap">
              <span className="text-muted-foreground">{ido}</span>{" "}
              <span className={cimkeSzinek[naplo.type]}>[{naplo.type}]</span>{" "}
              <span className="text-foreground">{naplo.message}</span>
            </div>
          )
        })}
        {naplok.length === 0 && (
          <span className="text-muted-foreground">{">"} Várakozás bemenetre...</span>
        )}
      </div>
    </section>
  )
}
