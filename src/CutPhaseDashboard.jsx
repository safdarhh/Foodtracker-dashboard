import React, { useState, useEffect } from 'react';
import { Plus, TrendingDown, ChevronDown, Coffee, Sun, Moon, Apple, X, Search, Check, Calendar, Target, Flame, Dumbbell, Wheat, Droplet } from 'lucide-react';

// Cut phase targets
const TARGETS = { calories: 1800, protein: 160, carbs: 130, fat: 55 };

// Safdar's inventory (grows as he logs)
const INVENTORY = [
  { id: 1, name: 'Black Coffee', brand: '-', serving: '1 cup', cal: 5, p: 0, c: 0, f: 0 },
  { id: 2, name: 'Whole Wheat Chapati', brand: 'iD Fresh', serving: '1 pc (40g)', cal: 108, p: 3, c: 20, f: 2 },
  { id: 3, name: 'Eggs (Whole)', brand: '-', serving: '1 large', cal: 72, p: 6, c: 0.5, f: 5 },
  { id: 4, name: 'Rice (Cooked)', brand: 'Basmati', serving: '100g', cal: 130, p: 3, c: 28, f: 0.3 },
  { id: 5, name: 'Chicken Boneless', brand: '-', serving: '100g', cal: 165, p: 31, c: 0, f: 4 },
  { id: 6, name: 'Greek Yogurt', brand: 'Milky Mist', serving: '100g', cal: 78, p: 8, c: 7, f: 2 },
];

// Sample day data
const SAMPLE_DAY = {
  date: '2026-04-10',
  meals: [
    { id: 1, time: '08:00', slot: 'breakfast', items: [{ name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }] },
    { id: 2, time: '13:00', slot: 'lunch', items: [
      { name: 'iD Fresh Chapati', qty: '2 pcs', cal: 216, p: 6, c: 40, f: 4 },
      { name: 'Egg Omelette', qty: '4 eggs', cal: 288, p: 25, c: 2, f: 20 }
    ]},
    { id: 3, time: '20:00', slot: 'dinner', items: [
      { name: 'Rice', qty: '200g', cal: 260, p: 5, c: 56, f: 1 },
      { name: 'Chicken', qty: '200g', cal: 330, p: 62, c: 0, f: 7 },
      { name: 'Egg Omelette', qty: '4 eggs', cal: 288, p: 25, c: 2, f: 20 },
      { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }
    ]}
  ]
};

// InBody data
const INBODY = {
  current: { weight: 79.3, muscle: 38.5, fat: 12.7, fatPct: 16.0, score: 84 },
  target: { fatPct: 10, fatPctMax: 12 }
};

export default function CutPhaseDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  const [meals, setMeals] = useState(SAMPLE_DAY.meals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate totals
  const totals = meals.reduce((acc, meal) => {
    meal.items.forEach(item => {
      acc.cal += item.cal;
      acc.p += item.p;
      acc.c += item.c;
      acc.f += item.f;
    });
    return acc;
  }, { cal: 0, p: 0, c: 0, f: 0 });

  // Progress Ring Component
  const ProgressRing = ({ value, max, size = 100, strokeWidth = 8, color, bgColor = '#E5E7EB' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.min(value / max, 1);
    const offset = circumference - progress * circumference;
    const percentage = Math.round(progress * 100);
    
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
          <circle 
            cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-gray-800">{value}{typeof max === 'number' && max < 200 ? 'g' : ''}</span>
          <span className="text-xs text-gray-400">/ {max}{typeof max === 'number' && max < 200 ? 'g' : ''}</span>
        </div>
      </div>
    );
  };

  // Macro Ring with label
  const MacroRing = ({ value, max, color, label, subtitle, icon: Icon }) => {
    const pct = Math.round((value / max) * 100);
    const isGood = pct >= 75;
    return (
      <div className="flex flex-col items-center">
        <ProgressRing value={value} max={max} size={90} strokeWidth={7} color={color} />
        <div className="mt-2 text-center">
          <span className="text-sm font-medium" style={{ color }}>{label} {isGood ? '✓' : ''}</span>
          <p className="text-xs text-gray-400">{pct}% — {subtitle}</p>
        </div>
      </div>
    );
  };

  // Stat Card
  const StatCard = ({ label, value, unit, color, subtitle }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}<span className="text-sm font-normal text-gray-400 ml-1">{unit}</span></p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );

  // Meal Card
  const MealCard = ({ meal, icon: Icon, iconBg, title }) => {
    const mealTotals = meal?.items.reduce((a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }), { cal: 0, p: 0, c: 0, f: 0 }) || { cal: 0, p: 0, c: 0, f: 0 };
    
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg }}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{title}</p>
              <p className="text-xs text-gray-400">{meal?.time || '--:--'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">{mealTotals.cal} kcal</p>
            <p className="text-xs">
              <span className="text-green-500">P{mealTotals.p}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span className="text-blue-500">C{mealTotals.c}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span className="text-orange-500">F{mealTotals.f}</span>
            </p>
          </div>
        </div>
        
        {meal?.items.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-gray-50">
            {meal.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="text-gray-400">{item.qty}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-300 text-center py-3">No items logged</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FEFEFE 0%, #F8F9FA 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', -apple-system, sans-serif; }
        .shadow-soft { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: '#EF4444' }}>
                CUT PHASE
              </div>
              <span className="text-sm text-gray-500">Abs visibility</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar size={14} />
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        
        {/* Body Fat Status */}
        <section className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-soft border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Current body fat</p>
            <p className="text-3xl font-bold text-orange-500">{INBODY.current.fatPct}%</p>
            <p className="text-xs text-gray-400">{INBODY.current.fat} kg fat mass</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-soft border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Target for abs</p>
            <p className="text-3xl font-bold text-green-500">10-12%</p>
            <p className="text-xs text-gray-400">~4-5 kg to lose</p>
          </div>
        </section>

        {/* Cut Targets */}
        <section className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-red-500" />
            <h2 className="font-semibold text-gray-800">Your cut targets</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">1,800</p>
              <p className="text-xs text-gray-400">kcal</p>
              <p className="text-xs text-red-500 mt-0.5">-700 deficit</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">160g</p>
              <p className="text-xs text-gray-400">protein</p>
              <p className="text-xs text-green-500 mt-0.5">2g/kg</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">130g</p>
              <p className="text-xs text-gray-400">carbs</p>
              <p className="text-xs text-gray-400 mt-0.5">moderate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">55g</p>
              <p className="text-xs text-gray-400">fat</p>
              <p className="text-xs text-gray-400 mt-0.5">0.7g/kg</p>
            </div>
          </div>
        </section>

        {/* Day Progress - The Main Visual */}
        <section className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Flame size={16} className="text-orange-500" />
            <h2 className="font-semibold text-gray-800">Day 1 re-evaluated</h2>
          </div>
          
          <div className="flex justify-around flex-wrap gap-4 mb-6">
            <MacroRing value={totals.cal} max={1800} color="#22C55E" label="Calories" subtitle="good deficit" />
            <MacroRing value={Math.round(totals.p)} max={160} color="#22C55E" label="Protein" subtitle="muscle preserved" />
            <MacroRing value={Math.round(totals.c)} max={130} color="#3B82F6" label="Carbs" subtitle="on track" />
            <MacroRing value={Math.round(totals.f)} max={55} color="#F97316" label="Fat" subtitle="perfect" />
          </div>
        </section>

        {/* Insight Box */}
        <section className="rounded-2xl p-4 mb-6" style={{ backgroundColor: '#DCFCE7' }}>
          <div className="flex items-start gap-2">
            <Check size={18} className="text-green-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800 mb-1">Excellent cut day!</p>
              <p className="text-sm text-green-700">You're in a solid 700+ calorie deficit while keeping protein high. Add ~30g more protein (1 egg or Greek yogurt) to hit 160g for optimal muscle retention.</p>
            </div>
          </div>
        </section>

        {/* Timeline Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-xs font-medium text-gray-400">TODAY'S MEALS</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* Meal Cards */}
        <div className="space-y-3 mb-6">
          <MealCard 
            meal={meals.find(m => m.slot === 'breakfast')} 
            icon={Coffee} 
            iconBg="#FBBF24" 
            title="Breakfast" 
          />
          <MealCard 
            meal={meals.find(m => m.slot === 'lunch')} 
            icon={Sun} 
            iconBg="#60A5FA" 
            title="Lunch" 
          />
          <MealCard 
            meal={meals.find(m => m.slot === 'dinner')} 
            icon={Moon} 
            iconBg="#A78BFA" 
            title="Dinner" 
          />
        </div>

        {/* Daily Total */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">Daily Total</span>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-800">{totals.cal} kcal</span>
              <div className="flex gap-2 text-sm">
                <span className="text-green-600 font-medium">P{Math.round(totals.p)}</span>
                <span className="text-blue-600 font-medium">C{Math.round(totals.c)}</span>
                <span className="text-orange-600 font-medium">F{Math.round(totals.f)}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">335 calories under target — excellent deficit!</p>
        </div>

        {/* Body Comp Section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs font-medium text-gray-400">BODY COMPOSITION</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <StatCard label="Weight" value={INBODY.current.weight} unit="kg" color="#3B82F6" />
            <StatCard label="Muscle" value={INBODY.current.muscle} unit="kg" color="#22C55E" />
            <StatCard label="Fat" value={INBODY.current.fat} unit="kg" color="#F97316" />
            <StatCard label="Score" value={INBODY.current.score} unit="pts" color="#8B5CF6" />
          </div>
        </div>

        {/* Inventory Preview */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Your Inventory</h3>
            <span className="text-xs text-gray-400">{INVENTORY.length} foods</span>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="text-left py-2 px-3 font-medium">Food</th>
                  <th className="text-right py-2 px-3 font-medium">Cal</th>
                  <th className="text-right py-2 px-3 font-medium text-green-500">P</th>
                  <th className="text-right py-2 px-3 font-medium text-blue-500">C</th>
                  <th className="text-right py-2 px-3 font-medium text-orange-500">F</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY.map((food, i) => (
                  <tr key={food.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="py-2 px-3">
                      <p className="font-medium text-gray-800">{food.name}</p>
                      <p className="text-xs text-gray-400">{food.brand !== '-' ? food.brand + ' · ' : ''}{food.serving}</p>
                    </td>
                    <td className="text-right py-2 px-3 text-gray-600">{food.cal}</td>
                    <td className="text-right py-2 px-3 text-green-600 font-medium">{food.p}</td>
                    <td className="text-right py-2 px-3 text-blue-600">{food.c}</td>
                    <td className="text-right py-2 px-3 text-orange-600">{food.f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Timeline:</span> At -700 kcal/day (~0.6 kg/week), expect to reach 10-12% body fat in <span className="font-semibold text-green-600">8-10 weeks</span>
          </p>
        </div>
      </main>

      {/* FAB */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        style={{ boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)' }}
      >
        <Plus size={24} />
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Log Food</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your foods..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-green-500 focus:outline-none text-sm"
                autoFocus
              />
            </div>

            <p className="text-xs text-gray-400 mb-2">Your inventory</p>
            <div className="space-y-2">
              {INVENTORY.map(food => (
                <div key={food.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-green-50 cursor-pointer transition-colors">
                  <div>
                    <p className="font-medium text-gray-800">{food.name}</p>
                    <p className="text-xs text-gray-400">{food.serving}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{food.cal} kcal</p>
                    <p className="text-xs">
                      <span className="text-green-500">P{food.p}</span>
                      <span className="text-gray-300 mx-1">·</span>
                      <span className="text-blue-500">C{food.c}</span>
                      <span className="text-gray-300 mx-1">·</span>
                      <span className="text-orange-500">F{food.f}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center mt-6">Or use Claude: "food - chicken 200g, eggs 4"</p>
          </div>
        </div>
      )}
    </div>
  );
}
