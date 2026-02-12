/**
 * Plum Blossom Numerology (梅花易數) Calculator
 *
 * Based on Shao Yong's (邵雍) time-based hexagram derivation method (時間起卦).
 * Uses Prior Heaven (先天) trigram sequence.
 */

import { Solar } from 'lunar-javascript';
import { trigrams, trigramNumbers, hexagramData, trigramChineseMapping } from '@/constants/hexagrams';

// Map Prior Heaven number to trigram name (English key used in hexagramData)
const PRIOR_HEAVEN_TO_TRIGRAM: Record<number, string> = {
  1: 'Heaven', // 乾
  2: 'Lake', // 兌
  3: 'Fire', // 離
  4: 'Thunder', // 震
  5: 'Wind', // 巽
  6: 'Water', // 坎
  7: 'Mountain', // 艮
  8: 'Earth', // 坤
};

// Build reverse mapping: trigram name -> Prior Heaven number
const TRIGRAM_TO_PRIOR_HEAVEN: Record<string, number> = Object.fromEntries(
  Object.entries(PRIOR_HEAVEN_TO_TRIGRAM).map(([num, name]) => [name, Number(num)])
);

// Get trigram info by Prior Heaven number
export function getTrigramByNumber(num: number): { name: string; chinese: string; binary: string } {
  const name = PRIOR_HEAVEN_TO_TRIGRAM[num];
  const chinese = trigramChineseMapping[name as keyof typeof trigramChineseMapping];
  const binary = trigrams[name as keyof typeof trigrams];
  return { name, chinese, binary };
}

// Build hexagram lookup from existing hexagramData
// Key: upperTrigram + lowerTrigram (e.g., "Heaven+Earth" -> 12)
const HEXAGRAM_BY_TRIGRAMS: Record<string, number> = {};
hexagramData.forEach((hex) => {
  const key = `${hex.topTrigram}+${hex.bottomTrigram}`;
  HEXAGRAM_BY_TRIGRAMS[key] = hex.number;
});

// Heavenly stems with their sequence numbers (甲=1, 乙=2, ... 癸=10)
export const HEAVENLY_STEMS = [
  { stem: '甲', pinyin: 'jia', element: '陽木', index: 1 },
  { stem: '乙', pinyin: 'yi', element: '陰木', index: 2 },
  { stem: '丙', pinyin: 'bing', element: '陽火', index: 3 },
  { stem: '丁', pinyin: 'ding', element: '陰火', index: 4 },
  { stem: '戊', pinyin: 'wu', element: '陽土', index: 5 },
  { stem: '己', pinyin: 'ji', element: '陰土', index: 6 },
  { stem: '庚', pinyin: 'geng', element: '陽金', index: 7 },
  { stem: '辛', pinyin: 'xin', element: '陰金', index: 8 },
  { stem: '壬', pinyin: 'ren', element: '陽水', index: 9 },
  { stem: '癸', pinyin: 'gui', element: '陰水', index: 10 },
];

// Earthly branches with their sequence numbers (子=1, 丑=2, ... 亥=12)
export const EARTHLY_BRANCHES = [
  { branch: '子', pinyin: 'zi', animal: '鼠', element: '水', index: 1 }, // Rat - Water
  { branch: '丑', pinyin: 'chou', animal: '牛', element: '土', index: 2 }, // Ox - Earth
  { branch: '寅', pinyin: 'yin', animal: '虎', element: '木', index: 3 }, // Tiger - Wood
  { branch: '卯', pinyin: 'mao', animal: '兔', element: '木', index: 4 }, // Rabbit - Wood
  { branch: '辰', pinyin: 'chen', animal: '龍', element: '土', index: 5 }, // Dragon - Earth
  { branch: '巳', pinyin: 'si', animal: '蛇', element: '火', index: 6 }, // Snake - Fire
  { branch: '午', pinyin: 'wu', animal: '馬', element: '火', index: 7 }, // Horse - Fire
  { branch: '未', pinyin: 'wei', animal: '羊', element: '土', index: 8 }, // Goat - Earth
  { branch: '申', pinyin: 'shen', animal: '猴', element: '金', index: 9 }, // Monkey - Metal
  { branch: '酉', pinyin: 'you', animal: '雞', element: '金', index: 10 }, // Rooster - Metal
  { branch: '戌', pinyin: 'xu', animal: '狗', element: '土', index: 11 }, // Dog - Earth
  { branch: '亥', pinyin: 'hai', animal: '豬', element: '水', index: 12 }, // Pig - Water
];

// 時辰 (double-hour) time ranges
export const SHICHEN_HOURS = [
  { branch: '子', start: 23, end: 1, index: 1 }, // 23:00-00:59
  { branch: '丑', start: 1, end: 3, index: 2 }, // 01:00-02:59
  { branch: '寅', start: 3, end: 5, index: 3 }, // 03:00-04:59
  { branch: '卯', start: 5, end: 7, index: 4 }, // 05:00-06:59
  { branch: '辰', start: 7, end: 9, index: 5 }, // 07:00-08:59
  { branch: '巳', start: 9, end: 11, index: 6 }, // 09:00-10:59
  { branch: '午', start: 11, end: 13, index: 7 }, // 11:00-12:59
  { branch: '未', start: 13, end: 15, index: 8 }, // 13:00-14:59
  { branch: '申', start: 15, end: 17, index: 9 }, // 15:00-16:59
  { branch: '酉', start: 17, end: 19, index: 10 }, // 17:00-18:59
  { branch: '戌', start: 19, end: 21, index: 11 }, // 19:00-20:59
  { branch: '亥', start: 21, end: 23, index: 12 }, // 21:00-22:59
];

/**
 * Get earthly branch index (1-12) from branch character
 */
export function getBranchIndex(branch: string): number {
  const found = EARTHLY_BRANCHES.find(b => b.branch === branch);
  return found ? found.index : 1;
}

/**
 * Get lunar year's earthly branch index using lunar-javascript
 * This is the accurate method for Plum Blossom calculations
 */
export function getLunarYearBranchIndex(gregorianYear: number, gregorianMonth: number, gregorianDay: number): number {
  const solar = Solar.fromYmd(gregorianYear, gregorianMonth, gregorianDay);
  const lunar = solar.getLunar();
  const yearZhi = lunar.getYearZhi(); // Returns earthly branch character like "未"
  return getBranchIndex(yearZhi);
}

/**
 * Get heavenly stem index (1-10) from stem character
 */
export function getStemIndex(stem: string): number {
  const found = HEAVENLY_STEMS.find(s => s.stem === stem);
  return found ? found.index : 1;
}

/**
 * Sexagenary cycle (60-year cycle) information
 */
export interface SexagenaryCycleInfo {
  /** Position in 60-year cycle (1-60) */
  position: number;

  /** Full Gan-Zhi combination (e.g., "壬寅" for 2022) */
  ganZhi: string;

  /** Heavenly stem character (e.g., "壬") */
  gan: string;

  /** Earthly branch character (e.g., "寅") */
  zhi: string;

  /** Heavenly stem index (1-10) */
  ganIndex: number;

  /** Earthly branch index (1-12) */
  zhiIndex: number;

  /** Heavenly stem pinyin */
  ganPinyin: string;

  /** Earthly branch pinyin */
  zhiPinyin: string;

  /** Heavenly stem element (e.g., "陽水") */
  ganElement: string;

  /** Earthly branch animal (e.g., "虎") */
  zhiAnimal: string;

  /** Earthly branch element (e.g., "木") */
  zhiElement: string;
}

/**
 * Calculate sexagenary cycle position from Gregorian year
 *
 * Formula: (Year - 3) mod 60 = Position
 * - Position 1 corresponds to 甲子 (Jiǎ-Zǐ)
 * - Position 39 corresponds to 壬寅 (Rén-Yín) - Year 2022
 *
 * Reference cycle: 1984 = Position 1, 2044 = Position 1 (next cycle)
 *
 * @param gregorianYear - Gregorian year (e.g., 2022)
 * @returns Position in 60-year cycle (1-60)
 */
export function calculateSexagenaryPosition(gregorianYear: number): number {
  const position = (gregorianYear - 3) % 60;
  return position === 0 ? 60 : position;
}

/**
 * Get complete sexagenary cycle information for a date
 *
 * IMPORTANT: Uses lunar calendar year boundaries (Lunar New Year), not Gregorian Jan 1.
 * Example: February 1, 2022 is still 辛丑 year, but February 2+ is 壬寅 year.
 *
 * @param gregorianYear - Gregorian year
 * @param gregorianMonth - Gregorian month (1-12)
 * @param gregorianDay - Gregorian day
 * @returns Complete sexagenary cycle information
 *
 * @example
 * ```typescript
 * const info = getSexagenaryCycleInfo(2022, 6, 3);
 * // Returns:
 * // {
 * //   position: 39,
 * //   ganZhi: "壬寅",
 * //   gan: "壬",
 * //   zhi: "寅",
 * //   ganIndex: 9,
 * //   zhiIndex: 3,
 * //   ganPinyin: "ren",
 * //   zhiPinyin: "yin",
 * //   ganElement: "陽水",
 * //   zhiAnimal: "虎",
 * //   zhiElement: "木"
 * // }
 * ```
 */
export function getSexagenaryCycleInfo(
  gregorianYear: number,
  gregorianMonth: number,
  gregorianDay: number
): SexagenaryCycleInfo {
  const solar = Solar.fromYmd(gregorianYear, gregorianMonth, gregorianDay);
  const lunar = solar.getLunar();

  // Get full GanZhi from lunar-javascript (accounts for Lunar New Year boundary)
  const ganZhi = lunar.getYearInGanZhi();
  const gan = lunar.getYearGan();
  const zhi = lunar.getYearZhi();

  // Get indices
  const ganIndex = getStemIndex(gan);
  const zhiIndex = getBranchIndex(zhi);

  // Get metadata
  const stemInfo = HEAVENLY_STEMS.find(s => s.stem === gan);
  const branchInfo = EARTHLY_BRANCHES.find(b => b.branch === zhi);

  // Calculate position in 60-year cycle
  // Use the lunar year (not Gregorian) for accurate position
  const lunarYear = lunar.getYear();
  const position = calculateSexagenaryPosition(lunarYear);

  return {
    position,
    ganZhi,
    gan,
    zhi,
    ganIndex,
    zhiIndex,
    ganPinyin: stemInfo?.pinyin || '',
    zhiPinyin: branchInfo?.pinyin || '',
    ganElement: stemInfo?.element || '',
    zhiAnimal: branchInfo?.animal || '',
    zhiElement: branchInfo?.element || '',
  };
}

/**
 * Get 時辰 index (1-12) from hour (0-23)
 */
export function getShichenIndex(hour: number): number {
  // Special case: 23:00 is 子時 (next day's first hour in traditional reckoning)
  if (hour >= 23 || hour < 1) return 1; // 子
  if (hour >= 1 && hour < 3) return 2; // 丑
  if (hour >= 3 && hour < 5) return 3; // 寅
  if (hour >= 5 && hour < 7) return 4; // 卯
  if (hour >= 7 && hour < 9) return 5; // 辰
  if (hour >= 9 && hour < 11) return 6; // 巳
  if (hour >= 11 && hour < 13) return 7; // 午
  if (hour >= 13 && hour < 15) return 8; // 未
  if (hour >= 15 && hour < 17) return 9; // 申
  if (hour >= 17 && hour < 19) return 10; // 酉
  if (hour >= 19 && hour < 21) return 11; // 戌
  return 12; // 亥 (21-23)
}

/**
 * Get 時辰 info from hour
 */
export function getShichen(hour: number): typeof SHICHEN_HOURS[0] {
  const index = getShichenIndex(hour);
  return SHICHEN_HOURS[index - 1];
}

/**
 * Convert Gregorian date to lunar calendar using lunar-javascript
 */
export function gregorianToLunar(year: number, month: number, day: number) {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    yearInChinese: lunar.getYearInChinese(),
    monthInChinese: lunar.getMonthInChinese(),
    dayInChinese: lunar.getDayInChinese(),
    yearGanZhi: lunar.getYearInGanZhi(),
    isLeapMonth: lunar.getMonth() < 0, // Negative month indicates leap month
  };
}

/**
 * Get winter solstice (冬至) date for a given year
 * Returns the Gregorian date of winter solstice
 */
export function getWinterSolstice(year: number): { year: number; month: number; day: number } {
  // Winter solstice is typically Dec 20-23
  // Search for 冬至 directly in December of the requested year
  for (let day = 20; day <= 23; day++) {
    const solar = Solar.fromYmd(year, 12, day);
    const lunar = solar.getLunar();
    if (lunar.getJieQi() === '冬至') {
      return { year, month: 12, day };
    }
  }

  // Fallback: approximate to Dec 21
  return { year, month: 12, day: 21 };
}

/**
 * Calculate hexagram number from upper and lower trigram names
 */
export function getHexagramFromTrigrams(upperTrigram: string, lowerTrigram: string): number {
  const key = `${upperTrigram}+${lowerTrigram}`;
  const hexNumber = HEXAGRAM_BY_TRIGRAMS[key];

  if (!hexNumber) {
    console.error('Hexagram not found for trigrams:', upperTrigram, lowerTrigram);
    return 1;
  }

  return hexNumber;
}

export interface PlumBlossomInput {
  gregorianDate: Date;
  useWinterSolstice?: boolean; // For year-only queries
}

export interface PlumBlossomResult {
  // Input data
  gregorianDate: Date;
  lunarDate: {
    year: number;
    month: number;
    day: number;
    yearInChinese: string;
    monthInChinese: string;
    dayInChinese: string;
    yearGanZhi: string;
  };
  shichen: {
    branch: string;
    index: number;
  };

  // Sexagenary cycle information (60-year cycle)
  sexagenaryCycle: SexagenaryCycleInfo;

  // Calculation values
  yearNumber: number;
  monthNumber: number;
  dayNumber: number;
  hourNumber: number;

  // Intermediate sums
  upperSum: number; // year + month + day
  lowerSum: number; // year + month + day + hour

  // Trigram results
  upperTrigramNumber: number;
  lowerTrigramNumber: number;
  upperTrigram: { name: string; chinese: string };
  lowerTrigram: { name: string; chinese: string };

  // Moving line
  movingLine: number;

  // Final hexagram
  hexagramNumber: number;
}

/**
 * Main Plum Blossom calculation function
 *
 * Formula:
 * - Upper trigram = (year + month + day) mod 8, use 8 if 0
 * - Lower trigram = (year + month + day + hour) mod 8, use 8 if 0
 * - Moving line = (year + month + day + hour) mod 6, use 6 if 0
 */
export function calculatePlumBlossom(input: PlumBlossomInput): PlumBlossomResult {
  const { gregorianDate } = input;

  // Get lunar calendar values
  const lunar = gregorianToLunar(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth() + 1, // JS months are 0-indexed
    gregorianDate.getUTCDate()
  );

  // Get sexagenary cycle information (60-year cycle)
  const sexagenaryCycle = getSexagenaryCycleInfo(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth() + 1,
    gregorianDate.getUTCDate()
  );

  // Get year branch index (1-12) from lunar year's earthly branch
  // NOTE: This is kept for reference but NOT used in calculations
  // The sexagenary position (1-60) is used instead for accurate Plum Blossom divination
  const yearNumber = getLunarYearBranchIndex(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth() + 1,
    gregorianDate.getUTCDate()
  );

  // Get lunar month and day
  const monthNumber = Math.abs(lunar.month); // Handle leap months
  const dayNumber = lunar.day;

  // Get 時辰 index
  const hour = gregorianDate.getUTCHours();
  const hourNumber = getShichenIndex(hour);
  const shichen = getShichen(hour);

  // Calculate sums using sexagenary position (not branch index)
  // Example: June 3, 2022 = Year 39 (壬寅) → 39 + 5 + 5 = 49 → 49 mod 8 = 1 (Qian)
  const upperSum = sexagenaryCycle.position + monthNumber + dayNumber;
  const lowerSum = upperSum + hourNumber;

  // Calculate trigram numbers (1-8)
  let upperTrigramNumber = upperSum % 8;
  if (upperTrigramNumber === 0) upperTrigramNumber = 8;

  let lowerTrigramNumber = lowerSum % 8;
  if (lowerTrigramNumber === 0) lowerTrigramNumber = 8;

  // Calculate moving line (1-6)
  let movingLine = lowerSum % 6;
  if (movingLine === 0) movingLine = 6;

  // Get trigram info using Prior Heaven mapping
  console.log('[Plum Blossom] Trigram numbers:', { upperTrigramNumber, lowerTrigramNumber, yearNumber, monthNumber, dayNumber, hourNumber, upperSum, lowerSum });
  const upperTrigramInfo = getTrigramByNumber(upperTrigramNumber);
  const lowerTrigramInfo = getTrigramByNumber(lowerTrigramNumber);
  console.log('[Plum Blossom] Trigram info:', { upperTrigramInfo, lowerTrigramInfo });

  // Get hexagram number using trigram names
  const hexagramNumber = getHexagramFromTrigrams(upperTrigramInfo.name, lowerTrigramInfo.name);

  return {
    gregorianDate,
    lunarDate: {
      year: lunar.year,
      month: lunar.month,
      day: lunar.day,
      yearInChinese: lunar.yearInChinese,
      monthInChinese: lunar.monthInChinese,
      dayInChinese: lunar.dayInChinese,
      yearGanZhi: lunar.yearGanZhi,
    },
    shichen: {
      branch: shichen.branch,
      index: hourNumber,
    },
    sexagenaryCycle,
    yearNumber,
    monthNumber,
    dayNumber,
    hourNumber,
    upperSum,
    lowerSum,
    upperTrigramNumber,
    lowerTrigramNumber,
    upperTrigram: { name: upperTrigramInfo.name, chinese: upperTrigramInfo.chinese },
    lowerTrigram: { name: lowerTrigramInfo.name, chinese: lowerTrigramInfo.chinese },
    movingLine,
    hexagramNumber,
  };
}

/**
 * Calculate Plum Blossom for current moment
 */
export function calculatePlumBlossomNow(): PlumBlossomResult {
  return calculatePlumBlossom({ gregorianDate: new Date() });
}

/**
 * Calculate Plum Blossom for a specific year (defaults to winter solstice)
 */
export function calculatePlumBlossomForYear(year: number, hour: number = 12): PlumBlossomResult {
  const winterSolstice = getWinterSolstice(year - 1); // Previous year's winter solstice starts the year
  const date = new Date(winterSolstice.year, winterSolstice.month - 1, winterSolstice.day, hour);
  return calculatePlumBlossom({ gregorianDate: date, useWinterSolstice: true });
}

/**
 * Contextual Plum Blossom Calculation (Benebell Wen, "I Ching: The Oracle", p. 332)
 *
 * Traditional approach where:
 * - Upper trigram = Contextually significant date (historical event, exam date, etc.)
 * - Lower trigram = Moment of divination (query time - NOW)
 *
 * This method handles BC dates and ancient dates naturally, since the lower trigram
 * (query time) is always modern and uses full lunar calendar support.
 */
export interface ContextualPlumBlossomInput {
  upperDate: {
    year: number; // Can be negative for BC (e.g., -221 for 221 BC)
    month: number; // 1-12
    day: number; // 1-31
  };
  lowerDate: Date; // Query time (current moment)
}

export interface ContextualPlumBlossomResult {
  // Input data
  upperDate: {
    year: number;
    month: number;
    day: number;
    yearNumber: number; // Lunar year branch index or numeric fallback
    monthNumber: number;
    dayNumber: number;
  };
  lowerDate: {
    gregorianDate: Date;
    lunarDate: {
      year: number;
      month: number;
      day: number;
      yearInChinese: string;
      monthInChinese: string;
      dayInChinese: string;
      yearGanZhi: string;
    };
    shichen: {
      branch: string;
      index: number;
    };
    yearNumber: number;
    monthNumber: number;
    dayNumber: number;
    hourNumber: number;
  };

  // Calculation method used
  method: 'plum_blossom_contextual' | 'numeric_fallback_upper';

  // Trigram results
  upperSum: number;
  lowerSum: number;
  upperTrigramNumber: number;
  lowerTrigramNumber: number;
  upperTrigram: { name: string; chinese: string };
  lowerTrigram: { name: string; chinese: string };

  // Moving line
  movingLine: number;

  // Final hexagram
  hexagramNumber: number;
}

/**
 * Calculate contextual plum blossom hexagram
 *
 * Upper trigram uses the historical/contextual date (can be BC or ancient)
 * Lower trigram uses the query time (always modern, full lunar support)
 */
export function calculateContextualPlumBlossom(input: ContextualPlumBlossomInput): ContextualPlumBlossomResult {
  const { upperDate, lowerDate } = input;

  // === UPPER TRIGRAM (Contextual Date) ===
  // For ancient/BC dates, use simple numeric calculation (no lunar conversion)
  const isAncientDate = upperDate.year < 1900 || upperDate.year < 0;

  let upperYearNumber: number; // Branch index (kept for reference)
  let upperYearPosition: number; // Sexagenary position (used in calculation)
  let upperMonthNumber: number;
  let upperDayNumber: number;
  let method: 'plum_blossom_contextual' | 'numeric_fallback_upper';

  if (isAncientDate) {
    // Numeric fallback for ancient dates (BC or pre-1900)
    // Calculate sexagenary position using the standard formula
    const absYear = Math.abs(upperDate.year);
    upperYearPosition = calculateSexagenaryPosition(absYear);
    upperYearNumber = ((absYear - 4) % 12) + 1; // Branch index for reference
    upperMonthNumber = upperDate.month;
    upperDayNumber = upperDate.day;
    method = 'numeric_fallback_upper';
  } else {
    // Full lunar conversion for modern dates (1900-2100)
    try {
      const upperYearBranch = getLunarYearBranchIndex(upperDate.year, upperDate.month, upperDate.day);
      const upperSexagenary = getSexagenaryCycleInfo(upperDate.year, upperDate.month, upperDate.day);
      const upperLunar = gregorianToLunar(upperDate.year, upperDate.month, upperDate.day);
      upperYearNumber = upperYearBranch;
      upperYearPosition = upperSexagenary.position;
      upperMonthNumber = Math.abs(upperLunar.month);
      upperDayNumber = upperLunar.day;
      method = 'plum_blossom_contextual';
    } catch (error) {
      // Fallback if lunar conversion fails
      console.warn('[Contextual Plum Blossom] Lunar conversion failed for upper date, using numeric fallback:', error);
      const absYear = Math.abs(upperDate.year);
      upperYearPosition = calculateSexagenaryPosition(absYear);
      upperYearNumber = ((absYear - 4) % 12) + 1;
      upperMonthNumber = upperDate.month;
      upperDayNumber = upperDate.day;
      method = 'numeric_fallback_upper';
    }
  }

  // === LOWER TRIGRAM (Query Time - Always Modern) ===
  const lowerLunar = gregorianToLunar(
    lowerDate.getUTCFullYear(),
    lowerDate.getUTCMonth() + 1,
    lowerDate.getUTCDate()
  );

  const lowerYearNumber = getLunarYearBranchIndex(
    lowerDate.getUTCFullYear(),
    lowerDate.getUTCMonth() + 1,
    lowerDate.getUTCDate()
  );

  const lowerSexagenary = getSexagenaryCycleInfo(
    lowerDate.getUTCFullYear(),
    lowerDate.getUTCMonth() + 1,
    lowerDate.getUTCDate()
  );

  const lowerMonthNumber = Math.abs(lowerLunar.month);
  const lowerDayNumber = lowerLunar.day;
  const lowerHour = lowerDate.getUTCHours();
  const lowerHourNumber = getShichenIndex(lowerHour);
  const lowerShichen = getShichen(lowerHour);

  // === CALCULATE TRIGRAMS ===
  // Use sexagenary position (1-60) not branch index (1-12)
  const upperSum = upperYearPosition + upperMonthNumber + upperDayNumber;
  const lowerSum = lowerSexagenary.position + lowerMonthNumber + lowerDayNumber + lowerHourNumber;

  let upperTrigramNumber = upperSum % 8;
  if (upperTrigramNumber === 0) upperTrigramNumber = 8;

  let lowerTrigramNumber = lowerSum % 8;
  if (lowerTrigramNumber === 0) lowerTrigramNumber = 8;

  // Calculate moving line
  let movingLine = lowerSum % 6;
  if (movingLine === 0) movingLine = 6;

  // Get trigram info
  const upperTrigramInfo = getTrigramByNumber(upperTrigramNumber);
  const lowerTrigramInfo = getTrigramByNumber(lowerTrigramNumber);

  // Get hexagram number
  const hexagramNumber = getHexagramFromTrigrams(upperTrigramInfo.name, lowerTrigramInfo.name);

  return {
    upperDate: {
      year: upperDate.year,
      month: upperDate.month,
      day: upperDate.day,
      yearNumber: upperYearNumber,
      monthNumber: upperMonthNumber,
      dayNumber: upperDayNumber,
    },
    lowerDate: {
      gregorianDate: lowerDate,
      lunarDate: {
        year: lowerLunar.year,
        month: lowerLunar.month,
        day: lowerLunar.day,
        yearInChinese: lowerLunar.yearInChinese,
        monthInChinese: lowerLunar.monthInChinese,
        dayInChinese: lowerLunar.dayInChinese,
        yearGanZhi: lowerLunar.yearGanZhi,
      },
      shichen: {
        branch: lowerShichen.branch,
        index: lowerHourNumber,
      },
      yearNumber: lowerYearNumber,
      monthNumber: lowerMonthNumber,
      dayNumber: lowerDayNumber,
      hourNumber: lowerHourNumber,
    },
    method,
    upperSum,
    lowerSum,
    upperTrigramNumber,
    lowerTrigramNumber,
    upperTrigram: { name: upperTrigramInfo.name, chinese: upperTrigramInfo.chinese },
    lowerTrigram: { name: lowerTrigramInfo.name, chinese: lowerTrigramInfo.chinese },
    movingLine,
    hexagramNumber,
  };
}
