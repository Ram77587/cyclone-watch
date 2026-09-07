"""
Indian Coastal Districts Geographic & Vulnerability Reference Dataset
Covers high-vulnerability coastal districts across the Arabian Sea and Bay of Bengal basins.
Used for geospatial proximity alerting, storm surge estimation, and evacuation directives.
"""

COASTAL_DISTRICTS = [
    # --- Arabian Sea (West Coast) ---
    # Gujarat
    {"id": "kutch", "name": "Kutch", "state": "Gujarat", "basin": "Arabian Sea", "lat": 23.242, "lng": 69.666, "coastalZone": "Kutch Coast", "emergencyPhone": "1077"},
    {"id": "dwarka", "name": "Devbhumi Dwarka", "state": "Gujarat", "basin": "Arabian Sea", "lat": 22.244, "lng": 68.968, "coastalZone": "Saurashtra Coast", "emergencyPhone": "1077"},
    {"id": "porbandar", "name": "Porbandar", "state": "Gujarat", "basin": "Arabian Sea", "lat": 21.642, "lng": 69.629, "coastalZone": "Saurashtra Coast", "emergencyPhone": "1077"},
    {"id": "jamnagar", "name": "Jamnagar", "state": "Gujarat", "basin": "Arabian Sea", "lat": 22.470, "lng": 70.057, "coastalZone": "Saurashtra Coast", "emergencyPhone": "1077"},
    {"id": "junagadh", "name": "Junagadh", "state": "Gujarat", "basin": "Arabian Sea", "lat": 21.522, "lng": 70.457, "coastalZone": "Saurashtra Coast", "emergencyPhone": "1077"},
    {"id": "gir_somnath", "name": "Gir Somnath", "state": "Gujarat", "basin": "Arabian Sea", "lat": 20.904, "lng": 70.367, "coastalZone": "Saurashtra Coast", "emergencyPhone": "1077"},
    {"id": "amreli", "name": "Amreli", "state": "Gujarat", "basin": "Arabian Sea", "lat": 21.603, "lng": 71.222, "coastalZone": "Saurashtra Coast", "emergencyPhone": "1077"},
    {"id": "bhavnagar", "name": "Bhavnagar", "state": "Gujarat", "basin": "Arabian Sea", "lat": 21.764, "lng": 72.151, "coastalZone": "Gulf of Khambhat", "emergencyPhone": "1077"},
    {"id": "morbi", "name": "Morbi", "state": "Gujarat", "basin": "Arabian Sea", "lat": 22.817, "lng": 70.837, "coastalZone": "Saurashtra Coast", "emergencyPhone": "1077"},
    {"id": "surat", "name": "Surat Coast", "state": "Gujarat", "basin": "Arabian Sea", "lat": 21.170, "lng": 72.831, "coastalZone": "South Gujarat Coast", "emergencyPhone": "1077"},
    {"id": "valsad", "name": "Valsad", "state": "Gujarat", "basin": "Arabian Sea", "lat": 20.599, "lng": 72.934, "coastalZone": "South Gujarat Coast", "emergencyPhone": "1077"},

    # Maharashtra
    {"id": "mumbai", "name": "Mumbai Metropolitan", "state": "Maharashtra", "basin": "Arabian Sea", "lat": 18.922, "lng": 72.834, "coastalZone": "Konkan Coast", "emergencyPhone": "1916"},
    {"id": "palghar", "name": "Palghar", "state": "Maharashtra", "basin": "Arabian Sea", "lat": 19.696, "lng": 72.765, "coastalZone": "Konkan Coast", "emergencyPhone": "1077"},
    {"id": "raigad", "name": "Raigad (Alibag)", "state": "Maharashtra", "basin": "Arabian Sea", "lat": 18.515, "lng": 73.181, "coastalZone": "Konkan Coast", "emergencyPhone": "1077"},
    {"id": "ratnagiri", "name": "Ratnagiri", "state": "Maharashtra", "basin": "Arabian Sea", "lat": 16.990, "lng": 73.312, "coastalZone": "Konkan Coast", "emergencyPhone": "1077"},
    {"id": "sindhudurg", "name": "Sindhudurg", "state": "Maharashtra", "basin": "Arabian Sea", "lat": 16.117, "lng": 73.693, "coastalZone": "Konkan Coast", "emergencyPhone": "1077"},

    # Goa & Karnataka
    {"id": "north_goa", "name": "North Goa (Panaji)", "state": "Goa", "basin": "Arabian Sea", "lat": 15.490, "lng": 73.827, "coastalZone": "Goa Coast", "emergencyPhone": "1070"},
    {"id": "south_goa", "name": "South Goa (Margao)", "state": "Goa", "basin": "Arabian Sea", "lat": 15.283, "lng": 73.986, "coastalZone": "Goa Coast", "emergencyPhone": "1070"},
    {"id": "uttara_kannada", "name": "Uttara Kannada (Karwar)", "state": "Karnataka", "basin": "Arabian Sea", "lat": 14.818, "lng": 74.130, "coastalZone": "Karavali Coast", "emergencyPhone": "1077"},
    {"id": "udupi", "name": "Udupi", "state": "Karnataka", "basin": "Arabian Sea", "lat": 13.340, "lng": 74.742, "coastalZone": "Karavali Coast", "emergencyPhone": "1077"},
    {"id": "dakshina_kannada", "name": "Dakshina Kannada (Mangaluru)", "state": "Karnataka", "basin": "Arabian Sea", "lat": 12.914, "lng": 74.856, "coastalZone": "Karavali Coast", "emergencyPhone": "1077"},

    # Kerala
    {"id": "kozhikode", "name": "Kozhikode", "state": "Kerala", "basin": "Arabian Sea", "lat": 11.258, "lng": 75.780, "coastalZone": "Malabar Coast", "emergencyPhone": "1077"},
    {"id": "ernakulam", "name": "Ernakulam (Kochi)", "state": "Kerala", "basin": "Arabian Sea", "lat": 9.931, "lng": 76.267, "coastalZone": "Malabar Coast", "emergencyPhone": "1077"},
    {"id": "thiruvananthapuram", "name": "Thiruvananthapuram", "state": "Kerala", "basin": "Arabian Sea", "lat": 8.524, "lng": 76.936, "coastalZone": "Travancore Coast", "emergencyPhone": "1077"},

    # --- Bay of Bengal (East Coast) ---
    # West Bengal
    {"id": "south_24_parganas", "name": "South 24 Parganas (Sundarbans)", "state": "West Bengal", "basin": "Bay of Bengal", "lat": 21.850, "lng": 88.400, "coastalZone": "Ganga Delta / Sundarbans", "emergencyPhone": "1077"},
    {"id": "east_medinipur", "name": "East Medinipur (Digha)", "state": "West Bengal", "basin": "Bay of Bengal", "lat": 21.626, "lng": 87.507, "coastalZone": "Digha Coast", "emergencyPhone": "1077"},
    {"id": "kolkata", "name": "Kolkata Urban", "state": "West Bengal", "basin": "Bay of Bengal", "lat": 22.572, "lng": 88.363, "coastalZone": "Lower Gangetic Plain", "emergencyPhone": "1070"},
    {"id": "north_24_parganas", "name": "North 24 Parganas", "state": "West Bengal", "basin": "Bay of Bengal", "lat": 22.721, "lng": 88.483, "coastalZone": "Ganga Delta", "emergencyPhone": "1077"},

    # Odisha
    {"id": "balasore", "name": "Balasore", "state": "Odisha", "basin": "Bay of Bengal", "lat": 21.493, "lng": 86.913, "coastalZone": "North Odisha Coast", "emergencyPhone": "1077"},
    {"id": "bhadrak", "name": "Bhadrak", "state": "Odisha", "basin": "Bay of Bengal", "lat": 21.057, "lng": 86.496, "coastalZone": "Dhamra Coast", "emergencyPhone": "1077"},
    {"id": "kendrapara", "name": "Kendrapara", "state": "Odisha", "basin": "Bay of Bengal", "lat": 20.503, "lng": 86.422, "coastalZone": "Bhitarkanika Coast", "emergencyPhone": "1077"},
    {"id": "jagatsinghpur", "name": "Jagatsinghpur (Paradip)", "state": "Odisha", "basin": "Bay of Bengal", "lat": 20.258, "lng": 86.172, "coastalZone": "Central Odisha Coast", "emergencyPhone": "1077"},
    {"id": "puri", "name": "Puri", "state": "Odisha", "basin": "Bay of Bengal", "lat": 19.813, "lng": 85.831, "coastalZone": "Chilika Coast", "emergencyPhone": "1077"},
    {"id": "ganjam", "name": "Ganjam (Gopalpur)", "state": "Odisha", "basin": "Bay of Bengal", "lat": 19.380, "lng": 85.067, "coastalZone": "South Odisha Coast", "emergencyPhone": "1077"},

    # Andhra Pradesh
    {"id": "srikakulam", "name": "Srikakulam", "state": "Andhra Pradesh", "basin": "Bay of Bengal", "lat": 18.296, "lng": 83.896, "coastalZone": "North Andhra Coast", "emergencyPhone": "1077"},
    {"id": "visakhapatnam", "name": "Visakhapatnam", "state": "Andhra Pradesh", "basin": "Bay of Bengal", "lat": 17.686, "lng": 83.218, "coastalZone": "Vizag Coastal Corridor", "emergencyPhone": "1077"},
    {"id": "kakinada", "name": "Kakinada", "state": "Andhra Pradesh", "basin": "Bay of Bengal", "lat": 16.989, "lng": 82.247, "coastalZone": "Godavari Delta", "emergencyPhone": "1077"},
    {"id": "krishna", "name": "Krishna (Machilipatnam)", "state": "Andhra Pradesh", "basin": "Bay of Bengal", "lat": 16.187, "lng": 81.138, "coastalZone": "Krishna Delta", "emergencyPhone": "1077"},
    {"id": "bapatla", "name": "Bapatla", "state": "Andhra Pradesh", "basin": "Bay of Bengal", "lat": 15.904, "lng": 80.467, "coastalZone": "Central AP Coast", "emergencyPhone": "1077"},
    {"id": "prakasam", "name": "Prakasam (Ongole)", "state": "Andhra Pradesh", "basin": "Bay of Bengal", "lat": 15.503, "lng": 80.044, "coastalZone": "South AP Coast", "emergencyPhone": "1077"},
    {"id": "nellore", "name": "SPSR Nellore", "state": "Andhra Pradesh", "basin": "Bay of Bengal", "lat": 14.442, "lng": 79.986, "coastalZone": "Pulicat Coast", "emergencyPhone": "1077"},

    # Tamil Nadu
    {"id": "chennai", "name": "Chennai Metropolitan", "state": "Tamil Nadu", "basin": "Bay of Bengal", "lat": 13.082, "lng": 80.270, "coastalZone": "Coromandel Coast", "emergencyPhone": "1913"},
    {"id": "kancheepuram", "name": "Kancheepuram / Chengalpattu", "state": "Tamil Nadu", "basin": "Bay of Bengal", "lat": 12.834, "lng": 79.703, "coastalZone": "Coromandel Coast", "emergencyPhone": "1077"},
    {"id": "cuddalore", "name": "Cuddalore", "state": "Tamil Nadu", "basin": "Bay of Bengal", "lat": 11.748, "lng": 79.771, "coastalZone": "Coromandel Coast", "emergencyPhone": "1077"},
    {"id": "nagapattinam", "name": "Nagapattinam", "state": "Tamil Nadu", "basin": "Bay of Bengal", "lat": 10.767, "lng": 79.842, "coastalZone": "Cauvery Delta Coast", "emergencyPhone": "1077"},
    {"id": "ramanathapuram", "name": "Ramanathapuram (Rameswaram)", "state": "Tamil Nadu", "basin": "Bay of Bengal", "lat": 9.363, "lng": 78.839, "coastalZone": "Palk Strait Coast", "emergencyPhone": "1077"}
]
