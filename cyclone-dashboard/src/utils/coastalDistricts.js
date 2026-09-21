// src/utils/coastalDistricts.js
/**
 * Indian Coastal Districts Geographic & Vulnerability Reference Dataset
 * Covers high-vulnerability coastal districts across the Arabian Sea and Bay of Bengal basins.
 */

export const COASTAL_DISTRICTS = [
  // Arabian Sea (West Coast) - Gujarat
  { id: "kutch", name: "Kutch", state: "Gujarat", basin: "Arabian Sea", lat: 23.242, lng: 69.666, coastalZone: "Kutch Coast", emergencyPhone: "1077" },
  { id: "dwarka", name: "Devbhumi Dwarka", state: "Gujarat", basin: "Arabian Sea", lat: 22.244, lng: 68.968, coastalZone: "Saurashtra Coast", emergencyPhone: "1077" },
  { id: "porbandar", name: "Porbandar", state: "Gujarat", basin: "Arabian Sea", lat: 21.642, lng: 69.629, coastalZone: "Saurashtra Coast", emergencyPhone: "1077" },
  { id: "jamnagar", name: "Jamnagar", state: "Gujarat", basin: "Arabian Sea", lat: 22.470, lng: 70.057, coastalZone: "Saurashtra Coast", emergencyPhone: "1077" },
  { id: "junagadh", name: "Junagadh", state: "Gujarat", basin: "Arabian Sea", lat: 21.522, lng: 70.457, coastalZone: "Saurashtra Coast", emergencyPhone: "1077" },
  { id: "gir_somnath", name: "Gir Somnath", state: "Gujarat", basin: "Arabian Sea", lat: 20.904, lng: 70.367, coastalZone: "Saurashtra Coast", emergencyPhone: "1077" },
  { id: "amreli", name: "Amreli", state: "Gujarat", basin: "Arabian Sea", lat: 21.603, lng: 71.222, coastalZone: "Saurashtra Coast", emergencyPhone: "1077" },
  { id: "bhavnagar", name: "Bhavnagar", state: "Gujarat", basin: "Arabian Sea", lat: 21.764, lng: 72.151, coastalZone: "Gulf of Khambhat", emergencyPhone: "1077" },
  { id: "morbi", name: "Morbi", state: "Gujarat", basin: "Arabian Sea", lat: 22.817, lng: 70.837, coastalZone: "Saurashtra Coast", emergencyPhone: "1077" },
  { id: "surat", name: "Surat Coast", state: "Gujarat", basin: "Arabian Sea", lat: 21.170, lng: 72.831, coastalZone: "South Gujarat Coast", emergencyPhone: "1077" },
  { id: "valsad", name: "Valsad", state: "Gujarat", basin: "Arabian Sea", lat: 20.599, lng: 72.934, coastalZone: "South Gujarat Coast", emergencyPhone: "1077" },

  // Maharashtra
  { id: "mumbai", name: "Mumbai Metropolitan", state: "Maharashtra", basin: "Arabian Sea", lat: 18.922, lng: 72.834, coastalZone: "Konkan Coast", emergencyPhone: "1916" },
  { id: "palghar", name: "Palghar", state: "Maharashtra", basin: "Arabian Sea", lat: 19.696, lng: 72.765, coastalZone: "Konkan Coast", emergencyPhone: "1077" },
  { id: "raigad", name: "Raigad (Alibag)", state: "Maharashtra", basin: "Arabian Sea", lat: 18.515, lng: 73.181, coastalZone: "Konkan Coast", emergencyPhone: "1077" },
  { id: "ratnagiri", name: "Ratnagiri", state: "Maharashtra", basin: "Arabian Sea", lat: 16.990, lng: 73.312, coastalZone: "Konkan Coast", emergencyPhone: "1077" },
  { id: "sindhudurg", name: "Sindhudurg", state: "Maharashtra", basin: "Arabian Sea", lat: 16.117, lng: 73.693, coastalZone: "Konkan Coast", emergencyPhone: "1077" },

  // Goa & Karnataka
  { id: "north_goa", name: "North Goa (Panaji)", state: "Goa", basin: "Arabian Sea", lat: 15.490, lng: 73.827, coastalZone: "Goa Coast", emergencyPhone: "1070" },
  { id: "south_goa", name: "South Goa (Margao)", state: "Goa", basin: "Arabian Sea", lat: 15.283, lng: 73.986, coastalZone: "Goa Coast", emergencyPhone: "1070" },
  { id: "uttara_kannada", name: "Uttara Kannada (Karwar)", state: "Karnataka", basin: "Arabian Sea", lat: 14.818, lng: 74.130, coastalZone: "Karavali Coast", emergencyPhone: "1077" },
  { id: "udupi", name: "Udupi", state: "Karnataka", basin: "Arabian Sea", lat: 13.340, lng: 74.742, coastalZone: "Karavali Coast", emergencyPhone: "1077" },
  { id: "dakshina_kannada", name: "Dakshina Kannada (Mangaluru)", state: "Karnataka", basin: "Arabian Sea", lat: 12.914, lng: 74.856, coastalZone: "Karavali Coast", emergencyPhone: "1077" },

  // Kerala
  { id: "kozhikode", name: "Kozhikode", state: "Kerala", basin: "Arabian Sea", lat: 11.258, lng: 75.780, coastalZone: "Malabar Coast", emergencyPhone: "1077" },
  { id: "ernakulam", name: "Ernakulam (Kochi)", state: "Kerala", basin: "Arabian Sea", lat: 9.931, lng: 76.267, coastalZone: "Malabar Coast", emergencyPhone: "1077" },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", basin: "Arabian Sea", lat: 8.524, lng: 76.936, coastalZone: "Travancore Coast", emergencyPhone: "1077" },

  // Bay of Bengal (East Coast) - West Bengal
  { id: "south_24_parganas", name: "South 24 Parganas (Sundarbans)", state: "West Bengal", basin: "Bay of Bengal", lat: 21.850, lng: 88.400, coastalZone: "Ganga Delta / Sundarbans", emergencyPhone: "1077" },
  { id: "east_medinipur", name: "East Medinipur (Digha)", state: "West Bengal", basin: "Bay of Bengal", lat: 21.626, lng: 87.507, coastalZone: "Digha Coast", emergencyPhone: "1077" },
  { id: "kolkata", name: "Kolkata Urban", state: "West Bengal", basin: "Bay of Bengal", lat: 22.572, lng: 88.363, coastalZone: "Lower Gangetic Plain", emergencyPhone: "1070" },
  { id: "north_24_parganas", name: "North 24 Parganas", state: "West Bengal", basin: "Bay of Bengal", lat: 22.721, lng: 88.483, coastalZone: "Ganga Delta", emergencyPhone: "1077" },

  // Odisha
  { id: "balasore", name: "Balasore", state: "Odisha", basin: "Bay of Bengal", lat: 21.493, lng: 86.913, coastalZone: "North Odisha Coast", emergencyPhone: "1077" },
  { id: "bhadrak", name: "Bhadrak", state: "Odisha", basin: "Bay of Bengal", lat: 21.057, lng: 86.496, coastalZone: "Dhamra Coast", emergencyPhone: "1077" },
  { id: "kendrapara", name: "Kendrapara", state: "Odisha", basin: "Bay of Bengal", lat: 20.503, lng: 86.422, coastalZone: "Bhitarkanika Coast", emergencyPhone: "1077" },
  { id: "jagatsinghpur", name: "Jagatsinghpur (Paradip)", state: "Odisha", basin: "Bay of Bengal", lat: 20.258, lng: 86.172, coastalZone: "Central Odisha Coast", emergencyPhone: "1077" },
  { id: "puri", name: "Puri", state: "Odisha", basin: "Bay of Bengal", lat: 19.813, lng: 85.831, coastalZone: "Chilika Coast", emergencyPhone: "1077" },
  { id: "ganjam", name: "Ganjam (Gopalpur)", state: "Odisha", basin: "Bay of Bengal", lat: 19.380, lng: 85.067, coastalZone: "South Odisha Coast", emergencyPhone: "1077" },

  // Andhra Pradesh
  { id: "srikakulam", name: "Srikakulam", state: "Andhra Pradesh", basin: "Bay of Bengal", lat: 18.296, lng: 83.896, coastalZone: "North Andhra Coast", emergencyPhone: "1077" },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", basin: "Bay of Bengal", lat: 17.686, lng: 83.218, coastalZone: "Vizag Coastal Corridor", emergencyPhone: "1077" },
  { id: "kakinada", name: "Kakinada", state: "Andhra Pradesh", basin: "Bay of Bengal", lat: 16.989, lng: 82.247, coastalZone: "Godavari Delta", emergencyPhone: "1077" },
  { id: "krishna", name: "Krishna (Machilipatnam)", state: "Andhra Pradesh", basin: "Bay of Bengal", lat: 16.187, lng: 81.138, coastalZone: "Krishna Delta", emergencyPhone: "1077" },
  { id: "bapatla", name: "Bapatla", state: "Andhra Pradesh", basin: "Bay of Bengal", lat: 15.904, lng: 80.467, coastalZone: "Central AP Coast", emergencyPhone: "1077" },
  { id: "prakasam", name: "Prakasam (Ongole)", state: "Andhra Pradesh", basin: "Bay of Bengal", lat: 15.503, lng: 80.044, coastalZone: "South AP Coast", emergencyPhone: "1077" },
  { id: "nellore", name: "SPSR Nellore", state: "Andhra Pradesh", basin: "Bay of Bengal", lat: 14.442, lng: 79.986, coastalZone: "Pulicat Coast", emergencyPhone: "1077" },

  // Tamil Nadu
  { id: "chennai", name: "Chennai Metropolitan", state: "Tamil Nadu", basin: "Bay of Bengal", lat: 13.082, lng: 80.270, coastalZone: "Coromandel Coast", emergencyPhone: "1913" },
  { id: "kancheepuram", name: "Kancheepuram / Chengalpattu", state: "Tamil Nadu", basin: "Bay of Bengal", lat: 12.834, lng: 79.703, coastalZone: "Coromandel Coast", emergencyPhone: "1077" },
  { id: "cuddalore", name: "Cuddalore", state: "Tamil Nadu", basin: "Bay of Bengal", lat: 11.748, lng: 79.771, coastalZone: "Coromandel Coast", emergencyPhone: "1077" },
  { id: "nagapattinam", name: "Nagapattinam", state: "Tamil Nadu", basin: "Bay of Bengal", lat: 10.767, lng: 79.842, coastalZone: "Cauvery Delta Coast", emergencyPhone: "1077" },
  { id: "ramanathapuram", name: "Ramanathapuram (Rameswaram)", state: "Tamil Nadu", basin: "Bay of Bengal", lat: 9.363, lng: 78.839, coastalZone: "Palk Strait Coast", emergencyPhone: "1077" }
];

/**
 * Great-circle distance between two decimal coordinates in kilometers (Haversine formula).
 */
export function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371.0; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Determine hazard tier & operational directives from distance to storm center.
 */
export function classifyHazard(distKm) {
  if (distKm <= 100) {
    return {
      tier: "RED",
      label: "Red Alert (Imminent Strike Zone)",
      severity: "high",
      colorHex: "#dc2626",
      bgClass: "bg-rose-50 dark:bg-rose-950/40 border-rose-500",
      windRisk: "Gale force winds 110-145 km/h expected. Severe structural risk.",
      surgeRisk: "Coastal inundation 2.0-3.5m above astronomical tide.",
      directives: [
        "Immediate total evacuation of coastal habitations within 5km of shoreline.",
        "Suspend all fishing, maritime, and commercial port operations.",
        "Deploy NDRF and SDRF battalions to pre-designated shelter points.",
        "Keep emergency power backups and satellite communication links active."
      ],
      smsBroadcast: "EMERGENCY: Cyclone landfall imminent within your sector. Evacuate immediately to nearest designated shelter. Follow local disaster authority directives."
    };
  } else if (distKm <= 250) {
    return {
      tier: "ORANGE",
      label: "Orange Alert (High Preparedness)",
      severity: "high",
      colorHex: "#ea580c",
      bgClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-500",
      windRisk: "Squally to strong winds 75-100 km/h. Minor roof/tree damage.",
      surgeRisk: "Moderate sea surge 1.0-1.8m in low lying coastal stretches.",
      directives: [
        "Complete evacuation of vulnerable kutchha structures and thatch houses.",
        "Relocate livestock and equipment to elevated cyclone shelters.",
        "Fishermen advised not to venture into deep sea or coastal waters.",
        "Standby emergency medical teams and food ration stockpiles."
      ],
      smsBroadcast: "ALERT: Cyclone approaching within 250km. Secure loose structures, stockpile drinking water and food. Dial 1077 for emergency assistance."
    };
  } else if (distKm <= 450) {
    return {
      tier: "YELLOW",
      label: "Yellow Watch (Advisory)",
      severity: "moderate",
      colorHex: "#ca8a04",
      bgClass: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500",
      windRisk: "Breezy conditions 45-65 km/h. Intermittent heavy rainfall bands.",
      surgeRisk: "Elevated waves 0.5-1.0m. Rough to very rough sea conditions.",
      directives: [
        "Maintain heightened vigilance across district disaster management cells.",
        "Monitor IMD/MOSDAC telemetry updates every 3 hours.",
        "Inspect and clear storm drainage channels and road culverts."
      ],
      smsBroadcast: "ADVISORY: Cyclone circulation detected in maritime quadrant. Avoid coastal travel. Stay tuned to official weather advisories."
    };
  } else {
    return {
      tier: "GREEN",
      label: "Green (Normal Watch)",
      severity: "low",
      colorHex: "#16a34a",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500",
      windRisk: "Normal coastal breeze (<40 km/h).",
      surgeRisk: "Normal astronomical tides.",
      directives: [
        "No immediate operational warning.",
        "Continue routine meteorological monitoring and standard readiness."
      ],
      smsBroadcast: "NOTICE: Standard meteorological monitoring active. No cyclone threat currently identified for this location."
    };
  }
}
