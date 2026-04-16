import React, { useState, useEffect, useRef } from 'react';
import { Plus, Coffee, Sun, Moon, Sparkles, X, Search, Check, Calendar, Target, Flame, TrendingDown, TrendingUp, ChevronLeft, ChevronRight, Package, UtensilsCrossed, Zap, Activity, Upload, Edit3, ArrowUpRight, ArrowDownRight, Minus, Award, Scale, Dumbbell, Percent, Heart, BarChart3, MessageCircle, Send, Bot, User, Loader, ShoppingBag, Utensils, Apple, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar, ComposedChart } from 'recharts';

// ============================================
// SWIGGY CALORIE TRACKER - PRODUCT CONCEPT
// Built by: Safdar | For: Swiggy Interview
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const API_URL = 'https://script.google.com/macros/s/AKfycbz7Q1BwDyF52fSea9GORdCM2m0c98aEDj6zKjYyFBC_iXEBbJpw-HHAO1CtG9GA_eFP/exec';

// User's personalized targets (configurable based on goals)
const USER_GOALS = {
  weightLoss: { calories: 1800, protein: 160, carbs: 130, fat: 55, label: 'Weight Loss' },
  maintenance: { calories: 2200, protein: 120, carbs: 220, fat: 70, label: 'Maintenance' },
  muscleGain: { calories: 2800, protein: 180, carbs: 300, fat: 80, label: 'Muscle Gain' },
};

const DEFAULT_GOAL = 'weightLoss';
const TARGETS = USER_GOALS[DEFAULT_GOAL];

// ============================================
// SWIGGY BRAND COLORS
// ============================================
const swiggyColors = {
  primary: '#FC8019',      // Swiggy Orange
  primaryDark: '#E67312',  // Darker orange
  primaryLight: '#FFF4E8', // Light orange bg
  secondary: '#3D4152',    // Dark gray text
  success: '#60B246',      // Green for success
  protein: '#60B246',      // Green
  carbs: '#5D8BF4',        // Blue
  fat: '#FC8019',          // Orange
  danger: '#E23744',       // Red
  purple: '#8B5CF6',
  bg: '#F8F8F8',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.06)',
  textPrimary: '#3D4152',
  textSecondary: '#7E808C',
  textMuted: '#93959F',
};

const colors = swiggyColors;

// ============================================
// MOCK DATA - Simulating Swiggy Orders (Last 10 days: April 7-16, 2026)
// ============================================
const RESTAURANT_INVENTORY = [
  { id: 1, name: 'Grilled Chicken Breast', restaurant: 'Eatfit', serving: '200g', cal: 330, p: 62, c: 0, f: 8, category: 'Protein', tags: ['high-protein', 'low-carb'] },
  { id: 2, name: 'Protein Power Bowl', restaurant: 'Bowl Company', serving: '1 bowl', cal: 485, p: 42, c: 35, f: 18, category: 'Bowls', tags: ['balanced', 'high-protein'] },
  { id: 3, name: 'Greek Yogurt Parfait', restaurant: 'Theobroma', serving: '1 serving', cal: 280, p: 18, c: 32, f: 10, category: 'Healthy', tags: ['breakfast', 'protein'] },
  { id: 4, name: 'Quinoa Salad Bowl', restaurant: 'Salad Days', serving: '1 bowl', cal: 320, p: 14, c: 45, f: 12, category: 'Salads', tags: ['vegan', 'fiber'] },
  { id: 5, name: 'Egg White Omelette', restaurant: 'SUSPENDED Eggs', serving: '3 eggs', cal: 150, p: 24, c: 2, f: 5, category: 'Protein', tags: ['low-cal', 'high-protein'] },
  { id: 6, name: 'Chicken Tikka', restaurant: 'Punjab Grill', serving: '6 pcs', cal: 280, p: 35, c: 8, f: 12, category: 'Indian', tags: ['high-protein', 'low-carb'] },
  { id: 7, name: 'Smoothie Bowl', restaurant: 'Smoothie Factory', serving: '1 bowl', cal: 350, p: 12, c: 52, f: 14, category: 'Healthy', tags: ['breakfast', 'fruits'] },
  { id: 8, name: 'Grilled Fish & Veggies', restaurant: 'Coastal Kitchen', serving: '1 plate', cal: 380, p: 45, c: 18, f: 16, category: 'Seafood', tags: ['high-protein', 'omega-3'] },
  { id: 9, name: 'Paneer Tikka', restaurant: 'Punjab Grill', serving: '6 pcs', cal: 320, p: 22, c: 12, f: 20, category: 'Indian', tags: ['vegetarian', 'protein'] },
  { id: 10, name: 'Caesar Salad', restaurant: 'Salad Days', serving: '1 bowl', cal: 380, p: 18, c: 22, f: 26, category: 'Salads', tags: ['classic', 'protein'] },
];

// 10 days of seed data: April 7-16, 2026
const SEED_DATA = {
  '2026-04-16': { 
    meals: [
      { slot: 'breakfast', time: '08:30', source: 'swiggy', restaurant: 'Bowl Company', orderId: 'SW016A', items: [{ name: 'Protein Power Bowl', qty: '1 bowl', cal: 485, p: 42, c: 35, f: 18 }] },
      { slot: 'lunch', time: '13:15', source: 'swiggy', restaurant: 'Eatfit', orderId: 'SW016B', items: [{ name: 'Grilled Chicken Breast', qty: '200g', cal: 330, p: 62, c: 0, f: 8 }, { name: 'Quinoa Salad', qty: '1', cal: 280, p: 12, c: 38, f: 10 }] },
    ] 
  },
  '2026-04-15': { 
    meals: [
      { slot: 'breakfast', time: '09:00', source: 'manual', items: [{ name: 'Eggs & Toast', qty: '4 eggs + 2 toast', cal: 420, p: 28, c: 32, f: 22 }] },
      { slot: 'lunch', time: '13:30', source: 'swiggy', restaurant: 'Punjab Grill', orderId: 'SW015A', items: [{ name: 'Chicken Tikka', qty: '6 pcs', cal: 280, p: 35, c: 8, f: 12 }, { name: 'Tandoori Roti', qty: '2', cal: 180, p: 6, c: 36, f: 2 }] },
      { slot: 'snack', time: '17:00', source: 'manual', items: [{ name: 'Protein Shake', qty: '1 scoop', cal: 130, p: 25, c: 3, f: 2 }] },
      { slot: 'dinner', time: '20:30', source: 'swiggy', restaurant: 'Coastal Kitchen', orderId: 'SW015B', items: [{ name: 'Grilled Fish & Veggies', qty: '1 plate', cal: 380, p: 45, c: 18, f: 16 }] },
    ] 
  },
  '2026-04-14': { 
    meals: [
      { slot: 'breakfast', time: '08:15', source: 'swiggy', restaurant: 'Bowl Company', orderId: 'SW014A', items: [{ name: 'Protein Power Bowl', qty: '1 bowl', cal: 485, p: 42, c: 35, f: 18 }] },
      { slot: 'lunch', time: '13:30', source: 'swiggy', restaurant: 'Eatfit', orderId: 'SW014B', items: [{ name: 'Grilled Chicken Salad', qty: '1', cal: 320, p: 38, c: 12, f: 14 }, { name: 'Quinoa Bowl', qty: '1', cal: 280, p: 12, c: 42, f: 8 }] },
      { slot: 'dinner', time: '20:00', source: 'swiggy', restaurant: 'Punjab Grill', orderId: 'SW014C', items: [{ name: 'Paneer Tikka', qty: '6 pcs', cal: 320, p: 22, c: 12, f: 20 }, { name: 'Dal Makhani', qty: '1 bowl', cal: 280, p: 12, c: 32, f: 14 }] },
    ] 
  },
  '2026-04-13': { 
    meals: [
      { slot: 'breakfast', time: '09:00', source: 'manual', items: [{ name: 'Home Cooked Eggs', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 }] },
      { slot: 'lunch', time: '13:00', source: 'swiggy', restaurant: 'Punjab Grill', orderId: 'SW013A', items: [{ name: 'Chicken Tikka', qty: '6 pcs', cal: 280, p: 35, c: 8, f: 12 }, { name: 'Tandoori Roti', qty: '2', cal: 180, p: 6, c: 36, f: 2 }] },
      { slot: 'dinner', time: '20:30', source: 'swiggy', restaurant: 'Eatfit', orderId: 'SW013B', items: [{ name: 'Grilled Fish & Veggies', qty: '1 plate', cal: 380, p: 45, c: 18, f: 16 }] },
    ] 
  },
  '2026-04-12': { 
    meals: [
      { slot: 'breakfast', time: '08:30', source: 'swiggy', restaurant: 'Theobroma', orderId: 'SW012A', items: [{ name: 'Greek Yogurt Parfait', qty: '1', cal: 280, p: 18, c: 32, f: 10 }] },
      { slot: 'lunch', time: '13:15', source: 'swiggy', restaurant: 'Bowl Company', orderId: 'SW012B', items: [{ name: 'Protein Power Bowl', qty: '1', cal: 485, p: 42, c: 35, f: 18 }] },
      { slot: 'snack', time: '17:00', source: 'manual', items: [{ name: 'Protein Shake', qty: '1', cal: 180, p: 25, c: 8, f: 4 }] },
      { slot: 'dinner', time: '20:00', source: 'swiggy', restaurant: 'Dominos', orderId: 'SW012C', items: [{ name: 'Margherita (Medium)', qty: '1', cal: 680, p: 28, c: 78, f: 28 }] },
    ] 
  },
  '2026-04-11': { 
    meals: [
      { slot: 'breakfast', time: '08:00', source: 'manual', items: [{ name: 'Oatmeal with Banana', qty: '1 bowl', cal: 320, p: 12, c: 58, f: 6 }] },
      { slot: 'lunch', time: '12:45', source: 'swiggy', restaurant: 'Salad Days', orderId: 'SW011A', items: [{ name: 'Caesar Salad', qty: '1 bowl', cal: 380, p: 18, c: 22, f: 26 }, { name: 'Grilled Chicken Add-on', qty: '100g', cal: 165, p: 31, c: 0, f: 4 }] },
      { slot: 'snack', time: '16:30', source: 'manual', items: [{ name: 'Greek Yogurt', qty: '150g', cal: 117, p: 12, c: 11, f: 3 }] },
      { slot: 'dinner', time: '20:15', source: 'swiggy', restaurant: 'Eatfit', orderId: 'SW011B', items: [{ name: 'Grilled Chicken Breast', qty: '200g', cal: 330, p: 62, c: 0, f: 8 }, { name: 'Steamed Veggies', qty: '1 portion', cal: 80, p: 4, c: 14, f: 2 }] },
    ] 
  },
  '2026-04-10': { 
    meals: [
      { slot: 'breakfast', time: '08:45', source: 'swiggy', restaurant: 'Smoothie Factory', orderId: 'SW010A', items: [{ name: 'Protein Smoothie Bowl', qty: '1', cal: 350, p: 18, c: 48, f: 10 }] },
      { slot: 'lunch', time: '13:00', source: 'swiggy', restaurant: 'Bowl Company', orderId: 'SW010B', items: [{ name: 'Protein Power Bowl', qty: '1', cal: 485, p: 42, c: 35, f: 18 }] },
      { slot: 'dinner', time: '19:30', source: 'swiggy', restaurant: 'Coastal Kitchen', orderId: 'SW010C', items: [{ name: 'Grilled Fish & Veggies', qty: '1 plate', cal: 380, p: 45, c: 18, f: 16 }] },
    ] 
  },
  '2026-04-09': { 
    meals: [
      { slot: 'breakfast', time: '09:15', source: 'manual', items: [{ name: 'Eggs & Chapati', qty: '3 eggs + 2 chapati', cal: 432, p: 24, c: 40, f: 22 }] },
      { slot: 'lunch', time: '13:30', source: 'swiggy', restaurant: 'Eatfit', orderId: 'SW009A', items: [{ name: 'Grilled Chicken Salad', qty: '1', cal: 320, p: 38, c: 12, f: 14 }] },
      { slot: 'snack', time: '17:30', source: 'manual', items: [{ name: 'Almonds', qty: '30g', cal: 175, p: 6, c: 6, f: 15 }] },
      { slot: 'dinner', time: '20:45', source: 'swiggy', restaurant: 'Punjab Grill', orderId: 'SW009B', items: [{ name: 'Chicken Tikka', qty: '6 pcs', cal: 280, p: 35, c: 8, f: 12 }, { name: 'Raita', qty: '1 bowl', cal: 80, p: 4, c: 6, f: 4 }] },
    ] 
  },
  '2026-04-08': { 
    meals: [
      { slot: 'breakfast', time: '08:00', source: 'swiggy', restaurant: 'Theobroma', orderId: 'SW008A', items: [{ name: 'Greek Yogurt Parfait', qty: '1', cal: 280, p: 18, c: 32, f: 10 }, { name: 'Black Coffee', qty: '1', cal: 5, p: 0, c: 1, f: 0 }] },
      { slot: 'lunch', time: '12:30', source: 'swiggy', restaurant: 'Salad Days', orderId: 'SW008B', items: [{ name: 'Quinoa Salad Bowl', qty: '1', cal: 320, p: 14, c: 45, f: 12 }, { name: 'Grilled Paneer', qty: '100g', cal: 265, p: 18, c: 4, f: 20 }] },
      { slot: 'dinner', time: '20:00', source: 'swiggy', restaurant: 'Bowl Company', orderId: 'SW008C', items: [{ name: 'Protein Power Bowl', qty: '1', cal: 485, p: 42, c: 35, f: 18 }] },
    ] 
  },
  '2026-04-07': { 
    meals: [
      { slot: 'breakfast', time: '09:00', source: 'manual', items: [{ name: 'Poha with Peanuts', qty: '1 plate', cal: 280, p: 8, c: 42, f: 10 }] },
      { slot: 'lunch', time: '13:15', source: 'swiggy', restaurant: 'Eatfit', orderId: 'SW007A', items: [{ name: 'Grilled Chicken Breast', qty: '200g', cal: 330, p: 62, c: 0, f: 8 }, { name: 'Brown Rice', qty: '150g', cal: 165, p: 4, c: 35, f: 1 }] },
      { slot: 'snack', time: '16:00', source: 'manual', items: [{ name: 'Protein Bar', qty: '1', cal: 200, p: 20, c: 22, f: 8 }] },
      { slot: 'dinner', time: '20:30', source: 'swiggy', restaurant: 'Coastal Kitchen', orderId: 'SW007B', items: [{ name: 'Grilled Fish & Veggies', qty: '1 plate', cal: 380, p: 45, c: 18, f: 16 }] },
    ] 
  },
};

// ============================================
// STYLES
// ============================================
const styles = {
  page: { minHeight: '100vh', background: colors.bg, paddingBottom: 100, fontFamily: "'Poppins', -apple-system, sans-serif" },
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' },
  headerInner: { maxWidth: 480, margin: '0 auto', padding: '14px 20px' },
  badge: { background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, color: 'white', fontSize: 10, fontWeight: 700, padding: '6px 12px', borderRadius: 6, letterSpacing: 0.5 },
  tabs: { display: 'flex', gap: 4, background: '#F0F0EE', borderRadius: 12, padding: 4 },
  tab: { flex: 1, padding: '10px 6px', borderRadius: 10, border: 'none', fontSize: 10, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.2s' },
  tabActive: { background: 'white', color: colors.textPrimary, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tabInactive: { background: 'transparent', color: colors.textSecondary },
  main: { maxWidth: 480, margin: '0 auto', padding: '20px' },
  card: { background: colors.card, borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}` },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 },
  cardIcon: { width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: 600, color: colors.textPrimary, letterSpacing: -0.3 },
  divider: { display: 'flex', alignItems: 'center', gap: 14, margin: '24px 0 16px' },
  dividerLine: { flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #E5E5E5, transparent)' },
  dividerText: { fontSize: 10, fontWeight: 600, color: colors.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' },
  fab: { position: 'fixed', bottom: 28, right: 28, width: 60, height: 60, borderRadius: 30, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(252,128,25,0.4)' },
  kpiCard: { background: colors.card, borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` },
  miniKpi: { background: '#FAFAFA', borderRadius: 12, padding: 12, textAlign: 'center' },
};

// ============================================
// HELPERS
// ============================================
const formatDateKey = (date) => {
  if (!date) return new Date().toISOString().split('T')[0];
  if (typeof date === 'string') return date.split('T')[0];
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return String(date).split('T')[0];
};

const formatDisplayDate = (date) => { 
  const today = new Date('2026-04-16'); 
  const dateStr = typeof date === 'string' ? date : formatDateKey(date);
  if (dateStr === '2026-04-16') return 'Today'; 
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); 
};

const getDayData = (allData, dateKey) => allData[dateKey] || { meals: [] };

// ============================================
// OFFICIAL SWIGGY LOGO COMPONENT (Location Pin with S cutout)
// Accurately traced from official logo
// ============================================
const SwiggyLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill={colors.primary}/>
    <path d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V14C24 14 20 16 16 16C12 16 8 14 8 14V12Z" fill="white"/>
    <path d="M8 16C8 16 12 18 16 18C20 18 24 16 24 16V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V16Z" fill="white"/>
  </svg>
);

// Small circular version for inline use (app icon style)
const SwiggyLogoSmall = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill={colors.primary}/>
    <path d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V14C24 14 20 16 16 16C12 16 8 14 8 14V12Z" fill="white"/>
    <path d="M8 16C8 16 12 18 16 18C20 18 24 16 24 16V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V16Z" fill="white"/>
  </svg>
);

// ============================================
// REUSABLE COMPONENTS
// ============================================
const ProgressRing = ({ value, max, size = 72, strokeWidth = 5, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - Math.min(value / max, 1) * circumference;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F1F1F1" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{value}{max < 500 ? 'g' : ''}</span>
        <span style={{ fontSize: 9, color: colors.textMuted }}>/ {max}{max < 500 ? 'g' : ''}</span>
      </div>
    </div>
  );
};

const MacroRing = ({ value, max, color, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
    <ProgressRing value={value} max={max} color={color} />
    <div style={{ marginTop: 10, textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color }}>{label}</div>
      <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 3 }}>{Math.round((value / max) * 100)}%</div>
    </div>
  </div>
);

const MacroPills = ({ p, c, f }) => (
  <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
    <span style={{ color: colors.protein, fontWeight: 600 }}>P{Math.round(p)}</span>
    <span style={{ color: '#DDD' }}>·</span>
    <span style={{ color: colors.carbs, fontWeight: 600 }}>C{Math.round(c)}</span>
    <span style={{ color: '#DDD' }}>·</span>
    <span style={{ color: colors.fat, fontWeight: 600 }}>F{Math.round(f)}</span>
  </div>
);

// ============================================
// SWIGGY ORDER CARD (Shows Swiggy branding)
// ============================================
const SwiggyOrderCard = ({ meal, icon: Icon, iconBg, title }) => {
  const totals = meal?.items?.reduce((a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }), { cal: 0, p: 0, c: 0, f: 0 }) || { cal: 0, p: 0, c: 0, f: 0 };
  if (!meal?.items?.length) return null;
  
  const isSwiggyOrder = meal.source === 'swiggy';
  
  return (
    <div style={{ background: colors.card, borderRadius: 18, padding: 18, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 12, color: colors.textSecondary }}>{meal.time}</span>
              {isSwiggyOrder && (
                <>
                  <span style={{ color: '#DDD' }}>·</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <SwiggyLogoSmall size={14} />
                    <span style={{ fontSize: 11, color: colors.primary, fontWeight: 600 }}>{meal.restaurant}</span>
                  </div>
                </>
              )}
              {!isSwiggyOrder && (
                <>
                  <span style={{ color: '#DDD' }}>·</span>
                  <span style={{ fontSize: 11, color: colors.textMuted }}>Manual</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{totals.cal} kcal</div>
          <MacroPills p={totals.p} c={totals.c} f={totals.f} />
        </div>
      </div>
      <div style={{ borderTop: '1px solid #F5F5F5', paddingTop: 12 }}>
        {meal.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
            <span style={{ color: '#555' }}>{item.name}</span>
            <span style={{ color: colors.textMuted }}>{item.qty}</span>
          </div>
        ))}
      </div>
      {isSwiggyOrder && meal.orderId && (
        <div style={{ 
          marginTop: 12, 
          padding: '8px 12px', 
          background: colors.primaryLight, 
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11, color: colors.primary }}>Order #{meal.orderId}</span>
          <span style={{ fontSize: 11, color: colors.primaryDark, fontWeight: 600 }}>Auto-tracked ✓</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// SMART RECOMMENDATIONS (Based on remaining calories)
// ============================================
const SmartRecommendations = ({ remaining, inventory }) => {
  const generateRecommendations = () => {
    const recs = [];
    const foods = inventory || RESTAURANT_INVENTORY;
    
    if (remaining.cal <= 200) {
      return [{ type: 'complete', message: "You're close to your daily target! Great job! 🎉" }];
    }
    
    const fittingMeals = foods.filter(f => f.cal <= remaining.cal + 100);
    
    if (remaining.p > 30) {
      const highProtein = fittingMeals
        .filter(f => f.p >= 25)
        .sort((a, b) => (b.p / b.cal) - (a.p / a.cal))
        .slice(0, 2);
      
      highProtein.forEach(meal => {
        recs.push({
          type: 'protein',
          meal: meal,
          reason: `High protein (${meal.p}g) to hit your goal`,
          tag: '💪 Protein Pick',
        });
      });
    }
    
    if (remaining.cal < 600 && remaining.cal > 200) {
      const lowCal = fittingMeals
        .filter(f => f.cal <= 400)
        .sort((a, b) => a.cal - b.cal)
        .slice(0, 2);
      
      lowCal.forEach(meal => {
        if (!recs.find(r => r.meal?.id === meal.id)) {
          recs.push({
            type: 'lowcal',
            meal: meal,
            reason: `Light option at ${meal.cal} kcal`,
            tag: '🥗 Light Meal',
          });
        }
      });
    }
    
    if (remaining.cal >= 400) {
      const balanced = fittingMeals
        .filter(f => f.tags?.includes('balanced'))
        .slice(0, 1);
      
      balanced.forEach(meal => {
        if (!recs.find(r => r.meal?.id === meal.id)) {
          recs.push({
            type: 'balanced',
            meal: meal,
            reason: 'Well-balanced macros',
            tag: '⚖️ Balanced',
          });
        }
      });
    }
    
    return recs.slice(0, 3);
  };
  
  const recommendations = generateRecommendations();
  
  if (remaining.cal <= 0) {
    return (
      <div style={{ ...styles.card, background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', border: 'none' }}>
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: colors.success }}>Daily target reached!</div>
          <div style={{ fontSize: 13, color: '#065F46', marginTop: 8 }}>Great discipline today. Keep it up!</div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ marginTop: 8 }}>
      <div style={styles.divider}>
        <div style={styles.dividerLine}></div>
        <span style={styles.dividerText}>Recommended for You</span>
        <div style={styles.dividerLine}></div>
      </div>
      
      {/* Remaining Summary */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.primaryLight}, #FFEDD5)`, 
        borderRadius: 16, 
        padding: 16, 
        marginBottom: 16,
        border: `1px solid ${colors.primary}30`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Target size={16} color={colors.primary} />
          <span style={{ fontSize: 13, fontWeight: 700, color: colors.primaryDark }}>Budget Remaining</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.primaryDark }}>{Math.max(0, Math.round(remaining.cal))}</div>
            <div style={{ fontSize: 10, color: colors.primary }}>kcal</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.protein }}>{Math.max(0, Math.round(remaining.p))}g</div>
            <div style={{ fontSize: 10, color: colors.primary }}>protein</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.carbs }}>{Math.max(0, Math.round(remaining.c))}g</div>
            <div style={{ fontSize: 10, color: colors.primary }}>carbs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.fat }}>{Math.max(0, Math.round(remaining.f))}g</div>
            <div style={{ fontSize: 10, color: colors.primary }}>fat</div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      {recommendations.filter(r => r.meal).map((rec, idx) => (
        <div key={idx} style={{
          background: colors.card,
          borderRadius: 18,
          padding: 16,
          marginBottom: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.primary, marginBottom: 4 }}>{rec.tag}</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{rec.meal.name}</div>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{rec.meal.restaurant}</div>
            </div>
            <div style={{ background: colors.primaryLight, padding: '6px 12px', borderRadius: 8, textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>{rec.meal.cal}</div>
              <div style={{ fontSize: 9, color: colors.primaryDark }}>kcal</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <MacroPills p={rec.meal.p} c={rec.meal.c} f={rec.meal.f} />
            <div style={{ fontSize: 11, color: colors.textMuted }}>{rec.meal.serving}</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} color={colors.primary} />
            <span style={{ fontSize: 12, color: colors.textSecondary }}>{rec.reason}</span>
          </div>
          
          <button style={{
            width: '100%',
            marginTop: 14,
            padding: '12px',
            borderRadius: 10,
            border: 'none',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            color: 'white',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <ShoppingBag size={16} />
            Order on Swiggy
          </button>
        </div>
      ))}
      
      <div style={{ textAlign: 'center', fontSize: 11, color: colors.textMuted, padding: '8px 0 20px' }}>
        💡 Recommendations based on your remaining calorie budget
      </div>
    </div>
  );
};

// ============================================
// ONGOING SUMMARY CHART
// ============================================
const OngoingSummary = ({ allData, selectedDate, targets }) => {
  const startDate = new Date('2026-04-07');
  const currentDate = typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate;
  const currentDayNumber = Math.max(1, Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
  
  const generateDailyData = () => {
    const data = [];
    
    for (let day = 1; day <= Math.min(currentDayNumber, 10); day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day - 1);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayData = allData[dateKey] || { meals: [] };
      const meals = dayData.meals || [];
      
      const totals = meals.reduce((acc, meal) => {
        (meal.items || []).forEach(item => {
          acc.cal += item.cal || 0;
          acc.p += item.p || 0;
          acc.c += item.c || 0;
          acc.f += item.f || 0;
        });
        return acc;
      }, { cal: 0, p: 0, c: 0, f: 0 });
      
      data.push({
        day: day,
        label: `D${day}`,
        date: dateKey,
        calories: Math.round(totals.cal),
        protein: Math.round(totals.p),
        carbs: Math.round(totals.c),
        fat: Math.round(totals.f),
      });
    }
    
    return data;
  };
  
  const chartData = generateDailyData();
  
  if (chartData.length < 2) return null;
  
  return (
    <div style={{ marginTop: 24 }}>
      <div style={styles.divider}>
        <div style={styles.dividerLine}></div>
        <span style={styles.dividerText}>Your Progress</span>
        <div style={styles.dividerLine}></div>
      </div>
      
      <div style={{
        background: colors.card,
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.primaryLight}, #FFEDD5)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrendingUp size={16} color={colors.primary} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
            10-Day Trends
          </span>
        </div>
        
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: colors.textMuted }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="calories" orientation="left" tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} domain={[0, 'dataMax + 200']} />
              <YAxis yAxisId="macros" orientation="right" tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} domain={[0, 'dataMax + 20']} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ background: 'white', padding: '12px 16px', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Day {payload[0]?.payload?.day}</p>
                        {payload.map((p, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '3px 0' }}>
                            <span style={{ fontSize: 11, color: colors.textSecondary }}>{p.name}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: p.color }}>{p.value}{p.name === 'Calories' ? '' : 'g'}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line yAxisId="calories" type="monotone" dataKey="calories" stroke={colors.primary} strokeWidth={2.5} dot={{ r: 4, fill: colors.primary }} name="Calories" />
              <Line yAxisId="macros" type="monotone" dataKey="protein" stroke={colors.protein} strokeWidth={2.5} dot={{ r: 4, fill: colors.protein }} name="Protein" />
              <Line yAxisId="macros" type="monotone" dataKey="carbs" stroke={colors.carbs} strokeWidth={2.5} dot={{ r: 4, fill: colors.carbs }} name="Carbs" />
              <Line yAxisId="macros" type="monotone" dataKey="fat" stroke={colors.fat} strokeWidth={2.5} dot={{ r: 4, fill: colors.fat }} name="Fat" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 3, background: colors.primary, borderRadius: 2 }}></div>
            <span style={{ fontSize: 10, color: colors.textSecondary }}>Calories</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 3, background: colors.protein, borderRadius: 2 }}></div>
            <span style={{ fontSize: 10, color: colors.textSecondary }}>Protein</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 3, background: colors.carbs, borderRadius: 2 }}></div>
            <span style={{ fontSize: 10, color: colors.textSecondary }}>Carbs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 3, background: colors.fat, borderRadius: 2 }}></div>
            <span style={{ fontSize: 10, color: colors.textSecondary }}>Fat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD TAB
// ============================================
const DashboardTab = ({ allData, selectedDate, setSelectedDate, inventoryData }) => {
  const dateKey = formatDateKey(selectedDate);
  const dayData = getDayData(allData, dateKey);
  const meals = dayData.meals || [];
  
  const totals = meals.reduce((acc, meal) => { 
    (meal.items || []).forEach(item => { 
      acc.cal += item.cal || 0; 
      acc.p += item.p || 0; 
      acc.c += item.c || 0; 
      acc.f += item.f || 0; 
    }); 
    return acc; 
  }, { cal: 0, p: 0, c: 0, f: 0 });
  
  const remaining = {
    cal: TARGETS.calories - totals.cal,
    p: TARGETS.protein - totals.p,
    c: TARGETS.carbs - totals.c,
    f: TARGETS.fat - totals.f,
  };
  
  const swiggyOrders = meals.filter(m => m.source === 'swiggy').length;
  const manualEntries = meals.filter(m => m.source !== 'swiggy').length;

  return (
    <>
      {/* Date Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#F5F5F3', borderRadius: 12, padding: '8px 12px', marginBottom: 20 }}>
        <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18} color="#666" /></button>
        <div style={{ minWidth: 120, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{formatDisplayDate(selectedDate)}</div>
        <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={18} color="#666" /></button>
      </div>

      {/* Goal Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ 
          background: colors.primaryLight, 
          padding: '8px 16px', 
          borderRadius: 20, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          border: `1px solid ${colors.primary}30`,
        }}>
          <Target size={14} color={colors.primary} />
          <span style={{ fontSize: 12, fontWeight: 600, color: colors.primary }}>
            Goal: {USER_GOALS[DEFAULT_GOAL].label} · {TARGETS.calories} kcal/day
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 14 }}>
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <SwiggyLogoSmall size={16} />
            <span style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Swiggy Orders</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: colors.primary }}>{swiggyOrders}</div>
          <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>Auto-tracked today</div>
        </div>
        
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Edit3 size={12} color={colors.textSecondary} />
            <span style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Manual</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: colors.textSecondary }}>{manualEntries}</div>
          <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>Logged manually</div>
        </div>
      </div>

      {/* Targets Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: `linear-gradient(135deg, ${colors.primaryLight}, #FFEDD5)` }}>
            <Target size={16} color={colors.primary} />
          </div>
          <span style={styles.cardTitle}>Daily Targets</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
          <div><div style={{ fontSize: 22, fontWeight: 700 }}>{TARGETS.calories}</div><div style={{ fontSize: 10, color: colors.textMuted }}>kcal</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 700, color: colors.protein }}>{TARGETS.protein}g</div><div style={{ fontSize: 10, color: colors.textMuted }}>protein</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 700, color: colors.carbs }}>{TARGETS.carbs}g</div><div style={{ fontSize: 10, color: colors.textMuted }}>carbs</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 700, color: colors.fat }}>{TARGETS.fat}g</div><div style={{ fontSize: 10, color: colors.textMuted }}>fat</div></div>
        </div>
      </div>

      {/* Progress Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: `linear-gradient(135deg, ${colors.primaryLight}, #FFEDD5)` }}>
            <Flame size={16} color={colors.primary} />
          </div>
          <span style={styles.cardTitle}>Today's Progress</span>
        </div>
        {totals.cal > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <MacroRing value={totals.cal} max={TARGETS.calories} color={colors.primary} label="Calories" />
            <MacroRing value={Math.round(totals.p)} max={TARGETS.protein} color={colors.protein} label="Protein" />
            <MacroRing value={Math.round(totals.c)} max={TARGETS.carbs} color={colors.carbs} label="Carbs" />
            <MacroRing value={Math.round(totals.f)} max={TARGETS.fat} color={colors.fat} label="Fat" />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: colors.textMuted }}>
            <div style={{ fontSize: 32 }}>🍽️</div>
            <div style={{ marginTop: 12 }}>No meals tracked yet</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>Order on Swiggy to auto-track!</div>
          </div>
        )}
      </div>

      {/* Meals */}
      {meals.length > 0 && (
        <>
          <div style={styles.divider}><div style={styles.dividerLine}></div><span style={styles.dividerText}>Today's Meals</span><div style={styles.dividerLine}></div></div>
          <SwiggyOrderCard meal={meals.find(m => m.slot === 'breakfast')} icon={Coffee} iconBg="linear-gradient(135deg, #FCD34D, #F59E0B)" title="Breakfast" />
          <SwiggyOrderCard meal={meals.find(m => m.slot === 'lunch')} icon={Sun} iconBg="linear-gradient(135deg, #60A5FA, #3B82F6)" title="Lunch" />
          <SwiggyOrderCard meal={meals.find(m => m.slot === 'snack')} icon={Apple} iconBg="linear-gradient(135deg, #F472B6, #EC4899)" title="Snack" />
          <SwiggyOrderCard meal={meals.find(m => m.slot === 'dinner')} icon={Moon} iconBg="linear-gradient(135deg, #A78BFA, #8B5CF6)" title="Dinner" />
        </>
      )}
      
      {/* Smart Recommendations */}
      <SmartRecommendations remaining={remaining} inventory={inventoryData} />
      
      {/* Progress Chart */}
      <OngoingSummary allData={allData} selectedDate={selectedDate} targets={TARGETS} />
    </>
  );
};

// ============================================
// DISCOVER TAB (Restaurant Inventory)
// ============================================
const DiscoverTab = ({ data }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  
  const inventory = data || RESTAURANT_INVENTORY;
  
  const categories = ['All', ...new Set(inventory.map(i => i.category))];
  const filtered = inventory.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) && 
    (filter === 'All' || i.category === filter)
  );
  
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>
          Discover Healthy Options
        </h2>
        <p style={{ fontSize: 13, color: colors.textSecondary }}>
          Browse calorie-counted meals from your favorite restaurants
        </p>
      </div>
      
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
        <input 
          type="text" 
          placeholder="Search dishes..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: 14, border: '2px solid #F0F0F0', fontSize: 14, outline: 'none' }} 
        />
      </div>
      
      {/* Categories */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
        {categories.map(c => (
          <button 
            key={c} 
            onClick={() => setFilter(c)} 
            style={{ 
              padding: '8px 16px', 
              borderRadius: 20, 
              border: 'none', 
              fontSize: 12, 
              fontWeight: 600, 
              background: filter === c ? colors.primary : '#F0F0F0', 
              color: filter === c ? 'white' : colors.textSecondary, 
              cursor: 'pointer', 
              whiteSpace: 'nowrap' 
            }}
          >
            {c}
          </button>
        ))}
      </div>
      
      {/* Results */}
      <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 12 }}>{filtered.length} dishes</div>
      
      {filtered.map(item => (
        <div key={item.id} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: 16, 
          borderRadius: 16, 
          background: '#FAFAFA', 
          marginBottom: 8, 
          border: '1px solid #F0F0F0' 
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: colors.primary, fontWeight: 500, marginBottom: 4 }}>{item.restaurant}</div>
            <div style={{ fontSize: 11, color: colors.textMuted }}>{item.serving}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {item.tags?.map((tag, i) => (
                <span key={i} style={{ fontSize: 9, padding: '3px 8px', borderRadius: 4, background: colors.primaryLight, color: colors.primary }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{item.cal}</div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>kcal</div>
            <MacroPills p={item.p} c={item.c} f={item.f} />
          </div>
        </div>
      ))}
    </>
  );
};

// ============================================
// INSIGHTS TAB
// ============================================
const InsightsTab = ({ allData }) => {
  const dates = Object.keys(allData).sort().slice(-10);
  
  const weeklyTotals = dates.map(date => {
    const dayData = allData[date] || { meals: [] };
    const meals = dayData.meals || [];
    return meals.reduce((acc, meal) => {
      (meal.items || []).forEach(item => {
        acc.cal += item.cal || 0;
        acc.p += item.p || 0;
        acc.swiggyOrders += meal.source === 'swiggy' ? 1 : 0;
      });
      return acc;
    }, { cal: 0, p: 0, swiggyOrders: 0 });
  });
  
  const avgCal = Math.round(weeklyTotals.reduce((a, b) => a + b.cal, 0) / dates.length);
  const avgProtein = Math.round(weeklyTotals.reduce((a, b) => a + b.p, 0) / dates.length);
  const totalSwiggyOrders = weeklyTotals.reduce((a, b) => a + b.swiggyOrders, 0);
  
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>
          Your Insights
        </h2>
        <p style={{ fontSize: 13, color: colors.textSecondary }}>
          10-day summary and patterns
        </p>
      </div>
      
      {/* Weekly Summary */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: `linear-gradient(135deg, ${colors.primaryLight}, #FFEDD5)` }}>
            <BarChart3 size={16} color={colors.primary} />
          </div>
          <span style={styles.cardTitle}>Last 10 Days</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ ...styles.miniKpi, background: colors.primaryLight }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>{avgCal}</div>
            <div style={{ fontSize: 10, color: colors.primaryDark, marginTop: 4 }}>Avg kcal/day</div>
          </div>
          <div style={{ ...styles.miniKpi, background: '#F0FDF4' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.protein }}>{avgProtein}g</div>
            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>Avg protein</div>
          </div>
          <div style={{ ...styles.miniKpi, background: colors.primaryLight }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>{totalSwiggyOrders}</div>
            <div style={{ fontSize: 10, color: colors.primaryDark, marginTop: 4 }}>Swiggy orders</div>
          </div>
        </div>
      </div>
      
      {/* Goal Progress */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' }}>
            <Award size={16} color={colors.success} />
          </div>
          <span style={styles.cardTitle}>Goal: {USER_GOALS[DEFAULT_GOAL].label}</span>
        </div>
        <div style={{ padding: 16, background: '#FAFAFA', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>Daily calorie target</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{TARGETS.calories} kcal</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>Avg daily intake</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: avgCal <= TARGETS.calories ? colors.success : colors.danger }}>{avgCal} kcal</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>Status</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.success }}>
              {avgCal <= TARGETS.calories ? '✓ On track' : '⚠️ Over target'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Subscription Upsell */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, 
        borderRadius: 20, 
        padding: 24,
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>👑</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Swiggy Health+</div>
        <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 16 }}>
          Get personalized meal plans, priority recommendations, and detailed nutrition insights
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>₹149<span style={{ fontSize: 14, fontWeight: 500 }}>/month</span></div>
        <button style={{
          padding: '12px 32px',
          borderRadius: 25,
          border: 'none',
          background: 'white',
          color: colors.primary,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}>
          Upgrade to Premium
        </button>
      </div>
    </>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function SwiggyCalorieTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allData, setAllData] = useState(SEED_DATA);
  const [selectedDate, setSelectedDate] = useState('2026-04-16');
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Flame },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`* { font-family: 'Poppins', -apple-system, sans-serif; box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { display: none; }`}</style>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            {/* Left: Swiggy Logo + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SwiggyLogo size={28} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: colors.primary, letterSpacing: 1 }}>SWIGGY</span>
                  <span style={{ 
                    background: colors.primary, 
                    color: 'white', 
                    fontSize: 9, 
                    fontWeight: 700, 
                    padding: '3px 8px', 
                    borderRadius: 4,
                    letterSpacing: 0.5,
                  }}>CALORIE TRACKER</span>
                </div>
              </div>
            </div>
            
            {/* Right: Sync Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                background: '#F0FDF4', 
                padding: '6px 12px', 
                borderRadius: 20, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.success }}></div>
                <span style={{ fontSize: 11, fontWeight: 600, color: colors.success }}>Synced</span>
              </div>
            </div>
          </div>
          <div style={styles.tabs}>
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : styles.tabInactive) }}
              >
                <tab.icon size={14} />{tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {activeTab === 'dashboard' && (
          <DashboardTab 
            allData={allData} 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
            inventoryData={RESTAURANT_INVENTORY} 
          />
        )}
        {activeTab === 'discover' && <DiscoverTab data={RESTAURANT_INVENTORY} />}
        {activeTab === 'insights' && <InsightsTab allData={allData} />}
      </main>

      {/* Add Manual Entry FAB */}
      <button onClick={() => setShowAddModal(true)} style={styles.fab}>
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowAddModal(false)}>
          <div style={{ width: '100%', maxWidth: 480, background: 'white', borderRadius: '28px 28px 0 0', padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Log Meal</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#F5F5F5', border: 'none', borderRadius: 12, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color="#888" />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button style={{ 
                flex: 1, 
                padding: 16, 
                borderRadius: 14, 
                border: `2px solid ${colors.primary}`, 
                background: colors.primaryLight, 
                color: colors.primary, 
                fontSize: 13, 
                fontWeight: 600, 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}>
                <SwiggyLogoSmall size={24} />
                <span>From Swiggy Order</span>
              </button>
              <button style={{ 
                flex: 1, 
                padding: 16, 
                borderRadius: 14, 
                border: '2px solid #E5E5E5', 
                background: 'white', 
                color: colors.textSecondary, 
                fontSize: 13, 
                fontWeight: 600, 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}>
                <Edit3 size={24} />
                <span>Manual Entry</span>
              </button>
            </div>
            
            <div style={{ 
              background: colors.primaryLight, 
              borderRadius: 12, 
              padding: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <Clock size={20} color={colors.primary} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.primaryDark }}>Auto-Tracking Active</div>
                <div style={{ fontSize: 11, color: colors.primary }}>Your Swiggy orders are automatically logged!</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}