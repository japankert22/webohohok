"use client"

interface WebhookBeallitasokProps {
  webhookUrl: string
  setWebhookUrl: (v: string) => void
  megpitoNev: string
  setMegpitoNev: (v: string) => void
  avatarUrl: string
  setAvatarUrl: (v: string) => void
}

export function WebhookBeallitasok({
  webhookUrl,
  setWebhookUrl,
  megpitoNev,
  setMegpitoNev,
  avatarUrl,
  setAvatarUrl,
}: WebhookBeallitasokProps) {
  return (
    <section aria-label="Webhook Beállítások">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
        Webhook Beállítások
      </h2>
      <div className="space-y-3">
        <div>
          <label htmlFor="webhook-url" className="sr-only">
            Webhook URL
          </label>
          <input
            id="webhook-url"
            type="url"
            placeholder="https://discord.com/api/webhooks/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full bg-secondary border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="megjelenitesi-nev" className="block text-xs text-muted-foreground mb-1">
              Megjelenítési Név
            </label>
            <input
              id="megjelenitesi-nev"
              type="text"
              placeholder="Bot Neve"
              value={megpitoNev}
              onChange={(e) => setMegpitoNev(e.target.value)}
              className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            />
          </div>
          <div>
            <label htmlFor="avatar-url" className="block text-xs text-muted-foreground mb-1">
              Profilkép URL
            </label>
            <input
              id="avatar-url"
              type="url"
              placeholder="https://i.imgur.com/..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
