/* RoomMate - Property Sample & MySQL Synced Data */

const API_HOST = window.location.port === '5000' ? '' : 'http://localhost:5000';

let PROPERTIES_DATA = [
  {
    id: 1,
    title: "Campus Nest PG",
    location: "Vashi, Navi Mumbai",
    area: "Vashi",
    city: "Navi Mumbai",
    rent: 8500,
    type: "PG",
    gender: "Any",
    available: true,
    rating: 4.8,
    reviewsCount: 34,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "Food", "Laundry", "CCTV", "Power Backup"],
    description: "Comfortable, fully furnished student accommodation located close to Vashi station, top colleges, and everyday essentials. Includes 3 fresh meals daily, high-speed Wi-Fi, and weekly housekeeping.",
    houseRules: ["No loud noise after 10 PM", "Visitors allowed till 8 PM", "Smoking strictly prohibited", "Maintain cleanliness"],
    colleges: [
      { name: "Fr. C. Rodrigues Institute of Technology", distance: "0.8 km" },
      { name: "SIES College of Arts & Commerce", distance: "1.5 km" },
      { name: "Vashi Railway Station", distance: "0.5 km" }
    ],
    owner: {
      name: "Rajesh Sharma",
      phone: "+91 98201 45678",
      email: "rajesh.vashi@roommate.in",
      verified: true,
      responseTime: "Responds within 15 mins",
      memberSince: "2023"
    }
  },
  {
    id: 2,
    title: "Student Square",
    location: "Thane West, Thane",
    area: "Thane West",
    city: "Thane",
    rent: 7500,
    type: "Shared Room",
    gender: "Male",
    available: true,
    rating: 4.6,
    reviewsCount: 28,
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: ["Wi-Fi", "Food", "Laundry", "Parking", "CCTV"],
    description: "Spacious twin-sharing rooms tailored for male college students. Clean study tables, ergonomic chairs, power backup, and attached clean washrooms.",
    houseRules: ["Gate closes at 10:30 PM", "Clean up after cooking", "No alcohol on premises"],
    colleges: [
      { name: "K.J. Somaiya Engineering College", distance: "2.1 km" },
      { name: "Thane College of Commerce", distance: "1.0 km" }
    ],
    owner: {
      name: "Amit Patil",
      phone: "+91 97690 12345",
      email: "amit.patil@roommate.in",
      verified: true,
      responseTime: "Responds within 30 mins",
      memberSince: "2024"
    }
  },
  {
    id: 3,
    title: "Green View Residence",
    location: "Powai, Mumbai",
    area: "Powai",
    city: "Mumbai",
    rent: 11000,
    type: "Private Room",
    gender: "Any",
    available: true,
    rating: 4.9,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "Food", "Laundry", "Parking", "CCTV", "Power Backup"],
    description: "Premium private room accommodation right next to IIT Bombay & Hiranandani Powai. Scenic lake views, quiet environment, high-speed fiber internet, and gym access.",
    houseRules: ["Self-service laundry slots", "Maintain quiet hours after 11 PM"],
    colleges: [
      { name: "IIT Bombay", distance: "0.6 km" },
      { name: "NITIIE Powai", distance: "1.8 km" }
    ],
    owner: {
      name: "Sunita Kulkarni",
      phone: "+91 98199 87654",
      email: "sunita.powai@roommate.in",
      verified: true,
      responseTime: "Responds within 10 mins",
      memberSince: "2022"
    }
  },
  {
    id: 4,
    title: "Urban Stay",
    location: "Andheri East, Mumbai",
    area: "Andheri East",
    city: "Mumbai",
    rent: 9500,
    type: "PG",
    gender: "Female",
    available: true,
    rating: 4.7,
    reviewsCount: 19,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "Food", "Laundry", "CCTV", "Power Backup"],
    description: "Safe and hygienic girls PG near Andheri metro station. 24/7 female security guard, biometric entry, biometric locks, and nutritious home-cooked meals.",
    houseRules: ["Biometric entry only", "No male guests in rooms", "Night entry curfew 10:00 PM"],
    colleges: [
      { name: "Tolani College of Commerce", distance: "1.2 km" },
      { name: "SPIT & SP Jain Institute", distance: "2.4 km" }
    ],
    owner: {
      name: "Meena Iyer",
      phone: "+91 99300 54321",
      email: "meena.urbanstay@roommate.in",
      verified: true,
      responseTime: "Responds within 20 mins",
      memberSince: "2023"
    }
  },
  {
    id: 5,
    title: "Navi Homes",
    location: "Nerul, Navi Mumbai",
    area: "Nerul",
    city: "Navi Mumbai",
    rent: 7000,
    type: "Hostel",
    gender: "Male",
    available: true,
    rating: 4.5,
    reviewsCount: 15,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: ["Wi-Fi", "Food", "Laundry", "CCTV", "Power Backup"],
    description: "Budget-friendly student hostel directly opposite DY Patil University. Includes study lounge, RO drinking water, and daily room cleaning.",
    houseRules: ["Quiet hours during exams", "No smoking", "Keep ID card visible"],
    colleges: [
      { name: "DY Patil University & Medical College", distance: "0.3 km" },
      { name: "SIES GST Nerul", distance: "1.1 km" }
    ],
    owner: {
      name: "Suresh Menon",
      phone: "+91 98212 99887",
      email: "suresh.nerul@roommate.in",
      verified: true,
      responseTime: "Responds within 1 hour",
      memberSince: "2023"
    }
  },
  {
    id: 6,
    title: "Scholar's Haven",
    location: "Ghatkopar, Mumbai",
    area: "Ghatkopar",
    city: "Mumbai",
    rent: 8000,
    type: "PG",
    gender: "Any",
    available: true,
    rating: 4.6,
    reviewsCount: 22,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "Laundry", "Parking", "CCTV"],
    description: "Modern student PG located 5 minutes walk from Ghatkopar Metro Station. Great connectivity to Somaiya Campus and Central Line.",
    houseRules: ["Maintain cleanliness", "No noise post 10 PM"],
    colleges: [
      { name: "Somaiya Vidyavihar University", distance: "1.0 km" },
      { name: "Ghatkopar Metro Station", distance: "0.4 km" }
    ],
    owner: {
      name: "Pooja Mehta",
      phone: "+91 98675 43210",
      email: "pooja.scholars@roommate.in",
      verified: true,
      responseTime: "Responds within 15 mins",
      memberSince: "2024"
    }
  }
];

// Asynchronously sync properties with MySQL DB if backend is live
async function fetchPropertiesFromMySQL() {
  try {
    const res = await fetch(`${API_HOST}/api/properties`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        // Map MySQL schema fields to frontend format
        PROPERTIES_DATA = json.data.map(p => ({
          id: p.id,
          title: p.title,
          location: p.location,
          area: p.area || p.location,
          city: p.city || 'Mumbai',
          rent: Number(p.rent),
          type: p.type,
          gender: p.gender_preference || 'Any',
          available: p.status === 'available',
          rating: Number(p.rating) || 4.8,
          reviewsCount: 20,
          images: p.image_url ? [p.image_url] : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5"],
          facilities: p.facilities && p.facilities.length > 0 ? p.facilities : ["Wi-Fi", "AC", "CCTV"],
          description: p.description || "Student accommodation listing.",
          houseRules: ["Keep common area clean", "Maintain quiet hours"],
          colleges: [{ name: "Local College Campus", distance: "0.8 km" }],
          owner: {
            name: p.owner_name || "Property Owner",
            phone: p.owner_phone || "+91 98201 45678",
            email: p.owner_email || "owner@roommate.in",
            verified: true,
            responseTime: "Responds within 15 mins"
          }
        }));
        console.log('✅ Synchronized properties from MySQL database:', PROPERTIES_DATA.length);
      }
    }
  } catch (e) {
    console.log('Using local property dataset (MySQL server connection not active)');
  }
}

fetchPropertiesFromMySQL();
