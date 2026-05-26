export interface Trainer {
  name: string;
  role: string;
  specialty: string;
  image: string;
  bio: string;
}

export interface GymClass {
  id: string;
  title: string;
  category: "strength" | "cardio" | "core" | "combat";
  duration: string;
  intensity: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  caloriesBurn: number;
  description: string;
  schedule: {
    days: string[];
    time: string;
  };
  trainer: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  popular: boolean;
  features: string[];
  color: string;
  cta: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}
