import React, { useState, useEffect } from 'react';
import { Plus, Coffee, Sun, Moon, Sparkles, X, Search, Check, Calendar, Target, Flame, TrendingDown, TrendingUp, ChevronLeft, ChevronRight, Package, UtensilsCrossed, Zap, Activity, Upload, Edit3, ArrowUpRight, ArrowDownRight, Minus, Award, Scale, Dumbbell, Percent, Heart, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar, ComposedChart } from 'recharts';

// ============================================
// CONFIGURATION
// ============================================
const API_URL = 'https://script.google.com/macros/s/AKfycbzJbxTQY_I6zpuR0oBP5tNhRqSNSDYKVYWc_1yIZlqFjoiv3WsbIWfLAwhmSdte1us/exec';
const TARGETS = { calories: 1800, protein: 160, carbs: 130, fat: 55 };
const TARGET_BF = { min: 10, max: 12 }; // Abs visibility target

// ============================================
// DATA FETCHING FROM GOOGLE SHEETS
// ============================================
const fetchFromSheet = async (action) => {
  try {
    const response = await fetch(`${API_URL}?action=${action}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return null;
  }
};

const fetchAllData = async () => {
  try {
    const response = await fetch(`${API_URL}?action=getAllData`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all data:', error);
    return null;
  }
};

const postToSheet = async (action, payload) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action, ...payload }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting to Google Sheets:', error);
    return null;
  }
};

// ============================================
// INBODY DATA (Parsed from CSV - 31 measurements)
// ============================================
const INBODY_HISTORY = [
  { date: '2024-02-26', weight: 74.1, muscle: 36.0, fat: 11.4, fatPct: 15.4, bmr: 1725, score: 80, protein: 4.15, mineral: 3.42, rightArm: 3.72, leftArm: 3.63, trunk: 28.7, rightLeg: 9.71, leftLeg: 9.63, visceralLevel: 4, whr: 0.91 },
  { date: '2024-03-03', weight: 73.6, muscle: 36.5, fat: 10.4, fatPct: 14.1, bmr: 1736, score: 81, protein: 4.26, mineral: 3.49, rightArm: 3.68, leftArm: 3.60, trunk: 28.6, rightLeg: 9.86, leftLeg: 9.82, visceralLevel: 3, whr: 0.89 },
  { date: '2024-05-24', weight: 76.6, muscle: 38.4, fat: 10.1, fatPct: 13.1, bmr: 1807, score: 84, protein: 4.40, mineral: 3.61, rightArm: 3.97, leftArm: 3.92, trunk: 30.2, rightLeg: 10.06, leftLeg: 10.01, visceralLevel: 3, whr: 0.89 },
  { date: '2024-07-27', weight: 75.8, muscle: 37.1, fat: 11.5, fatPct: 15.1, bmr: 1760, score: 82, protein: 4.28, mineral: 3.55, rightArm: 3.69, leftArm: 3.69, trunk: 28.9, rightLeg: 10.05, leftLeg: 9.88, visceralLevel: 4, whr: 0.89 },
  { date: '2024-07-27', weight: 74.9, muscle: 37.8, fat: 9.5, fatPct: 12.7, bmr: 1782, score: 83, protein: 4.38, mineral: 3.52, rightArm: 3.86, leftArm: 3.87, trunk: 29.8, rightLeg: 10.13, leftLeg: 9.98, visceralLevel: 3, whr: 0.89 },
  { date: '2024-08-31', weight: 73.0, muscle: 35.7, fat: 10.9, fatPct: 14.9, bmr: 1712, score: 81, protein: 4.15, mineral: 3.42, rightArm: 3.61, leftArm: 3.57, trunk: 28.2, rightLeg: 9.57, leftLeg: 9.48, visceralLevel: 4, whr: 0.90 },
  { date: '2024-11-04', weight: 75.4, muscle: 37.6, fat: 10.1, fatPct: 13.4, bmr: 1780, score: 83, protein: 4.28, mineral: 3.52, rightArm: 3.91, leftArm: 3.87, trunk: 29.9, rightLeg: 9.97, leftLeg: 9.99, visceralLevel: 3, whr: 0.89 },
  { date: '2024-11-09', weight: 74.7, muscle: 37.6, fat: 9.5, fatPct: 12.7, bmr: 1779, score: 85, protein: 4.28, mineral: 3.52, rightArm: 3.90, leftArm: 3.93, trunk: 29.8, rightLeg: 9.60, leftLeg: 9.55, visceralLevel: 3, whr: 0.89 },
  { date: '2024-11-13', weight: 75.9, muscle: 38.6, fat: 9.0, fatPct: 11.8, bmr: 1816, score: 85, protein: 4.30, mineral: 3.56, rightArm: 4.10, leftArm: 4.14, trunk: 31.0, rightLeg: 10.00, leftLeg: 9.94, visceralLevel: 3, whr: 0.90 },
  { date: '2024-11-18', weight: 74.5, muscle: 35.2, fat: 12.9, fatPct: 17.3, bmr: 1701, score: 79, protein: 4.04, mineral: null, rightArm: 3.68, leftArm: 3.72, trunk: 28.8, rightLeg: 9.57, leftLeg: 9.51, visceralLevel: 5, whr: null },
  { date: '2024-11-20', weight: 74.1, muscle: 37.6, fat: 9.1, fatPct: 12.3, bmr: 1774, score: 83, protein: 4.18, mineral: 3.45, rightArm: 3.88, leftArm: 3.92, trunk: 30.0, rightLeg: 10.01, leftLeg: 9.88, visceralLevel: 3, whr: 0.89 },
  { date: '2025-04-14', weight: 74.0, muscle: 37.5, fat: 8.8, fatPct: 11.9, bmr: 1778, score: 83, protein: 4.29, mineral: 3.52, rightArm: 3.89, leftArm: 3.85, trunk: 29.7, rightLeg: 9.97, leftLeg: 9.86, visceralLevel: 3, whr: 0.87 },
  { date: '2025-04-26', weight: 73.3, muscle: 37.5, fat: 8.2, fatPct: 11.2, bmr: 1776, score: 82, protein: 4.28, mineral: 3.48, rightArm: 3.96, leftArm: 3.92, trunk: 30.2, rightLeg: 10.03, leftLeg: 9.91, visceralLevel: 2, whr: 0.89 },
  { date: '2025-05-02', weight: 74.2, muscle: 37.0, fat: 9.7, fatPct: 13.1, bmr: 1762, score: 83, protein: 4.38, mineral: 3.53, rightArm: 3.78, leftArm: 3.78, trunk: 29.2, rightLeg: 9.99, leftLeg: 9.92, visceralLevel: 3, whr: 0.88 },
  { date: '2025-05-08', weight: 75.5, muscle: 38.0, fat: 9.2, fatPct: 12.1, bmr: 1803, score: 84, protein: 4.40, mineral: 3.69, rightArm: 3.81, leftArm: 3.77, trunk: 29.1, rightLeg: 10.40, leftLeg: 10.21, visceralLevel: 3, whr: 0.83 },
  { date: '2025-05-30', weight: 76.3, muscle: 38.0, fat: 10.3, fatPct: 13.5, bmr: 1795, score: 84, protein: 4.39, mineral: 3.64, rightArm: 3.84, leftArm: 3.81, trunk: 29.5, rightLeg: 10.28, leftLeg: 10.21, visceralLevel: 3, whr: 0.86 },
  { date: '2025-06-02', weight: 76.1, muscle: 38.3, fat: 9.5, fatPct: 12.5, bmr: 1808, score: 85, protein: 4.50, mineral: 3.68, rightArm: 3.91, leftArm: 3.86, trunk: 29.8, rightLeg: 10.19, leftLeg: 10.11, visceralLevel: 3, whr: 0.86 },
  { date: '2025-06-15', weight: 75.4, muscle: 37.1, fat: 11.0, fatPct: 14.6, bmr: 1761, score: 82, protein: 4.27, mineral: 3.53, rightArm: 3.74, leftArm: 3.73, trunk: 29.1, rightLeg: 10.10, leftLeg: 10.00, visceralLevel: 4, whr: 0.88 },
  { date: '2025-08-30', weight: 75.3, muscle: 37.2, fat: 10.8, fatPct: 14.3, bmr: 1764, score: 83, protein: 4.18, mineral: 3.40, rightArm: 3.95, leftArm: 3.93, trunk: 30.2, rightLeg: 9.85, leftLeg: 9.78, visceralLevel: 4, whr: 0.92 },
  { date: '2025-09-07', weight: 76.2, muscle: 38.0, fat: 9.9, fatPct: 13.0, bmr: 1801, score: 84, protein: 4.30, mineral: 3.51, rightArm: 4.07, leftArm: 4.05, trunk: 30.7, rightLeg: 10.11, leftLeg: 9.93, visceralLevel: 4, whr: 0.90 },
  { date: '2025-09-09', weight: 75.3, muscle: 36.0, fat: 12.0, fatPct: 16.0, bmr: 1737, score: 80, protein: 4.26, mineral: 3.46, rightArm: 3.61, leftArm: 3.56, trunk: 28.2, rightLeg: 10.49, leftLeg: 10.23, visceralLevel: 4, whr: 0.86 },
  { date: '2025-09-25', weight: 76.9, muscle: 37.2, fat: 11.6, fatPct: 15.1, bmr: 1780, score: 83, protein: 4.39, mineral: 3.58, rightArm: 3.75, leftArm: 3.72, trunk: 29.0, rightLeg: 10.43, leftLeg: 10.30, visceralLevel: 4, whr: 0.86 },
  { date: '2025-10-22', weight: 78.8, muscle: 38.0, fat: 12.5, fatPct: 15.9, bmr: 1802, score: 84, protein: 4.39, mineral: 3.55, rightArm: 4.04, leftArm: 4.01, trunk: 30.6, rightLeg: 10.20, leftLeg: 10.15, visceralLevel: 5, whr: 0.91 },
  { date: '2025-10-27', weight: 78.5, muscle: 38.3, fat: 12.2, fatPct: 15.6, bmr: 1802, score: 84, protein: 4.40, mineral: 3.55, rightArm: 4.05, leftArm: 4.00, trunk: 30.6, rightLeg: 9.91, leftLeg: 9.80, visceralLevel: 5, whr: 0.94 },
  { date: '2026-02-21', weight: 79.9, muscle: 39.0, fat: 12.6, fatPct: 15.7, bmr: 1824, score: 85, protein: 4.41, mineral: 3.64, rightArm: 4.07, leftArm: 4.00, trunk: 30.8, rightLeg: 9.94, leftLeg: 9.97, visceralLevel: 5, whr: 0.93 },
  { date: '2026-03-01', weight: 80.1, muscle: 39.0, fat: 12.6, fatPct: 15.7, bmr: 1829, score: 85, protein: 4.52, mineral: 3.69, rightArm: 4.00, leftArm: 3.98, trunk: 30.5, rightLeg: 10.24, leftLeg: 10.22, visceralLevel: 5, whr: 0.90 },
  { date: '2026-03-04', weight: 79.8, muscle: 38.0, fat: 13.8, fatPct: 17.3, bmr: 1796, score: 82, protein: 4.39, mineral: 3.66, rightArm: 3.87, leftArm: 3.80, trunk: 29.6, rightLeg: 10.21, leftLeg: 10.20, visceralLevel: 5, whr: 0.90 },
  { date: '2026-03-05', weight: 81.3, muscle: 39.0, fat: 13.4, fatPct: 16.5, bmr: 1837, score: 85, protein: 4.42, mineral: 3.65, rightArm: 4.05, leftArm: 4.04, trunk: 30.6, rightLeg: 10.55, leftLeg: 10.62, visceralLevel: 5, whr: 0.89 },
  { date: '2026-03-12', weight: 78.9, muscle: 39.1, fat: 11.2, fatPct: 14.2, bmr: 1831, score: 86, protein: 4.41, mineral: 3.59, rightArm: 4.18, leftArm: 4.18, trunk: 31.4, rightLeg: 9.95, leftLeg: 9.97, visceralLevel: 4, whr: 0.93 },
  { date: '2026-03-23', weight: 79.8, muscle: 38.3, fat: 13.2, fatPct: 16.6, bmr: 1808, score: 83, protein: 4.40, mineral: 3.61, rightArm: 3.95, leftArm: 3.96, trunk: 30.3, rightLeg: 10.24, leftLeg: 10.23, visceralLevel: 5, whr: 0.91 },
  { date: '2026-03-31', weight: 79.3, muscle: 38.5, fat: 12.7, fatPct: 16.0, bmr: 1808, score: 84, protein: 4.50, mineral: 3.67, rightArm: 3.86, leftArm: 3.87, trunk: 29.9, rightLeg: 10.14, leftLeg: 10.15, visceralLevel: 5, whr: 0.90 },
].sort((a, b) => new Date(a.date) - new Date(b.date));

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

const MY_MEALS = [
  { id: 1, name: 'Power Lunch', emoji: '💪', description: '4 eggs + chicken + rice + yogurt', items: [{ name: 'Eggs (Omelette)', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 }, { name: 'Chicken Boneless', qty: '150g', cal: 248, p: 47, c: 0, f: 6 }, { name: 'Rice (Basmati)', qty: '200g', cal: 260, p: 6, c: 56, f: 1 }, { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }], totals: { cal: 874, p: 85, c: 65, f: 29 }, timesUsed: 3 },
  { id: 2, name: 'Protein Shake', emoji: '🥤', description: 'Banana + milk + whey', items: [{ name: 'Banana', qty: '76g', cal: 68, p: 1, c: 17, f: 0 }, { name: 'Milk', qty: '250ml', cal: 150, p: 8, c: 12, f: 8 }, { name: 'NakPro Whey', qty: '1 scoop', cal: 130, p: 25, c: 3, f: 2 }], totals: { cal: 348, p: 34, c: 32, f: 10 }, timesUsed: 2 },
  { id: 3, name: 'Quick Breakfast', emoji: '☕', description: 'Just black coffee', items: [{ name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }], totals: { cal: 5, p: 0, c: 0, f: 0 }, timesUsed: 3 },
  { id: 4, name: 'Heavy Dinner', emoji: '🍗', description: '200g chicken + rice + eggs + yogurt', items: [{ name: 'Chicken Boneless', qty: '200g', cal: 330, p: 62, c: 0, f: 8 }, { name: 'Rice (Basmati)', qty: '200g', cal: 260, p: 6, c: 56, f: 1 }, { name: 'Eggs (Omelette)', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 }, { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }], totals: { cal: 956, p: 100, c: 65, f: 31 }, timesUsed: 1 },
  { id: 5, name: 'Roti Meal', emoji: '🫓', description: '2 chapati + 4 eggs omelette', items: [{ name: 'iD Fresh Chapati', qty: '2 pcs', cal: 216, p: 6, c: 40, f: 4 }, { name: 'Eggs (Omelette)', qty: '4 eggs', cal: 288, p: 24, c: 2, f: 20 }], totals: { cal: 504, p: 30, c: 42, f: 24 }, timesUsed: 1 },
  { id: 6, name: 'Light Dinner', emoji: '🌙', description: 'Chicken + eggs + rice + yogurt', items: [{ name: 'Chicken Boneless', qty: '133g', cal: 219, p: 41, c: 0, f: 5 }, { name: 'Eggs (Omelette)', qty: '2 eggs', cal: 144, p: 12, c: 1, f: 10 }, { name: 'Rice (Basmati)', qty: '104g', cal: 135, p: 3, c: 29, f: 0 }, { name: 'Greek Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }], totals: { cal: 576, p: 64, c: 37, f: 17 }, timesUsed: 1 },
];

const SEED_DATA = {
  '2026-04-10': { meals: [{ slot: 'breakfast', time: '08:00', items: [{ name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }] }, { slot: 'lunch', time: '13:00', items: [{ name: 'Chapati', qty: '2 pcs', cal: 216, p: 6, c: 40, f: 4 }, { name: 'Eggs', qty: '4', cal: 288, p: 24, c: 2, f: 20 }] }, { slot: 'dinner', time: '20:00', items: [{ name: 'Rice', qty: '200g', cal: 260, p: 6, c: 56, f: 1 }, { name: 'Chicken', qty: '200g', cal: 330, p: 62, c: 0, f: 8 }, { name: 'Eggs', qty: '4', cal: 288, p: 24, c: 2, f: 20 }, { name: 'Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }] }] },
  '2026-04-11': { meals: [{ slot: 'breakfast', time: '08:00', items: [{ name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }] }, { slot: 'lunch', time: '14:22', items: [{ name: 'Rice', qty: '210g', cal: 273, p: 6, c: 59, f: 1 }, { name: 'Chicken', qty: '150g', cal: 248, p: 47, c: 0, f: 6 }, { name: 'Eggs', qty: '4', cal: 288, p: 24, c: 2, f: 20 }, { name: 'Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }] }, { slot: 'dinner', time: '20:00', items: [{ name: 'Chicken', qty: '133g', cal: 219, p: 41, c: 0, f: 5 }, { name: 'Eggs', qty: '2', cal: 144, p: 12, c: 1, f: 10 }, { name: 'Rice', qty: '104g', cal: 135, p: 3, c: 29, f: 0 }, { name: 'Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }, { name: 'Banana', qty: '76g', cal: 68, p: 1, c: 17, f: 0 }, { name: 'Milk', qty: '250ml', cal: 150, p: 8, c: 12, f: 8 }, { name: 'Whey', qty: '1 scoop', cal: 130, p: 25, c: 3, f: 2 }] }] },
  '2026-04-12': { meals: [{ slot: 'breakfast', time: '08:00', items: [{ name: 'Black Coffee', qty: '1 cup', cal: 5, p: 0, c: 0, f: 0 }] }, { slot: 'lunch', time: '13:00', items: [{ name: 'Eggs', qty: '4', cal: 288, p: 24, c: 2, f: 20 }, { name: 'Chicken', qty: '150g', cal: 248, p: 47, c: 0, f: 6 }, { name: 'Rice', qty: '200g', cal: 260, p: 6, c: 56, f: 1 }, { name: 'Yogurt', qty: '100g', cal: 78, p: 8, c: 7, f: 2 }] }, { slot: 'snack', time: '17:00', items: [{ name: 'Banana', qty: '76g', cal: 68, p: 1, c: 17, f: 0 }, { name: 'Milk', qty: '250ml', cal: 150, p: 8, c: 12, f: 8 }, { name: 'Whey', qty: '1 scoop', cal: 130, p: 25, c: 3, f: 2 }] }] }
};

// ============================================
// COLORS & STYLES
// ============================================
const colors = {
  primary: '#22C55E', protein: '#22C55E', carbs: '#3B82F6', fat: '#F97316',
  danger: '#EF4444', purple: '#8B5CF6', pink: '#EC4899', yellow: '#F59E0B',
  teal: '#14B8A6', indigo: '#6366F1',
  bg: '#F8F8F6', card: '#FFFFFF', border: 'rgba(0,0,0,0.04)',
  textPrimary: '#1a1a1a', textSecondary: '#888', textMuted: '#AAA',
};

const styles = {
  page: { minHeight: '100vh', background: colors.bg, paddingBottom: 100 },
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' },
  headerInner: { maxWidth: 480, margin: '0 auto', padding: '14px 20px' },
  badge: { background: `linear-gradient(135deg, ${colors.danger}, #DC2626)`, color: 'white', fontSize: 10, fontWeight: 700, padding: '6px 12px', borderRadius: 6, letterSpacing: 0.8, textTransform: 'uppercase' },
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
  fab: { position: 'fixed', bottom: 28, right: 28, width: 60, height: 60, borderRadius: 30, background: `linear-gradient(135deg, ${colors.primary}, #16A34A)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(34,197,94,0.4)' },
  kpiCard: { background: colors.card, borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` },
  miniKpi: { background: '#FAFAFA', borderRadius: 12, padding: 12, textAlign: 'center' },
};

// ============================================
// HELPERS
// ============================================
const formatDateKey = (date) => date.toISOString().split('T')[0];
const formatDisplayDate = (date) => { const today = new Date(); if (formatDateKey(date) === formatDateKey(today)) return 'Today'; return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };
const getDayNumber = (date) => { const startDate = new Date('2026-04-10'); return Math.max(1, Math.floor((date - startDate) / (1000 * 60 * 60 * 24)) + 1); };
const STORAGE_KEY = 'cutPhaseTracker';
const loadAllData = () => { try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch (e) {} return SEED_DATA; };
const getDayData = (allData, dateKey) => allData[dateKey] || { meals: [] };

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

const TrendIndicator = ({ value, good = 'down', showValue = true }) => {
  if (Math.abs(value) < 0.05) return <span style={{ fontSize: 11, color: colors.textMuted }}>—</span>;
  const isGood = (good === 'down' && value < 0) || (good === 'up' && value > 0);
  const Icon = value > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: isGood ? colors.primary : colors.danger }}>
      <Icon size={14} />
      {showValue && <span style={{ fontSize: 11, fontWeight: 600 }}>{Math.abs(value).toFixed(1)}</span>}
    </div>
  );
};

const MealCard = ({ meal, icon: Icon, iconBg, title }) => {
  const totals = meal?.items?.reduce((a, i) => ({ cal: a.cal + i.cal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }), { cal: 0, p: 0, c: 0, f: 0 }) || { cal: 0, p: 0, c: 0, f: 0 };
  if (!meal?.items?.length) return null;
  return (
    <div style={{ background: colors.card, borderRadius: 18, padding: 18, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} color="white" /></div>
          <div><div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div><div style={{ fontSize: 12, color: colors.textSecondary }}>{meal.time}</div></div>
        </div>
        <div style={{ textAlign: 'right' }}><div style={{ fontSize: 15, fontWeight: 700 }}>{totals.cal} kcal</div><MacroPills p={totals.p} c={totals.c} f={totals.f} /></div>
      </div>
      <div style={{ borderTop: '1px solid #F5F5F5', paddingTop: 12 }}>
        {meal.items.map((item, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}><span style={{ color: '#555' }}>{item.name}</span><span style={{ color: colors.textMuted }}>{item.qty}</span></div>))}
      </div>
    </div>
  );
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', padding: '10px 14px', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: 'none' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: 11, color: p.color, margin: '2px 0' }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================
// INBODY TAB - COMPREHENSIVE
// ============================================
const InBodyTab = ({ data }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [chartView, setChartView] = useState('composition'); // composition, muscle, trends
  
  // Use passed data or fallback to hardcoded
  const inbodyHistory = data && data.length > 0 ? data : INBODY_HISTORY;
  
  const current = inbodyHistory[inbodyHistory.length - 1];
  const previous = inbodyHistory[inbodyHistory.length - 2] || current;
  const first = inbodyHistory[0];
  
  // Calculate changes
  const changes = {
    weight: current.weight - previous.weight,
    muscle: current.muscle - previous.muscle,
    fat: current.fat - previous.fat,
    fatPct: current.fatPct - previous.fatPct,
    score: current.score - previous.score,
  };
  
  // Journey totals
  const journey = {
    muscle: current.muscle - first.muscle,
    fat: current.fat - first.fat,
    weight: current.weight - first.weight,
  };
  
  // Personal records
  const records = {
    lowestFatPct: Math.min(...inbodyHistory.map(d => d.fatPct)),
    highestMuscle: Math.max(...inbodyHistory.map(d => d.muscle)),
    highestScore: Math.max(...inbodyHistory.map(d => d.score)),
    lowestWeight: Math.min(...inbodyHistory.map(d => d.weight)),
    highestWeight: Math.max(...inbodyHistory.map(d => d.weight)),
  };
  
  // Fat to lose for abs
  const fatToLose = current.fat - (current.weight * (TARGET_BF.max / 100));
  const weeksToGoal = Math.ceil(fatToLose / 0.5); // 0.5kg fat loss per week
  
  // Chart data - last 12 measurements
  const chartData = inbodyHistory.slice(-12).map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    leanMass: d.weight - d.fat,
  }));
  
  // Body composition for current
  const composition = {
    muscle: ((current.muscle / current.weight) * 100).toFixed(1),
    fat: current.fatPct,
    other: (100 - ((current.muscle / current.weight) * 100) - current.fatPct).toFixed(1),
  };

  return (
    <>
      {/* Last Measurement Date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ background: '#F0FDF4', padding: '8px 16px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={14} color={colors.primary} />
          <span style={{ fontSize: 12, fontWeight: 600, color: colors.primary }}>
            Last scan: {new Date(current.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <span style={{ fontSize: 11, color: colors.textMuted }}>{inbodyHistory.length} total</span>
      </div>

      {/* Main KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 14 }}>
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Scale size={12} color={colors.carbs} />
                <span style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Weight</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.carbs }}>{current.weight}<span style={{ fontSize: 14, color: colors.textMuted }}> kg</span></div>
            </div>
            <TrendIndicator value={changes.weight} good="down" />
          </div>
          <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 6 }}>Range: {records.lowestWeight} - {records.highestWeight} kg</div>
        </div>
        
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Percent size={12} color={colors.fat} />
                <span style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Body Fat</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.fat }}>{current.fatPct}<span style={{ fontSize: 14, color: colors.textMuted }}> %</span></div>
            </div>
            <TrendIndicator value={changes.fatPct} good="down" />
          </div>
          <div style={{ fontSize: 10, color: colors.primary, marginTop: 6, fontWeight: 600 }}>Target: {TARGET_BF.min}-{TARGET_BF.max}%</div>
        </div>
        
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Dumbbell size={12} color={colors.primary} />
                <span style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Muscle</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.primary }}>{current.muscle}<span style={{ fontSize: 14, color: colors.textMuted }}> kg</span></div>
            </div>
            <TrendIndicator value={changes.muscle} good="up" />
          </div>
          <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 6 }}>Best: {records.highestMuscle} kg</div>
        </div>
        
        <div style={styles.kpiCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Award size={12} color={colors.purple} />
                <span style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Score</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: colors.purple }}>{current.score}<span style={{ fontSize: 14, color: colors.textMuted }}> pts</span></div>
            </div>
            <TrendIndicator value={changes.score} good="up" />
          </div>
          <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 6 }}>Best: {records.highestScore} pts</div>
        </div>
      </div>

      {/* Goal Progress Card - Fixed visualization */}
      <div style={{ ...styles.card, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Target size={22} color={colors.yellow} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>Cut Goal: {TARGET_BF.min}-{TARGET_BF.max}% Body Fat</div>
            <div style={{ fontSize: 12, color: '#B45309', marginTop: 4 }}>
              {fatToLose.toFixed(1)} kg fat to lose → ~{weeksToGoal} weeks at 0.5kg/week
            </div>
          </div>
        </div>
        
        {/* Visual scale showing current position relative to goal */}
        <div style={{ marginTop: 16, position: 'relative' }}>
          {/* Scale labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 10, color: '#92400E' }}>
            <span>20%</span>
            <span>15%</span>
            <span style={{ color: colors.primary, fontWeight: 700 }}>🎯 10-12%</span>
          </div>
          
          {/* Track */}
          <div style={{ position: 'relative', height: 12, background: 'rgba(255,255,255,0.6)', borderRadius: 6, overflow: 'visible' }}>
            {/* Goal zone highlight (10-12%) */}
            <div style={{ 
              position: 'absolute', 
              right: 0, 
              width: `${((20 - TARGET_BF.max) / (20 - TARGET_BF.min)) * 100 * ((20 - TARGET_BF.min) / 20)}%`,
              height: '100%', 
              background: `linear-gradient(90deg, ${colors.primary}40, ${colors.primary}60)`,
              borderRadius: '0 6px 6px 0',
            }}></div>
            
            {/* Current position marker */}
            <div style={{ 
              position: 'absolute', 
              left: `${Math.max(0, Math.min(100, ((20 - current.fatPct) / (20 - TARGET_BF.min)) * 100))}%`, 
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 20, 
              height: 20, 
              background: colors.fat,
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            </div>
          </div>
          
          {/* Current value label */}
          <div style={{ 
            marginTop: 8, 
            textAlign: 'center',
          }}>
            <span style={{ 
              background: colors.fat, 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: 12, 
              fontSize: 12, 
              fontWeight: 700 
            }}>
              Now: {current.fatPct}%
            </span>
            <span style={{ 
              marginLeft: 8,
              fontSize: 11, 
              color: '#92400E',
              fontWeight: 600
            }}>
              → {(current.fatPct - TARGET_BF.max).toFixed(1)}% to go
            </span>
          </div>
        </div>
      </div>

      {/* Journey Stats */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)' }}><TrendingUp size={16} color={colors.carbs} /></div>
          <span style={styles.cardTitle}>Your 2-Year Journey</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ ...styles.miniKpi, background: '#F0FDF4' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>+{journey.muscle.toFixed(1)}</div>
            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>kg muscle</div>
          </div>
          <div style={{ ...styles.miniKpi, background: journey.fat < 0 ? '#F0FDF4' : '#FEF2F2' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: journey.fat < 0 ? colors.primary : colors.danger }}>{journey.fat > 0 ? '+' : ''}{journey.fat.toFixed(1)}</div>
            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>kg fat</div>
          </div>
          <div style={{ ...styles.miniKpi, background: '#F5F3FF' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.purple }}>{inbodyHistory.length}</div>
            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>scans</div>
          </div>
        </div>
      </div>

      {/* Chart Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[
          { id: 'composition', label: 'Body Comp' },
          { id: 'muscle', label: 'Muscle' },
          { id: 'trends', label: 'All Trends' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setChartView(tab.id)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 600,
            background: chartView === tab.id ? colors.primary : '#F0F0F0',
            color: chartView === tab.id ? 'white' : colors.textSecondary,
            cursor: 'pointer'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Charts */}
      {chartView === 'composition' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #FED7AA, #FDBA74)' }}><BarChart3 size={16} color="#EA580C" /></div>
            <span style={styles.cardTitle}>Weight vs Fat Trend</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} domain={[8, 20]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="weight" fill={colors.carbs} radius={[4, 4, 0, 0]} name="Weight (kg)" opacity={0.8} />
                <Line yAxisId="right" type="monotone" dataKey="fatPct" stroke={colors.fat} strokeWidth={3} dot={{ r: 4, fill: colors.fat }} name="Body Fat (%)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, background: colors.carbs, borderRadius: 3 }}></div><span style={{ fontSize: 11, color: colors.textSecondary }}>Weight</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 3, background: colors.fat, borderRadius: 2 }}></div><span style={{ fontSize: 11, color: colors.textSecondary }}>Body Fat %</span></div>
          </div>
        </div>
      )}

      {chartView === 'muscle' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' }}><Dumbbell size={16} color={colors.primary} /></div>
            <span style={styles.cardTitle}>Muscle Mass Trend</span>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="muscleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="muscle" stroke={colors.primary} strokeWidth={2} fill="url(#muscleGrad)" name="Muscle (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartView === 'trends' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)' }}><Activity size={16} color={colors.indigo} /></div>
            <span style={styles.cardTitle}>All Metrics Over Time</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: colors.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="weight" stroke={colors.carbs} strokeWidth={2} dot={{ r: 3 }} name="Weight" />
                <Line type="monotone" dataKey="muscle" stroke={colors.primary} strokeWidth={2} dot={{ r: 3 }} name="Muscle" />
                <Line type="monotone" dataKey="fat" stroke={colors.fat} strokeWidth={2} dot={{ r: 3 }} name="Fat Mass" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 3, background: colors.carbs, borderRadius: 2 }}></div><span style={{ fontSize: 10, color: colors.textSecondary }}>Weight</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 3, background: colors.primary, borderRadius: 2 }}></div><span style={{ fontSize: 10, color: colors.textSecondary }}>Muscle</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 3, background: colors.fat, borderRadius: 2 }}></div><span style={{ fontSize: 10, color: colors.textSecondary }}>Fat</span></div>
          </div>
        </div>
      )}

      {/* Personal Records */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}><Award size={16} color={colors.yellow} /></div>
          <span style={styles.cardTitle}>Personal Records</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ ...styles.miniKpi, background: '#F0FDF4' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>{records.lowestFatPct}%</div>
            <div style={{ fontSize: 9, color: colors.textSecondary, marginTop: 4 }}>Lowest Fat</div>
          </div>
          <div style={{ ...styles.miniKpi, background: '#F0FDF4' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>{records.highestMuscle} kg</div>
            <div style={{ fontSize: 9, color: colors.textSecondary, marginTop: 4 }}>Peak Muscle</div>
          </div>
          <div style={{ ...styles.miniKpi, background: '#F5F3FF' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.purple }}>{records.highestScore}</div>
            <div style={{ fontSize: 9, color: colors.textSecondary, marginTop: 4 }}>Best Score</div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)' }}><Heart size={16} color={colors.pink} /></div>
          <span style={styles.cardTitle}>Additional Metrics</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <div style={{ padding: 14, background: '#FAFAFA', borderRadius: 12 }}>
            <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>BMR (Basal Metabolic Rate)</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>{current.bmr} <span style={{ fontSize: 12, color: colors.textMuted }}>kcal</span></div>
          </div>
          <div style={{ padding: 14, background: '#FAFAFA', borderRadius: 12 }}>
            <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>Visceral Fat Level</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: current.visceralLevel <= 4 ? colors.primary : colors.fat }}>{current.visceralLevel} <span style={{ fontSize: 12, color: colors.textMuted }}>/ 10</span></div>
          </div>
          <div style={{ padding: 14, background: '#FAFAFA', borderRadius: 12 }}>
            <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>Protein Mass</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>{current.protein} <span style={{ fontSize: 12, color: colors.textMuted }}>kg</span></div>
          </div>
          <div style={{ padding: 14, background: '#FAFAFA', borderRadius: 12 }}>
            <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>Waist-Hip Ratio</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: current.whr <= 0.90 ? colors.primary : colors.fat }}>{current.whr || '—'}</div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)' }}><Calendar size={16} color={colors.purple} /></div>
          <span style={styles.cardTitle}>Measurement History</span>
        </div>
        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', position: 'sticky', top: 0 }}>
                <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 600, color: colors.textSecondary }}>Date</th>
                <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600, color: colors.carbs }}>Wt</th>
                <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600, color: colors.primary }}>Msc</th>
                <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600, color: colors.fat }}>BF%</th>
                <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600, color: colors.purple }}>Scr</th>
              </tr>
            </thead>
            <tbody>
              {[...inbodyHistory].reverse().map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ padding: '8px 6px', color: colors.textPrimary }}>{new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</td>
                  <td style={{ padding: '8px 6px', textAlign: 'right' }}>{row.weight}</td>
                  <td style={{ padding: '8px 6px', textAlign: 'right' }}>{row.muscle}</td>
                  <td style={{ padding: '8px 6px', textAlign: 'right' }}>{row.fatPct}%</td>
                  <td style={{ padding: '8px 6px', textAlign: 'right' }}>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Button */}
      <button onClick={() => setShowAddModal(true)} style={{ width: '100%', padding: 16, borderRadius: 14, border: `2px dashed ${colors.primary}`, background: '#F0FDF4', color: colors.primary, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Plus size={18} /> Add New Measurement
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowAddModal(false)}>
          <div style={{ width: '100%', maxWidth: 480, background: 'white', borderRadius: '28px 28px 0 0', padding: 24, maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Add InBody Measurement</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#F5F5F5', border: 'none', borderRadius: 12, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} color="#888" /></button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <button style={{ flex: 1, padding: 14, borderRadius: 12, border: `2px solid ${colors.primary}`, background: '#F0FDF4', color: colors.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Edit3 size={16} /> Manual Entry</button>
              <button style={{ flex: 1, padding: 14, borderRadius: 12, border: '2px solid #E5E5E5', background: 'white', color: colors.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Upload size={16} /> Upload CSV</button>
            </div>

            <div style={{ background: '#F0F9FF', borderRadius: 12, padding: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0369A1', marginBottom: 6 }}>💡 Tip: Export from InBody App</div>
              <div style={{ fontSize: 11, color: '#0284C7', lineHeight: 1.5 }}>Open InBody app → Results → Export → Choose CSV format</div>
            </div>

            <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>Core Metrics</div>
            
            {[
              { label: 'Date', type: 'date', placeholder: '2026-04-12' },
              { label: 'Weight (kg)', type: 'number', placeholder: '79.3' },
              { label: 'Skeletal Muscle Mass (kg)', type: 'number', placeholder: '38.5' },
              { label: 'Body Fat Mass (kg)', type: 'number', placeholder: '12.7' },
              { label: 'Percent Body Fat (%)', type: 'number', placeholder: '16.0' },
              { label: 'BMR (kcal)', type: 'number', placeholder: '1808' },
              { label: 'InBody Score', type: 'number', placeholder: '84' },
            ].map((field, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: colors.textSecondary, display: 'block', marginBottom: 6 }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} style={{ width: '100%', padding: 12, borderRadius: 10, border: '2px solid #F0F0F0', fontSize: 14, outline: 'none' }} />
              </div>
            ))}

            <button style={{ width: '100%', padding: 16, borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${colors.primary}, #16A34A)`, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>Save Measurement</button>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================
// OTHER TABS (Simplified for brevity)
// ============================================
const DashboardTab = ({ allData, selectedDate, setSelectedDate, inbodyData }) => {
  const dateKey = formatDateKey(selectedDate);
  const dayData = getDayData(allData, dateKey);
  const meals = dayData.meals || [];
  const dayNumber = getDayNumber(selectedDate);
  const totals = meals.reduce((acc, meal) => { (meal.items || []).forEach(item => { acc.cal += item.cal || 0; acc.p += item.p || 0; acc.c += item.c || 0; acc.f += item.f || 0; }); return acc; }, { cal: 0, p: 0, c: 0, f: 0 });
  
  // Use passed inbody data or fallback
  const inbody = inbodyData && inbodyData.length > 0 ? inbodyData : INBODY_HISTORY;
  const current = inbody[inbody.length - 1];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#F5F5F3', borderRadius: 12, padding: '8px 12px', marginBottom: 20 }}>
        <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18} color="#666" /></button>
        <div style={{ minWidth: 120, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{formatDisplayDate(selectedDate)}</div>
        <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={18} color="#666" /></button>
        <span style={{ fontSize: 11, fontWeight: 600, color: colors.primary, background: '#F0FDF4', padding: '4px 10px', borderRadius: 6 }}>Day {dayNumber}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div style={styles.kpiCard}><div style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Body Fat</div><div style={{ fontSize: 28, fontWeight: 700, color: colors.fat, marginTop: 4 }}>{current.fatPct}%</div><div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>Target: 10-12%</div></div>
        <div style={styles.kpiCard}><div style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Muscle</div><div style={{ fontSize: 28, fontWeight: 700, color: colors.primary, marginTop: 4 }}>{current.muscle} kg</div><div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>Preserve during cut</div></div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}><div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #FEE2E2, #FECACA)' }}><Target size={16} color={colors.danger} /></div><span style={styles.cardTitle}>Cut Targets</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
          <div><div style={{ fontSize: 22, fontWeight: 700 }}>1,800</div><div style={{ fontSize: 10, color: colors.textMuted }}>kcal</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 700, color: colors.protein }}>160g</div><div style={{ fontSize: 10, color: colors.textMuted }}>protein</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 700, color: colors.carbs }}>130g</div><div style={{ fontSize: 10, color: colors.textMuted }}>carbs</div></div>
          <div><div style={{ fontSize: 22, fontWeight: 700, color: colors.fat }}>55g</div><div style={{ fontSize: 10, color: colors.textMuted }}>fat</div></div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}><div style={{ ...styles.cardIcon, background: 'linear-gradient(135deg, #FED7AA, #FDBA74)' }}><Flame size={16} color="#EA580C" /></div><span style={styles.cardTitle}>Day {dayNumber} Progress</span></div>
        {totals.cal > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <MacroRing value={totals.cal} max={TARGETS.calories} color={colors.primary} label="Calories" />
            <MacroRing value={Math.round(totals.p)} max={TARGETS.protein} color={colors.protein} label="Protein" />
            <MacroRing value={Math.round(totals.c)} max={TARGETS.carbs} color={colors.carbs} label="Carbs" />
            <MacroRing value={Math.round(totals.f)} max={TARGETS.fat} color={colors.fat} label="Fat" />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: colors.textMuted }}><div style={{ fontSize: 32 }}>🍽️</div><div style={{ marginTop: 12 }}>No meals logged</div></div>
        )}
      </div>

      {meals.length > 0 && (
        <>
          <div style={styles.divider}><div style={styles.dividerLine}></div><span style={styles.dividerText}>Meals</span><div style={styles.dividerLine}></div></div>
          <MealCard meal={meals.find(m => m.slot === 'breakfast')} icon={Coffee} iconBg="linear-gradient(135deg, #FCD34D, #F59E0B)" title="Breakfast" />
          <MealCard meal={meals.find(m => m.slot === 'lunch')} icon={Sun} iconBg="linear-gradient(135deg, #60A5FA, #3B82F6)" title="Lunch" />
          <MealCard meal={meals.find(m => m.slot === 'snack')} icon={Sparkles} iconBg="linear-gradient(135deg, #F472B6, #EC4899)" title="Snack" />
          <MealCard meal={meals.find(m => m.slot === 'dinner')} icon={Moon} iconBg="linear-gradient(135deg, #A78BFA, #8B5CF6)" title="Dinner" />
        </>
      )}
    </>
  );
};

const InventoryTab = ({ data }) => {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  
  // Use passed data or fallback to hardcoded
  const inventory = data && data.length > 0 ? data : INVENTORY;
  
  const cats = ['All', ...new Set(inventory.map(i => i.category))];
  const filtered = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) && (cat === 'All' || i.category === cat));
  const catColors = { Protein: { bg: '#F0FDF4', text: colors.primary }, Carbs: { bg: '#EFF6FF', text: colors.carbs }, Dairy: { bg: '#FFF7ED', text: colors.fat }, Beverages: { bg: '#F5F3FF', text: colors.purple }, Fruits: { bg: '#FDF2F8', text: colors.pink }, Supplements: { bg: '#FEF3C7', text: colors.yellow }, Other: { bg: '#F5F5F5', text: colors.textSecondary } };
  return (
    <>
      <div style={{ position: 'relative', marginBottom: 16 }}><Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} /><input type="text" placeholder="Search ingredients..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '14px 14px 14px 46px', borderRadius: 14, border: '2px solid #F0F0F0', fontSize: 14, outline: 'none' }} /></div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>{cats.map(c => (<button key={c} onClick={() => setCat(c)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600, background: cat === c ? colors.primary : '#F0F0F0', color: cat === c ? 'white' : colors.textSecondary, cursor: 'pointer', whiteSpace: 'nowrap' }}>{c}</button>))}</div>
      <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 12 }}>{filtered.length} ingredients</div>
      {filtered.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, background: '#FAFAFA', marginBottom: 8, border: '1px solid #F0F0F0' }}>
          <div><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.name}</div><div style={{ fontSize: 12, color: colors.textMuted }}>{item.brand !== '-' && `${item.brand} · `}{item.serving}</div><span style={{ fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: catColors[item.category]?.bg, color: catColors[item.category]?.text, marginTop: 8, display: 'inline-block' }}>{item.category}</span></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: 18, fontWeight: 700 }}>{item.cal}</div><div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>kcal</div><MacroPills p={item.p} c={item.c} f={item.f} /></div>
        </div>
      ))}
    </>
  );
};

const MyMealsTab = ({ data }) => {
  const [expanded, setExpanded] = useState(null);
  
  // Use passed data or fallback to hardcoded
  const meals = data && data.length > 0 ? data : MY_MEALS;
  
  return (
    <>
      <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 20 }}>Your favorite meal combos. Tap to expand.</div>
      {meals.map(meal => (
        <div key={meal.id} onClick={() => setExpanded(expanded === meal.id ? null : meal.id)} style={{ background: colors.card, borderRadius: 18, padding: 18, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 14 }}><div style={{ fontSize: 32 }}>{meal.emoji}</div><div><div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{meal.name}</div><div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>{meal.description}</div><MacroPills p={meal.totals?.p || 0} c={meal.totals?.c || 0} f={meal.totals?.f || 0} /></div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 20, fontWeight: 800 }}>{meal.totals?.cal || 0}</div><div style={{ fontSize: 11, color: colors.textMuted }}>kcal</div></div>
          </div>
          {expanded === meal.id && (<div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F0F0F0' }}>{(meal.items || []).map((item, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}><span>{item.name}</span><span style={{ color: colors.textMuted }}>{item.qty} · {item.cal} kcal</span></div>))}<button style={{ width: '100%', marginTop: 16, padding: 14, borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${colors.primary}, #16A34A)`, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Zap size={16} /> Quick Add</button></div>)}
        </div>
      ))}
    </>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function CutPhaseDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allData, setAllData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date('2026-04-12'));
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Google Sheets data state
  const [sheetData, setSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Fetch data from Google Sheets on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllData();
        if (data && !data.error) {
          setSheetData(data);
          setIsConnected(true);
          setLastSync(new Date());
          console.log('✅ Connected to Google Sheets!', data);
        } else {
          console.log('⚠️ Using local fallback data');
          setIsConnected(false);
        }
      } catch (error) {
        console.error('❌ Failed to fetch from Google Sheets:', error);
        setIsConnected(false);
      }
      setIsLoading(false);
    };
    
    loadData();
    setAllData(loadAllData());
  }, []);

  // Use Google Sheets data if available, otherwise use local constants
  const inbodyData = sheetData?.inbody?.length > 0 
    ? sheetData.inbody.map(row => ({
        date: row.date,
        weight: parseFloat(row.weight) || 0,
        muscle: parseFloat(row.muscle) || 0,
        fat: parseFloat(row.fat) || 0,
        fatPct: parseFloat(row.fatPct) || 0,
        bmr: parseInt(row.bmr) || 0,
        score: parseInt(row.score) || 0,
        protein: parseFloat(row.protein) || 0,
        mineral: parseFloat(row.mineral) || 0,
        visceralLevel: parseInt(row.visceralLevel) || 0,
      })).sort((a, b) => new Date(a.date) - new Date(b.date))
    : INBODY_HISTORY;

  const inventoryData = sheetData?.inventory?.length > 0 
    ? sheetData.inventory.map((item, idx) => ({
        id: idx + 1,
        name: item.name,
        brand: item.brand || '-',
        serving: item.serving,
        cal: parseFloat(item.cal) || 0,
        p: parseFloat(item.p) || 0,
        c: parseFloat(item.c) || 0,
        f: parseFloat(item.f) || 0,
        category: item.category || 'Other',
      }))
    : INVENTORY;

  const mealsData = sheetData?.myMeals?.length > 0 
    ? sheetData.myMeals.map((meal, idx) => ({
        id: idx + 1,
        name: meal.name,
        emoji: meal.emoji || '🍽️',
        description: meal.description,
        items: typeof meal.items === 'string' ? JSON.parse(meal.items) : meal.items,
        totals: typeof meal.totals === 'string' ? JSON.parse(meal.totals) : meal.totals,
        timesUsed: parseInt(meal.timesUsed) || 0,
      }))
    : MY_MEALS;

  const foodLogData = sheetData?.foodLog || allData;

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Flame },
    { id: 'inbody', label: 'InBody', icon: Activity },
    { id: 'inventory', label: 'Foods', icon: Package },
    { id: 'meals', label: 'Meals', icon: UtensilsCrossed },
  ];

  // Refresh data from Google Sheets
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllData();
      if (data && !data.error) {
        setSheetData(data);
        setIsConnected(true);
        setLastSync(new Date());
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`* { font-family: 'Inter', -apple-system, sans-serif; box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { display: none; }`}</style>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={styles.badge}>CUT PHASE</span>
              <span style={{ fontSize: 13, color: colors.textSecondary }}>Abs visibility</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Sync Status Indicator */}
              <div 
                onClick={handleRefresh}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 5, 
                  fontSize: 10, 
                  padding: '4px 8px',
                  borderRadius: 6,
                  background: isConnected ? '#F0FDF4' : '#FEF2F2',
                  color: isConnected ? colors.primary : colors.danger,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isLoading ? colors.yellow : (isConnected ? colors.primary : colors.danger),
                  animation: isLoading ? 'pulse 1s infinite' : 'none',
                }}></div>
                {isLoading ? 'Syncing...' : (isConnected ? 'Live' : 'Offline')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: colors.textSecondary }}>
                <Calendar size={14} />
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <div style={styles.tabs}>{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : styles.tabInactive) }}><tab.icon size={14} />{tab.label}</button>))}</div>
        </div>
      </header>

      <main style={styles.main}>
        {activeTab === 'dashboard' && <DashboardTab allData={foodLogData} selectedDate={selectedDate} setSelectedDate={setSelectedDate} inbodyData={inbodyData} />}
        {activeTab === 'inbody' && <InBodyTab data={inbodyData} />}
        {activeTab === 'inventory' && <InventoryTab data={inventoryData} />}
        {activeTab === 'meals' && <MyMealsTab data={mealsData} />}
      </main>

      <button onClick={() => setShowAddModal(true)} style={styles.fab}><Plus size={26} strokeWidth={2.5} /></button>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowAddModal(false)}>
          <div style={{ width: '100%', maxWidth: 480, background: 'white', borderRadius: '28px 28px 0 0', padding: 24, maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h2 style={{ fontSize: 20, fontWeight: 700 }}>Log Food</h2><button onClick={() => setShowAddModal(false)} style={{ background: '#F5F5F5', border: 'none', borderRadius: 12, width: 36, height: 36, cursor: 'pointer' }}><X size={18} color="#888" /></button></div>
            {mealsData.map(meal => (<div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 14, borderRadius: 14, background: '#F0FDF4', marginBottom: 8, cursor: 'pointer', border: '1px solid rgba(34,197,94,0.2)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 24 }}>{meal.emoji}</span><div><div style={{ fontSize: 14, fontWeight: 600 }}>{meal.name}</div><div style={{ fontSize: 12, color: colors.textSecondary }}>{meal.totals?.cal || 0} kcal</div></div></div><ChevronRight size={18} color={colors.primary} /></div>))}
          </div>
        </div>
      )}
      
      {/* Pulse animation for loading indicator */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}