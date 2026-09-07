import { ALERT_SEVERITY } from '../../utils/constants.js'
import { formatTimestamp } from '../../utils/formatters.js'

const SEVERITY_ORDER = ['severe', 'moderate', 'watch']

export default function AlertBanner({ alerts }) {
  if (!alerts?.length) return null

  // Surface the single most urgent alert at the top — a banner listing everything is noise
  const topAlert = alerts
    .slice()
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))[0]

  const severity = ALERT_SEVERITY[topAlert.severity]

  return (
    <div
      className="border-b px-6 py-3"
      style={{ backgroundColor: `${severity.color}1A`, borderColor: `${severity.color}55` }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <span
          className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full"
          style={{ backgroundColor: severity.color }}
        />
        <p className="font-mono text-xs">
          <span className="font-semibold uppercase tracking-wider" style={{ color: severity.color }}>
            {severity.label}
          </span>
          <span className="text-paper"> — {topAlert.region}: {topAlert.message}</span>
        </p>
        <span className="ml-auto flex-shrink-0 font-mono text-[10px] text-slate-500">
          {formatTimestamp(topAlert.issuedAt)}
        </span>
      </div>
    </div>
  )
}
