import { ALERT_SEVERITY } from '../../utils/constants.js'
import { formatTimestamp } from '../../utils/formatters.js'

export default function AlertList({ alerts }) {
  if (!alerts?.length) {
    return <p className="text-sm text-slate-400">No active alerts.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
      {alerts.map((alert) => {
        const severity = ALERT_SEVERITY[alert.severity]
        return (
          <li key={alert.id} className="border-l-2 pl-3" style={{ borderColor: severity.color }}>
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: severity.color }}
              >
                {severity.label}
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {formatTimestamp(alert.issuedAt)}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-paper">{alert.region}</p>
            <p className="mt-0.5 text-xs text-slate-400">{alert.message}</p>
          </li>
        )
      })}
    </ul>
  )
}
