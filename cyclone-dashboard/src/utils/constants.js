// Indian Ocean cyclone classification scale (IMD) with matching storm-scale colors
export const CYCLONE_CATEGORIES = [
  { key: 'D', label: 'Depression', minWind: 31, maxWind: 49, color: '#3FA7A0' },
  { key: 'DD', label: 'Deep Depression', minWind: 50, maxWind: 61, color: '#3FA7A0' },
  { key: 'CS', label: 'Cyclonic Storm', minWind: 62, maxWind: 88, color: '#F2C14E' },
  { key: 'SCS', label: 'Severe Cyclonic Storm', minWind: 89, maxWind: 117, color: '#F2A154' },
  { key: 'VSCS', label: 'Very Severe Cyclonic Storm', minWind: 118, maxWind: 165, color: '#E8543F' },
  { key: 'ESCS', label: 'Extremely Severe Cyclonic Storm', minWind: 166, maxWind: 220, color: '#E8543F' },
  { key: 'SuCS', label: 'Super Cyclonic Storm', minWind: 221, maxWind: 999, color: '#B22C2C' },
]

export function getCategoryForWindSpeed(windKmh) {
  return (
    CYCLONE_CATEGORIES.slice().reverse().find((c) => windKmh >= c.minWind) ??
    CYCLONE_CATEGORIES[0]
  )
}

// Alert severity scale — distinct from storm intensity, since an alert can be
// a low-severity watch even during a high-intensity storm (e.g. open ocean, no landfall risk)
export const ALERT_SEVERITY = {
  watch: { label: 'Watch', color: '#3FA7A0' },
  moderate: { label: 'Moderate', color: '#F2C14E' },
  severe: { label: 'Severe', color: '#E8543F' },
}
