import React, { useState } from "react";

type Gender = "male" | "female" | "";
type ActivityLevel = "1.2" | "1.375" | "1.55" | "1.725" | "1.9" | "";
type Goal = "maintain" | "lose" | "gain" | "";

export function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>("");
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [activity, setActivity] = useState<ActivityLevel>("");
  const [goal, setGoal] = useState<Goal>("");
  const [calories, setCalories] = useState<number | null>(null);

  const calculateCalories = () => {
    if (!gender || !age || !height || !weight || !activity || !goal) {
      alert("Please fill all fields.");
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const act = parseFloat(activity);

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    let tdee = bmr * act;

    if (goal === "lose") {
      tdee -= 500;
    } else if (goal === "gain") {
      tdee += 500;
    }

    setCalories(Math.round(tdee));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-24 relative z-10" id="calorie-calculator-section">
      <div className="text-center mb-12 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg inline-block relative pb-2">
          Know Your <span className="relative">Maintenance Calories
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#ff4a11] rounded-sm"></div>
          </span>
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto font-medium drop-shadow-md">
          Calculate your daily calorie needs based on your goals and activity level
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-[#1a1c29] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Gender:</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-[#202231] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Age:</label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                className="w-full bg-[#202231] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Height (cm):</label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height in cm"
                className="w-full bg-[#202231] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Weight (kg):</label>
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight in kg"
                className="w-full bg-[#202231] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Daily Activity Level:</label>
              <select 
                value={activity} 
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                className="w-full bg-[#202231] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
              >
                <option value="">Select Activity Level</option>
                <option value="1.2">Sedentary (little to no exercise)</option>
                <option value="1.375">Lightly active (light exercise/sports 1-3 days/week)</option>
                <option value="1.55">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                <option value="1.725">Very active (hard exercise/sports 6-7 days a week)</option>
                <option value="1.9">Extra active (very hard exercise/sports & physical job)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Goal:</label>
              <select 
                value={goal} 
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="w-full bg-[#202231] border border-zinc-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5 outline-none"
              >
                <option value="">Select Your Goal</option>
                <option value="maintain">Maintain weight</option>
                <option value="lose">Weight loss</option>
                <option value="gain">Weight gain</option>
              </select>
            </div>

            <div className="pt-4">
              <button 
                onClick={calculateCalories}
                className="w-full bg-[#ff4a11] hover:bg-[#ff5a22] text-white font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none"
              >
                Calculate Calories
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center bg-[#1a1c29] border border-zinc-800 rounded-xl p-8 shadow-xl min-h-[400px]">
          <div className="text-center space-y-6">
            <h3 className="text-lg font-bold text-white">Your Daily Calorie Needs</h3>
            
            <div className="text-6xl font-black text-[#ff4a11] drop-shadow-md">
              {calories !== null ? calories : "0"}
            </div>
            
            <p className="text-zinc-400 text-sm">
              {calories !== null 
                ? "Calories required to meet your specific goal."
                : "Enter your details to calculate your daily calorie requirements"}
            </p>

            <div className="mt-8 bg-[#202231] border border-zinc-700 rounded-lg p-5">
              <div className="flex items-center justify-center gap-2 mb-2 text-amber-400 font-bold text-sm">
                <span>💡</span> Tip:
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed">
                For weight loss, consume 300-500 calories less than maintenance. For weight gain, consume 300-500 calories more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
