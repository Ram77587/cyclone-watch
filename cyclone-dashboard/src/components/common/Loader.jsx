export default function Loader({ label = 'Loading data…' }) {
  return (
    <div className="flex items-center gap-3 py-8 justify-center">
      <span className="h-3 w-3 animate-pulse rounded-full bg-signal" />
      <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  )
}
