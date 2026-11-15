export type MiniVariant = 'minimal' | 'creative' | 'professional'

interface Props { variant: MiniVariant; accent?: string }

// CSS-миниатюра портфолио: без внешних изображений.
export function MiniPortfolio({ variant, accent = '#6a45f5' }: Props) {
  const frame = 'aspect-[4/3] w-full overflow-hidden rounded-xl border border-line'
  if (variant === 'minimal') {
    return (
      <div className={`${frame} bg-white p-5`} aria-hidden>
        <div className="h-1.5 w-10 rounded-full" style={{ background: accent }} />
        <div className="mt-4 h-5 w-3/4 rounded bg-ink" />
        <div className="mt-2 h-5 w-1/2 rounded bg-ink" />
        <div className="mt-4 h-2 w-4/5 rounded-full bg-ink/10" />
        <div className="mt-2 h-2 w-3/5 rounded-full bg-ink/10" />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-10 rounded bg-ink/5" />)}
        </div>
      </div>
    )
  }
  if (variant === 'creative') {
    return (
      <div className={`${frame} relative`} style={{ background: accent }} aria-hidden>
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/25" />
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4">
          <div className="h-4 w-2/3 rounded bg-ink" />
          <div className="mt-2 h-2 w-1/2 rounded-full bg-ink/15" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-14 rounded-full" style={{ background: accent }} />
            <div className="h-6 w-14 rounded-full bg-ink/10" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={`${frame} flex bg-white`} aria-hidden>
      <div className="w-1/3 bg-ink p-3">
        <div className="h-8 w-8 rounded-full" style={{ background: accent }} />
        <div className="mt-3 h-2 w-4/5 rounded-full bg-white/60" />
        <div className="mt-2 h-2 w-3/5 rounded-full bg-white/25" />
      </div>
      <div className="flex-1 space-y-2 p-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-line p-2">
            <div className="h-2 w-1/2 rounded-full bg-ink/70" />
            <div className="mt-1.5 h-2 w-4/5 rounded-full bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  )
}
