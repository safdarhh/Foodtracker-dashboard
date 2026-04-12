import React, { useState, useEffect } from 'react';
import { Plus, Coffee, Sun, Moon, Sparkles, X, Search, Check, Calendar, Target, Flame, TrendingDown, ChevronLeft, ChevronRight, History, Package, UtensilsCrossed, Zap, ChevronRight as ChevronRightIcon } from 'lucide-react';

// ============================================
// CONFIGURATION
// ============================================
const TARGETS = { calories: 1800, protein: 160, carbs: 130, fat: 55 };

const INBODY = {
  weight: 79.3, muscle: 38.5, fat: 12.7, fatPct: 16.0, score: 84
};

// Full Inventory - All ingredients used
const INVENTORY = [
  { id: 1, name: 'Black Coffee', brand: '-', serving: '1 cup (250ml)', cal: 5, p: 0, c: 0, f: 0, category: 'Beverages' },
  { id: 2, name: 'Whole Wheat Chapati', brand: 'iD Fresh', serving: '1 pc (40g)', cal: 108, p: 3, c: 20, f: 2, category: 'Carbs' },
  { id: 3, name: 'Eggs (Whole)', brand: '-', serving: '1 large', cal: 72, p: 6, c: 0.5, f: 5, category: 'Protein' },
  { id: 4, name: 'Rice (Cooked)', brand: 'Basmati', serving: '100g', cal: 130, p: 3, c: 28, f: 0.3, category: 'Carbs' },
  { id: 5, name: 'Chicken Boneless', brand: '-', serving: '100g', cal: 165, p: 31, c: 0, f: 4, category: 'Protein' },
  { id: 6, name: 'Greek Yogurt', brand: 'Milky Mist', serving: '100g', cal: 78, p: 8, c: 7, f: 2, category: 'Dairy' },
  { id: 7, name: 'Banana', brand: '-', serving: '100g', cal: 89, p: 1, c: 23, f: 0, category: 'Fruits' },
  { id: 8, name: 'Milk (Whole)', brand: '-', serving: '250ml', cal: 150, p: 8, c: 12, f: 8, category: 'Dairy' },
  { id: 9, name: 'NakPro Whey Gold', brand: 'NakPro', serving: '1 scoop (33g)', cal: 130, p: 25, c: 3, f: 2, category: 'Supplements' },
];

// My Meals - Personalized meal combos
const MY_MEALS = [
  {
    id: 1,
    name: 'Power Lunch',
    emoji: '💪',
    description: '4 eggs + chicken + rice + yogurt',
    items: [
      { name: 'Eggs (Omelette)', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 },
      { name: 'Chicken Boneless', qty: '150g', cal: 248, p: 47, c: 0, f: 6 },
      { name: 'Rice (Basmati)', qty: '200g', cal: 260, p: 6, c: 56, f: 1 },
      { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }
    ],
    totals: { cal: 874, p: 85, c: 65, f: 29 },
    timesUsed: 3
  },
  {
    id: 2,
    name: 'Protein Shake',
    emoji: '🥤',
    description: 'Banana + milk + whey',
    items: [
      { name: 'Banana', qty: '76g', cal: 68, p: 1, c: 17, f: 0 },
      { name: 'Milk', qty: '250ml', cal: 150, p: 8, c: 12, f: 8 },
      { name: 'NakPro Whey', qty: '1 scoop', cal: 130, p: 25, c: 3, f: 2 }
    ],
    totals: { cal: 348, p: 34, c: 32, f: 10 },
    timesUsed: 2
  },
  {
    id: 3,
    name: 'Quick Breakfast',
    emoji: '☕',
    description: 'Just black coffee',
    items: [
      { name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }
    ],
    totals: { cal: 5, p: 0, c: 0, f: 0 },
    timesUsed: 3
  },
  {
    id: 4,
    name: 'Heavy Dinner',
    emoji: '🍗',
    description: '200g chicken + rice + eggs + yogurt',
    items: [
      { name: 'Chicken Boneless', qty: '200g', cal: 330, p: 62, c: 0, f: 8 },
      { name: 'Rice (Basmati)', qty: '200g', cal: 260, p: 6, c: 56, f: 1 },
      { name: 'Eggs (Omelette)', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 },
      { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }
    ],
    totals: { cal: 956, p: 100, c: 65, f: 31 },
    timesUsed: 1
  },
  {
    id: 5,
    name: 'Roti Meal',
    emoji: '🫓',
    description: '2 chapati + 4 eggs omelette',
    items: [
      { name: 'iD Fresh Chapati', qty: '2 pcs', cal: 216, p: 6, c: 40, f: 4 },
      { name: 'Eggs (Omelette)', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 }
    ],
    totals: { cal: 504, p: 30, c: 42, f: 24 },
    timesUsed: 1
  },
  {
    id: 6,
    name: 'Light Dinner',
    emoji: '🌙',
    description: 'Chicken + eggs + rice + yogurt',
    items: [
      { name: 'Chicken Boneless', qty: '133g', cal: 219, p: 41, c: 0, f: 5 },
      { name: 'Eggs (Omelette)', qty: '2 eggs', cal: 144, p: 12, c: 1, f: 10 },
      { name: 'Rice (Basmati)', qty: '104g', cal: 135, p: 3, c: 29, f: 0 },
      { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }
    ],
    totals: { cal: 576, p: 64, c: 37, f: 17 },
    timesUsed: 1
  }
];

// Historical data
const SEED_DATA = {
  '2026-04-10': {
    meals: [
      { slot: 'breakfast', time: '08:00', items: [{ name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }] },
      { slot: 'lunch', time: '13:00', items: [
        { name: 'iD Fresh Chapati', qty: '2 pcs', cal: 216, p: 6, c: 40, f: 4 },
        { name: 'Egg Omelette', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 }
      ]},
      { slot: 'dinner', time: '20:00', items: [
        { name: 'Rice', qty: '200g', cal: 260, p: 6, c: 56, f: 1 },
        { name: 'Chicken', qty: '200g', cal: 330, p: 62, c: 0, f: 8 },
        { name: 'Egg Omelette', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 },
        { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }
      ]}
    ]
  },
  '2026-04-11': {
    meals: [
      { slot: 'breakfast', time: '08:00', items: [{ name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }] },
      { slot: 'lunch', time: '14:22', items: [
        { name: 'Rice', qty: '210g', cal: 273, p: 6, c: 59, f: 1 },
        { name: 'Chicken', qty: '150g', cal: 248, p: 47, c: 0, f: 6 },
        { name: 'Egg Omelette', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 },
        { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }
      ]},
      { slot: 'dinner', time: '20:00', items: [
        { name: 'Chicken', qty: '133g', cal: 219, p: 41, c: 0, f: 5 },
        { name: 'Egg Omelette', qty: '2 eggs', cal: 144, p: 12, c: 1, f: 10 },
        { name: 'Rice', qty: '104g', cal: 135, p: 3, c: 29, f: 0 },
        { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 },
        { name: 'Banana', qty: '76g', cal: 68, p: 1, c: 17, f: 0 },
        { name: 'Milk', qty: '250ml', cal: 150, p: 8, c: 12, f: 8 },
        { name: 'NakPro Whey', qty: '1 scoop', cal: 130, p: 25, c: 3, f: 2 }
      ]}
    ]
  },
  '2026-04-12': {
    meals: [
      { slot: 'breakfast', time: '08:00', items: [{ name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }] },
      { slot: 'lunch', time: '13:00', items: [
        { name: 'Egg Omelette', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 },
        { name: 'Chicken', qty: '150g', cal: 248, p: 47, c: 0, f: 6 },
        { name: 'Rice', qty: '200g', cal: 260, p: 6, c: 56, f: 1 },
        { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }
      ]},
      { slot: 'snack', time: '17:00', items: [
        { name: 'Banana', qty: '76g', cal: 68, p: 1, c: 17, f: 0 },
        { name: 'Milk', qty: '250ml', cal: 150, p: 8, c: 12, f: 8 },
        { name: 'NakPro Whey', qty: '1 scoop', cal: 130, p: 25, c: 3, f: 2 }
      ]}
    ]
  }
};

// ============================================
// HELPERS
// ============================================
const formatDateKey = (date) => date.toISOString().split('T')[0];

const formatDisplayDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (formatDateKey(date) === formatDateKey(today)) return 'Today';
  if (formatDateKey(date) === formatDateKey(yesterday)) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const getDayNumber = (date) => {
  const startDate = new Date('2026-04-10');
  const diffTime = date - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
};

const STORAGE_KEY = 'cutPhaseTracker';
const loadAllData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error('Error loading data:', e); }
  return SEED_DATA;
};

const getDayData = (allData, dateKey) => allData[dateKey] || { meals: [] };

// ============================================
// STYLES
// ============================================
const colors = {
  primary: '#22C55E',
  protein: '#22C55E',
  carbs: '#3B82F6',
  fat: '#F97316',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  yellow: '#F59E0B',
  bg: '#F8F8F6',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.04)',
  textPrimary: '#1a1a1a',
  textSecondary: '#888',
  textMuted: '#AAA',
};

const styles = {
  page: { minHeight: '100vh', background: colors.bg, paddingBottom: 100 },
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  headerInner: { maxWidth: 480, margin: '0 auto', padding: '14px 20px' },
  badge: {
    background: `linear-gradient(135deg, ${colors.danger} 0%, #DC2626 100%)`,
    color: 'white', fontSize: 10, fontWeight: 700,
    padding: '6px 12px', borderRadius: 6, letterSpacing: 0.8, textTransform: 'uppercase',
  },
  tabs: {
    display: 'flex', gap: 4, background: '#F0F0EE', borderRadius: 12, padding: 4,
  },
  tab: {
    flex: 1, padding: '10px 12px', borderRadius: 10, border: 'none',
    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  tabActive: { background: 'white', color: colors.textPrimary, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tabInactive: { background: 'transparent', color: colors.textSecondary },
  main: { maxWidth: 480, margin: '0 auto', padding: '20px 20px' },
  card: {
    background: colors.card, borderRadius: 20, padding: 20, marginBottom: 14,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`,
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 },
  cardIcon: { width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: 600, color: colors.textPrimary, letterSpacing: -0.3 },
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 },
  statCard: {
    background: colors.card, borderRadius: 18, padding: '18px 20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`,
  },
  divider: { display: 'flex', alignItems: 'center', gap: 14, margin: '24px 0 16px' },
  dividerLine: { flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #E5E5E5, transparent)' },
  dividerText: { fontSize: 10, fontWeight: 600, color: colors.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
  mealCard: {
    background: colors.card, borderRadius: 18, padding: 18, marginBottom: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}`,
  },
  fab: {
    position: 'fixed', bottom: 28, right: 28, width: 60, height: 60, borderRadius: 30,
    background: `linear-gradient(135deg, ${colors.primary} 0%, #16A34A 100%)`,
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4), 0 2px 8px rgba(0,0,0,0.1)',
  },
  inventoryItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderRadius: 16, background: '#FAFAFA', marginBottom: 8,
    border: '1px solid #F0F0F0', transition: 'all 0.2s',
  },
  mealPreset: {
    background: colors.card, borderRadius: 18, padding: 18, marginBottom: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  categoryBadge: {
    fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
};

// ============================================
// COMPONENTS
// ============================================
const ProgressRing = ({ value, max, size = 72, strokeWidth = 5, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F1F1F1" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{value.toLocaleString()}{max < 500 ? 'g' : ''}</span>
        <span style={{ fontSize: 9, color: colors.textMuted }}>/ {max}{max < 500 ? 'g' : ''}</span>
      </div>
    </div>
  );
};

const MacroRing = ({ value, max, color, label, subtitle }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <ProgressRing value={value} max={max} color={color} />
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color }}>{label} {pct >= 95 && '✓'}</div>
        <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 3 }}>{pct}% — {subtitle}</div>
      </div>
    </div>
  );
};

const MacroPills = ({ p, c, f, size = 'sm' }) => {
  const fontSize = size === 'sm' ? 11 : 13;
  return (
    <div style={{ display: 'flex', gap: size === 'sm' ? 6 : 10, fontSize }}>
      <span style={{ color: colors.protein, fontWeight: 600 }}>P{Math.round(p)}</span>
      <span style={{ color: '#DDD' }}>·</span>
      <span style={{ color: colors.carbs, fontWeight: 600 }}>C{Math.round(c)}</span>
      <span style={{ color: '#DDD' }}>·</span>
      <span style={{ color: colors.fat, fontWeight: 600 }}>F{Math.round(f)}</span>
    </div>
  );
};

const MealCard = ({ meal, icon: Icon, iconBg, title }) => {
  const totals = meal?.items?.reduce((a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }), { cal: 0, p: 0, c: 0, f: 0 }) || { cal: 0, p: 0, c: 0, f: 0 };
  if (!meal || !meal.items || meal.items.length === 0) return null;

  return (
    <div style={styles.mealCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>{title}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{meal.time}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{totals.cal} kcal</div>
          <div style={{ marginTop: 2 }}><MacroPills p={totals.p} c={totals.c} f={totals.f} /></div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #F5F5F5', paddingTop: 12 }}>
        {meal.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
            <span style={{ color: '#555' }}>{item.name}</span>
            <span style={{ color: colors.textMuted, fontWeight: 500 }}>{item.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// TAB: DASHBOARD
// ============================================
const DashboardTab = ({ allData, selectedDate, setSelectedDate }) => {
  const dateKey = formatDateKey(selectedDate);
  const dayData = getDayData(allData, dateKey);
  const meals = dayData.meals || [];
  const dayNumber = getDayNumber(selectedDate);

  const totals = meals.reduce((acc, meal) => {
    (meal.items || []).forEach(item => { acc.cal += item.cal || 0; acc.p += item.p || 0; acc.c += item.c || 0; acc.f += item.f || 0; });
    return acc;
  }, { cal: 0, p: 0, c: 0, f: 0 });

  const calPct = Math.round((totals.cal / TARGETS.calories) * 100);
  const pPct = Math.round((totals.p / TARGETS.protein) * 100);

  const goToPrevDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); };
  const goToNextDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); };

  return (
    <>
      {/* Date Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#F5F5F3', borderRadius: 12, padding: '8px 12px', marginBottom: 20 }}>
        <button onClick={goToPrevDay} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <ChevronLeft size={18} color="#666" />
        </button>
        <div style={{ minWidth: 120, textAlign: 'center', fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{formatDisplayDate(selectedDate)}</div>
        <button onClick={goToNextDay} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <ChevronRight size={18} color="#666" />
        </button>
        <span style={{ fontSize: 11, fontWeight: 600, color: colors.primary, background: '#F0FDF4', padding: '4px 10px', borderRadius: 6 }}>Day {dayNumber}</span>
      </div>

      {/* Body Fat Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Current body fat</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.fat, letterSpacing: -1 }}>{INBODY.fatPct}%</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>{INBODY.fat} kg fat mass</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Target for abs</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: colors.primary, letterSpacing: -1 }}>10-12%</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>~4-5 kg to lose</div>
        </div>
      </div>

      {/* Cut Targets */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #FEE2E2, #FECACA)' }}><Target size={16} color={colors.danger} /></div>
          <span style={styles.cardTitle}>Your cut targets</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
          <div><div style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary }}>1,800</div><div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>kcal</div><div style={{ fontSize: 10, color: colors.danger, marginTop: 4, fontWeight: 600 }}>-700 deficit</div></div>
          <div><div style={{ fontSize: 24, fontWeight: 700, color: colors.protein }}>160g</div><div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>protein</div><div style={{ fontSize: 10, color: colors.protein, marginTop: 4, fontWeight: 600 }}>2g/kg</div></div>
          <div><div style={{ fontSize: 24, fontWeight: 700, color: colors.carbs }}>130g</div><div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>carbs</div><div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, fontWeight: 600 }}>moderate</div></div>
          <div><div style={{ fontSize: 24, fontWeight: 700, color: colors.fat }}>55g</div><div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>fat</div><div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, fontWeight: 600 }}>0.7g/kg</div></div>
        </div>
      </div>

      {/* Day Progress */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #FED7AA, #FDBA74)' }}><Flame size={16} color="#EA580C" /></div>
          <span style={styles.cardTitle}>Day {dayNumber} progress</span>
        </div>
        {totals.cal > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <MacroRing value={totals.cal} max={TARGETS.calories} color={colors.primary} label="Calories" subtitle={calPct >= 90 ? 'on target' : 'in progress'} />
            <MacroRing value={Math.round(totals.p)} max={TARGETS.protein} color={colors.protein} label="Protein" subtitle={pPct >= 70 ? 'good' : 'building'} />
            <MacroRing value={Math.round(totals.c)} max={TARGETS.carbs} color={colors.carbs} label="Carbs" subtitle="on track" />
            <MacroRing value={Math.round(totals.f)} max={TARGETS.fat} color={colors.fat} label="Fat" subtitle="controlled" />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.textMuted }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🍽️</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>No meals logged yet</div>
          </div>
        )}
      </div>

      {/* Insight */}
      {totals.cal > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #DCFCE7 0%, #D1FAE5 100%)', borderRadius: 18, padding: 18, marginBottom: 14, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 24, height: 24, borderRadius: 8, background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={14} color="white" strokeWidth={3} /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#166534', marginBottom: 6 }}>{calPct >= 90 ? 'Great day!' : 'On track!'}</div>
              <div style={{ fontSize: 13, color: '#15803D', lineHeight: 1.5 }}>{calPct >= 90 ? `You hit ${calPct}% of your calorie target with ${Math.round(totals.p)}g protein.` : `${TARGETS.calories - totals.cal} kcal remaining. Keep protein high!`}</div>
            </div>
          </div>
        </div>
      )}

      {/* Meals */}
      {meals.length > 0 && (
        <>
          <div style={styles.divider}><div style={styles.dividerLine}></div><span style={styles.dividerText}>Meals</span><div style={styles.dividerLine}></div></div>
          <MealCard meal={meals.find(m => m.slot === 'breakfast')} icon={Coffee} iconBg={`linear-gradient(135deg, #FCD34D, ${colors.yellow})`} title="Breakfast" />
          <MealCard meal={meals.find(m => m.slot === 'lunch')} icon={Sun} iconBg={`linear-gradient(135deg, #60A5FA, ${colors.carbs})`} title="Lunch" />
          <MealCard meal={meals.find(m => m.slot === 'snack')} icon={Sparkles} iconBg={`linear-gradient(135deg, #F472B6, ${colors.pink})`} title="Snack" />
          <MealCard meal={meals.find(m => m.slot === 'dinner')} icon={Moon} iconBg={`linear-gradient(135deg, #A78BFA, ${colors.purple})`} title="Dinner" />

          <div style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', borderRadius: 18, padding: 18, border: '1px solid rgba(34, 197, 94, 0.15)', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#166534' }}>Daily Total</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#166534' }}>{totals.cal} kcal</span>
                <MacroPills p={totals.p} c={totals.c} f={totals.f} size="md" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Timeline */}
      <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: 16, padding: 16, border: '1px solid rgba(59, 130, 246, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingDown size={16} color={colors.carbs} />
          <span style={{ fontSize: 13, color: '#1E40AF' }}><strong>Timeline:</strong> At -700 kcal/day, expect abs in <span style={{ color: '#16A34A', fontWeight: 700 }}>8-10 weeks</span></span>
        </div>
      </div>
    </>
  );
};

// ============================================
// TAB: INVENTORY
// ============================================
const InventoryTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(INVENTORY.map(i => i.category))];
  const filtered = INVENTORY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryColors = {
    Protein: { bg: '#F0FDF4', text: colors.protein },
    Carbs: { bg: '#EFF6FF', text: colors.carbs },
    Dairy: { bg: '#FFF7ED', text: colors.fat },
    Beverages: { bg: '#F5F3FF', text: colors.purple },
    Fruits: { bg: '#FDF2F8', text: colors.pink },
    Supplements: { bg: '#FEF3C7', text: colors.yellow },
  };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: 14, border: '2px solid #F0F0F0', fontSize: 14, outline: 'none', background: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600,
                background: selectedCategory === cat ? colors.primary : '#F0F0F0',
                color: selectedCategory === cat ? 'white' : colors.textSecondary,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 12 }}>{filtered.length} ingredients</div>

      {filtered.map(item => (
        <div key={item.id} style={styles.inventoryItem}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{item.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.brand !== '-' && <span style={{ fontSize: 12, color: colors.textSecondary }}>{item.brand}</span>}
              <span style={{ fontSize: 12, color: colors.textMuted }}>{item.serving}</span>
            </div>
            <span style={{ ...styles.categoryBadge, background: categoryColors[item.category]?.bg || '#F0F0F0', color: categoryColors[item.category]?.text || colors.textSecondary, marginTop: 8, display: 'inline-block' }}>{item.category}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>{item.cal}</div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>kcal</div>
            <MacroPills p={item.p} c={item.c} f={item.f} />
          </div>
        </div>
      ))}
    </>
  );
};

// ============================================
// TAB: MY MEALS
// ============================================
const MyMealsTab = () => {
  const [expandedMeal, setExpandedMeal] = useState(null);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.5 }}>
          Your favorite meal combos. Tap to see details or quick-add to today's log.
        </div>
      </div>

      <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 12 }}>{MY_MEALS.length} saved meals</div>

      {MY_MEALS.map(meal => (
        <div
          key={meal.id}
          style={styles.mealPreset}
          onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 32 }}>{meal.emoji}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>{meal.name}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>{meal.description}</div>
                <MacroPills p={meal.totals.p} c={meal.totals.c} f={meal.totals.f} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: colors.textPrimary }}>{meal.totals.cal}</div>
              <div style={{ fontSize: 11, color: colors.textMuted }}>kcal</div>
              <div style={{ fontSize: 10, color: colors.primary, marginTop: 8, fontWeight: 600 }}>Used {meal.timesUsed}x</div>
            </div>
          </div>

          {expandedMeal === meal.id && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F0F0F0' }}>
              <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Ingredients</div>
              {meal.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13, borderBottom: i < meal.items.length - 1 ? '1px solid #F8F8F8' : 'none' }}>
                  <span style={{ color: colors.textPrimary }}>{item.name}</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: colors.textMuted }}>{item.qty}</span>
                    <span style={{ fontWeight: 600, color: colors.textSecondary }}>{item.cal} kcal</span>
                  </div>
                </div>
              ))}
              <button style={{
                width: '100%', marginTop: 16, padding: '14px', borderRadius: 12, border: 'none',
                background: `linear-gradient(135deg, ${colors.primary}, #16A34A)`, color: 'white',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
                <Zap size={16} /> Quick Add to Today
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

// ============================================
// MAIN DASHBOARD
// ============================================
export default function CutPhaseDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allData, setAllData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date('2026-04-12'));
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { setAllData(loadAllData()); }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Flame },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'meals', label: 'My Meals', icon: UtensilsCrossed },
  ];

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`* { font-family: 'Inter', -apple-system, sans-serif; box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { display: none; }`}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={styles.badge}>CUT PHASE</span>
              <span style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>Abs visibility</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: colors.textSecondary }}>
              <Calendar size={14} />
              <span>Apr 12</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : styles.tabInactive) }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {activeTab === 'dashboard' && <DashboardTab allData={allData} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'meals' && <MyMealsTab />}
      </main>

      {/* FAB */}
      <button onClick={() => setShowAddModal(true)} style={styles.fab}>
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowAddModal(false)}>
          <div style={{ width: '100%', maxWidth: 480, background: 'white', borderRadius: '28px 28px 0 0', padding: 24, maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Log Food</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#F5F5F5', border: 'none', borderRadius: 12, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} color="#888" /></button>
            </div>

            <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick Add Meals</div>
            {MY_MEALS.slice(0, 3).map(meal => (
              <div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 14, background: '#F0FDF4', marginBottom: 8, cursor: 'pointer', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{meal.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{meal.name}</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>{meal.totals.cal} kcal</div>
                  </div>
                </div>
                <ChevronRightIcon size={18} color={colors.primary} />
              </div>
            ))}

            <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, marginTop: 20, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Or search ingredients</div>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
              <input type="text" placeholder="Search foods..." style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: 14, border: '2px solid #F0F0F0', fontSize: 14, outline: 'none' }} />
            </div>

            {INVENTORY.slice(0, 5).map(food => (
              <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, background: '#FAFAFA', marginBottom: 6, cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: colors.textPrimary }}>{food.name}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>{food.serving}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{food.cal} kcal</div>
              </div>
            ))}

            <div style={{ textAlign: 'center', fontSize: 12, color: colors.textMuted, marginTop: 20 }}>
              Or use Claude: <span style={{ color: colors.primary, fontWeight: 600 }}>"food - chicken 200g, eggs 4"</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
