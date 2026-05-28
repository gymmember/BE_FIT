import { GymClass, MembershipPlan, Trainer } from "./types";

export const GYM_DETAILS = {
  name: "Be Fit - The Gym",
  tagline: "Carve Your Core. Dominate Your Strength.",
  location: "1st FLOOR, NEAR HOUSING COMPLEX, NOBLE BUD SCHOOL, Bachurdoba, Jhargram, West Bengal 721507",
  phone: "+91 79086 69556",
  timings: {
    weekdays: "5:30 AM - 10:00 PM",
    saturday: "6:00 AM - 9:00 PM",
  },
  facilities: [
    "Premium Olympic Free Weights & High-End Barbells",
    "Dedicated High-Intensity Core & Abs Specialization Zone",
    "Top-Tier Cardio Section: Treadmills, Spin Bikes, Stairmasters",
    "Functional CrossFit Arena & Heavy Boxing Bag Sacks",
    "Fully Air-Conditioned with Luxury Locker & Shower Rooms",
    "Certified Personal Coaches & Live Nutritional Consultants",
  ]
};

export const TRAINERS: Trainer[] = [
  {
    name: "Coach Bikram",
    role: "Head Bodybuilding Coach & Founder",
    specialty: "Hypertrophy, Transformation & Contest Prep",
    image: "https://picsum.photos/seed/coach1/300/400",
    bio: "With over 12 years of professional physical training experience, Bikram has helped hundreds of Jhargram residents sculpt high-definition physics."
  },
  {
    name: "Coach Sneha",
    role: "Core Sculpt Specialist & Nutritionist",
    specialty: "Lower Abs Definition, HIIT, Flexible Dieting",
    image: "https://picsum.photos/seed/coach2/300/400",
    bio: "Sneha is a certified nutritionist and functional fitness trainer. She supervises the signature Abs and Core masterclasses."
  },
  {
    name: "Coach Subhajit",
    role: "Strength & Powerlifting Specialist",
    specialty: "Compound Movements, Olympic Lifts, Power Training",
    image: "https://picsum.photos/seed/coach3/300/400",
    bio: "Subhajit leads the heavyweight lift setups. He is obsessed with posture perfection, lifting safety, and breaking personal records."
  }
];

export const CLASSES: GymClass[] = [
  {
    id: "brown-core-blast",
    title: "Be Fit Core Blast",
    category: "core",
    duration: "45 mins",
    intensity: "Intermediate",
    caloriesBurn: 400,
    description: "The signature washboard ab builder. Focusing entirely on absolute core stabilization, lower-ab raises, oblique carving holding, and cardio conditioning.",
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "7:00 AM & 6:30 PM"
    },
    trainer: "Coach Sneha"
  },
  {
    id: "iron-beast-bodybuilding",
    title: "Iron Beast Hypertrophy",
    category: "strength",
    duration: "60 mins",
    intensity: "Advanced",
    caloriesBurn: 550,
    description: "Heavy compounds paired with high-volume mechanical isolation. Gain raw size, power, and high density muscles under expert lift-coaching.",
    schedule: {
      days: ["Monday", "Tuesday", "Thursday", "Friday"],
      time: "8:00 AM & 5:00 PM"
    },
    trainer: "Coach Bikram"
  },
  {
    id: "fat-torch-hiit",
    title: "Fat Torch HIIT & Conditioning",
    category: "cardio",
    duration: "40 mins",
    intensity: "All Levels",
    caloriesBurn: 500,
    description: "Tabata cycles, plyometrics, kettlebell circuits, and battle ropes. Maximize VO2 max and burn calories up to 24 hours post-workout.",
    schedule: {
      days: ["Tuesday", "Thursday", "Saturday"],
      time: "6:00 AM & 7:30 PM"
    },
    trainer: "Coach Sneha"
  },
  {
    id: "crossfit-strength",
    title: "CrossFit Box conditioning",
    category: "strength",
    duration: "50 mins",
    intensity: "Advanced",
    caloriesBurn: 600,
    description: "A combination of gymnastics, power lifts, and high-intensity Olympic circuit routines. Perfect to build dynamic, useful athletic power.",
    schedule: {
      days: ["Wednesday", "Saturday"],
      time: "9:00 AM & 6:00 PM"
    },
    trainer: "Coach Subhajit"
  }
];

export const PRICING_PLANS: MembershipPlan[] = [
  {
    id: "intro-basic",
    name: "Classic Bronze Pack",
    price: "₹1,500",
    period: "Monthly",
    popular: false,
    features: [
      "Access to standard high-end gym equipment",
      "Full locker and hot shower access",
      "Initial 1-on-1 coach orientation program",
      "Free high-speed wi-fi in facilities",
      "General trainer supervision during floor hours"
    ],
    color: "from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 hover:border-amber-700/60",
    cta: "Start Your Routine",
  },
  {
    id: "shredded-quarter",
    name: "3-Month Shred Pack",
    price: "₹3,800",
    period: "Quarterly",
    popular: true,
    features: [
      "Full locker & premium amenities",
      "Priority registration for 'Be Fit Core Blast' classes",
      "1x Custom Diet template from Coach Sneha",
      "Bi-weekly body fat caliper tracking",
      "AI Personal Trainer Chat Portal integration",
      "Flexible workout slot selection"
    ],
    color: "from-amber-950 via-zinc-900 to-amber-950 border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    cta: "Join The Core Circle",
  },
  {
    id: "champion-year",
    name: "1-Year Elite Champion",
    price: "₹12,000",
    period: "Yearly",
    popular: false,
    features: [
      "Super economical - equivalent to ₹1,000/month",
      "All-time facility access VIP Pass",
      "12x Advanced 1-on-1 coaching checkups",
      "Full customizable training & nutrition routines",
      "Complimentary 'BE FIT' official gym t-shirt",
      "Priority VIP booking for specialized masterclasses"
    ],
    color: "from-amber-900/40 via-zinc-950 to-zinc-900 border-yellow-600 hover:border-yellow-400",
    cta: "Achieve Greatness",
  }
];
