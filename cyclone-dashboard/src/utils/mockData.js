// Mock data shaped exactly like the real API response will be.
// Swap this for a real fetch in useCycloneData.js once the backend is ready —
// no component code should need to change.

export const mockCyclone = {
  id: 'ARB-2026-03',
  name: 'BIPARJOY-II',
  basin: 'Arabian Sea',
  status: 'active',
  currentPosition: { lat: 15.8, lon: 68.4 },
  windSpeedKmh: 137,
  pressureHpa: 968,
  category: 'VSCS', // matches key in CYCLONE_CATEGORIES
  lastUpdated: '2026-08-25T12:00:00Z',

  // Observed track — where the storm has actually been
  observedTrack: [
    { lat: 11.2, lon: 71.0, timestamp: '2026-08-22T00:00:00Z', windSpeedKmh: 55 },
    { lat: 12.4, lon: 70.5, timestamp: '2026-08-22T12:00:00Z', windSpeedKmh: 65 },
    { lat: 13.5, lon: 69.9, timestamp: '2026-08-23T00:00:00Z', windSpeedKmh: 89 },
    { lat: 14.3, lon: 69.3, timestamp: '2026-08-23T12:00:00Z', windSpeedKmh: 102 },
    { lat: 15.0, lon: 68.8, timestamp: '2026-08-24T00:00:00Z', windSpeedKmh: 118 },
    { lat: 15.5, lon: 68.6, timestamp: '2026-08-24T12:00:00Z', windSpeedKmh: 128 },
    { lat: 15.8, lon: 68.4, timestamp: '2026-08-25T12:00:00Z', windSpeedKmh: 137 },
  ],

  // Predicted track — model forecast with uncertainty cone
  predictedTrack: [
    { lat: 15.8, lon: 68.4, timestamp: '2026-08-25T12:00:00Z', windSpeedKmh: 137, radiusKm: 20 },
    { lat: 16.4, lon: 67.6, timestamp: '2026-08-26T00:00:00Z', windSpeedKmh: 145, radiusKm: 45 },
    { lat: 17.1, lon: 66.7, timestamp: '2026-08-26T12:00:00Z', windSpeedKmh: 150, radiusKm: 75 },
    { lat: 17.9, lon: 65.9, timestamp: '2026-08-27T00:00:00Z', windSpeedKmh: 140, radiusKm: 110 },
    { lat: 18.8, lon: 65.3, timestamp: '2026-08-27T12:00:00Z', windSpeedKmh: 115, radiusKm: 150 },
    { lat: 19.9, lon: 65.0, timestamp: '2026-08-28T00:00:00Z', windSpeedKmh: 85, radiusKm: 190 },
  ],

  landfall: {
    predicted: true,
    location: { lat: 21.5, lon: 69.8 },
    etaTimestamp: '2026-08-29T06:00:00Z',
    region: 'Gujarat coast, near Porbandar',
  },
}

export const mockCycloneList = [mockCyclone]

// Mock alerts — shaped like the real /alerts endpoint response will be
export const mockAlerts = [
  {
    id: 'alert-1',
    severity: 'severe',
    region: 'Gujarat coast, near Porbandar',
    message: 'Landfall expected within 72 hours. Very Severe Cyclonic Storm intensity.',
    issuedAt: '2026-08-25T10:00:00Z',
  },
  {
    id: 'alert-2',
    severity: 'moderate',
    region: 'Maharashtra coast',
    message: 'Rough sea conditions expected. Fishing operations advised to suspend from Aug 27.',
    issuedAt: '2026-08-25T08:30:00Z',
  },
  {
    id: 'alert-3',
    severity: 'watch',
    region: 'Diu, Daman',
    message: 'Cyclone watch issued. Monitor for updates as the system approaches.',
    issuedAt: '2026-08-24T18:00:00Z',
  },
]
