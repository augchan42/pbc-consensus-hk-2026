/**
 * Plum Blossom Computer Constants
 * Zodiac, scales, observation levels, correspondences
 */

import type { ZodiacSign, ZodiacElement, OperationalScale, ObservationLevel } from "./types";

// --- Zodiac ---

export interface ZodiacInfo {
  sign: ZodiacSign;
  element: ZodiacElement;
  startDegree: number;
  chinese: string;
}

export const ZODIAC_SIGNS: ZodiacInfo[] = [
  { sign: "aries", element: "fire", startDegree: 0, chinese: "\u767d\u7f8a" },
  { sign: "taurus", element: "earth", startDegree: 30, chinese: "\u91d1\u725b" },
  { sign: "gemini", element: "air", startDegree: 60, chinese: "\u96d9\u5b50" },
  { sign: "cancer", element: "water", startDegree: 90, chinese: "\u5de8\u87f9" },
  { sign: "leo", element: "fire", startDegree: 120, chinese: "\u7345\u5b50" },
  { sign: "virgo", element: "earth", startDegree: 150, chinese: "\u8655\u5973" },
  { sign: "libra", element: "air", startDegree: 180, chinese: "\u5929\u79e4" },
  { sign: "scorpio", element: "water", startDegree: 210, chinese: "\u5929\u880d" },
  { sign: "sagittarius", element: "fire", startDegree: 240, chinese: "\u5c04\u624b" },
  { sign: "capricorn", element: "earth", startDegree: 270, chinese: "\u6469\u7faf" },
  { sign: "aquarius", element: "air", startDegree: 300, chinese: "\u6c34\u74f6" },
  { sign: "pisces", element: "water", startDegree: 330, chinese: "\u96d9\u9b5a" },
];

// --- Operational Scales (十/百/千/萬/億) ---

export interface ScaleInfo {
  scale: OperationalScale;
  english: string;
  magnitude: number;
  description: string;
}

export const OPERATIONAL_SCALES: ScaleInfo[] = [
  { scale: "\u5341", english: "Ten", magnitude: 10, description: "Individual/immediate scope" },
  { scale: "\u767e", english: "Hundred", magnitude: 100, description: "Community/local scope" },
  { scale: "\u5343", english: "Thousand", magnitude: 1000, description: "Regional/institutional scope" },
  { scale: "\u842c", english: "Ten Thousand", magnitude: 10000, description: "National/systemic scope" },
  { scale: "\u5104", english: "Hundred Million", magnitude: 100000000, description: "Civilizational/cosmic scope" },
];

// --- Observation Levels (目/心/理) ---

export interface ObservationInfo {
  level: ObservationLevel;
  english: string;
  description: string;
}

export const OBSERVATION_LEVELS: ObservationInfo[] = [
  { level: "\u76ee", english: "Eye", description: "Sensory observation - direct, empirical" },
  { level: "\u5fc3", english: "Heart", description: "Intuitive understanding - felt, relational" },
  { level: "\u7406", english: "Principle", description: "Cosmic pattern - structural, universal" },
];

// --- Element-Thing Correspondences (from Suoyin) ---

export const ELEMENT_THINGS: Record<string, string[]> = {
  wood: ["\u6728 wood", "\u8349 grass", "\u98db flying"],
  fire: ["\u706b fire", "\u5149 light", "\u71b1 heat"],
  earth: ["\u571f earth", "\u5c71 mountain", "\u77f3 stone"],
  metal: ["\u91d1 metal", "\u5200 blade", "\u9418 bell"],
  water: ["\u6c34 water", "\u96e8 rain", "\u96f2 cloud"],
};

// --- Social Correspondences ---

export const SOCIAL_ROLES: Record<string, string> = {
  wood: "\u8fb2 farmer",
  fire: "\u5de5 artisan",
  earth: "\u5546 merchant",
  metal: "\u58eb scholar",
  water: "\u50e7 monk",
};

// --- Hexagram bias mapping ---

// Hexagrams that suggest observation/stillness
export const OBSERVE_HEXAGRAMS = [52, 20, 29, 39, 4, 23, 36]; // Gen, Guan, Kan, Jian, Meng, Bo, Mingyi

// Hexagrams that suggest action
export const ACT_HEXAGRAMS = [1, 51, 34, 43, 14, 55, 42]; // Qian, Zhen, Dazhuang, Guai, Dayou, Feng, Yi

// Hexagrams that suggest caution/avoidance
export const AVOID_HEXAGRAMS = [12, 33, 6, 47, 28, 62, 53]; // Pi, Dun, Song, Kun, Daguo, Xiaoguo, Jian
