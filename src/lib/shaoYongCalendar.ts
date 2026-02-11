/**
 * Shao Yong Year Hexagram Calculator
 *
 * Based on the 皇極經世書 (Huangji Jingshi Shu) - Supreme World-Ordering Principles
 * by Shao Yong (邵雍, 1012-1077)
 *
 * This implements the annual hexagram (年值卦) system from Table 11 of the
 * Ma & Zeng 2020 scholarly publication on Shao Yong's hexagram table.
 *
 * Key concepts:
 * - 60-year Jia-Zi (甲子) cycle
 * - Current cycle: 1984-2043, ruled by Hexagram 29 Ding (鼎)
 * - 60 on-duty hexagrams exclude the 4 principal hexagrams (Qian, Kun, Kan, Li)
 * - Years follow an S-shaped path through the Fu Xi 8×8 matrix
 *
 * @see docs/research/shao-yong-extractions/hexagram-table/table-11-extraction.md
 */

import { hexagramData } from '@/constants/hexagrams';

/**
 * Fu Xi sequence: The 60 on-duty hexagram codes in year order
 *
 * Pattern:
 * - Positions 0-27: Descend Fu Xi 29→1 (skip 18 Kan, 0 Kun)
 * - Positions 28-29: Bridge 32, 33
 * - Positions 30-57: Ascend Fu Xi 34→62 (skip 45 Li, 63 Qian)
 * - Positions 58-59: Wrap 31, 30
 */
const FUXI_YEAR_SEQUENCE: readonly number[] = [
  // First half: descending 29→1 (skip 18, 0)
  29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
  // Bridge to second half
  32, 33,
  // Second half: ascending 34→62 (skip 45, 63)
  34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
  // Wrap back
  31, 30
] as const;

/**
 * Fu Xi code to King Wen number mapping
 *
 * Fu Xi uses binary encoding: lower_trigram_index * 8 + upper_trigram_index
 * Trigram indices (binary): ☷=0, ☶=1, ☵=2, ☴=3, ☳=4, ☲=5, ☱=6, ☰=7
 */
const FUXI_TO_KINGWEN: Record<number, number> = {
  0: 2, // Kun 坤
  1: 23, // Bo 剥
  2: 8, // Bi 比
  3: 20, // Guan 观
  4: 16, // Yu 豫
  5: 35, // Jin 晋
  6: 45, // Cui 萃
  7: 12, // Pi 否
  8: 15, // Qian 谦
  9: 52, // Gen 艮
  10: 39, // Jian 蹇
  11: 53, // Jian 渐
  12: 62, // Xiao-guo 小过
  13: 56, // Lü 旅
  14: 31, // Xian 咸
  15: 33, // Dun 遯
  16: 7, // Shi 师
  17: 4, // Meng 蒙
  18: 29, // Kan 坎 (excluded - principal)
  19: 59, // Huan 涣
  20: 40, // Xie 解
  21: 64, // Wei-ji 未济
  22: 47, // Kun 困
  23: 6, // Song 讼
  24: 46, // Sheng 升
  25: 18, // Gu 蛊
  26: 48, // Jing 井
  27: 57, // Xun 巽
  28: 32, // Heng 恒
  29: 50, // Ding 鼎
  30: 28, // Da-guo 大过
  31: 44, // Gou 姤
  32: 24, // Fu 复
  33: 27, // Yi 颐
  34: 3, // Zhun 屯
  35: 42, // Yi 益
  36: 51, // Zhen 震
  37: 21, // Shi-he 噬嗑
  38: 17, // Sui 随
  39: 25, // Wu-wang 无妄
  40: 36, // Ming-yi 明夷
  41: 22, // Bi 贲
  42: 63, // Ji-ji 既济
  43: 37, // Jia-ren 家人
  44: 55, // Feng 丰
  45: 30, // Li 离 (excluded - principal)
  46: 49, // Ge 革
  47: 13, // Tong-ren 同人
  48: 19, // Lin 临
  49: 41, // Sun 损
  50: 60, // Jie 节
  51: 61, // Zhong-fu 中孚
  52: 54, // Gui-mei 归妹
  53: 38, // Kui 睽
  54: 58, // Dui 兑
  55: 10, // Lü 履
  56: 11, // Tai 泰
  57: 26, // Da-xu 大畜
  58: 5, // Xu 需
  59: 9, // Xiao-xu 小畜
  60: 34, // Da-zhuang 大壮
  61: 14, // Da-you 大有
  62: 43, // Guai 夬
  63: 1, // Qian 乾 (excluded - principal)
};

/**
 * The four principal hexagrams (四正卦 / 监司 Jian-Si)
 * These serve as "Regional Inspectors" overseeing the cycle
 * and are excluded from the 60 on-duty hexagrams
 */
export const PRINCIPAL_HEXAGRAMS = {
  KUN: { fuXi: 0, kingWen: 2, name: '坤', pinyin: 'Kun' },
  KAN: { fuXi: 18, kingWen: 29, name: '坎', pinyin: 'Kan' },
  LI: { fuXi: 45, kingWen: 30, name: '离', pinyin: 'Li' },
  QIAN: { fuXi: 63, kingWen: 1, name: '乾', pinyin: 'Qian' },
} as const;

/**
 * Jia-Zi cycle information
 */
export interface JiaZiCycle {
  startYear: number;
  endYear: number;
  rulingHexagram: {
    fuXi: number;
    kingWen: number;
    name: string;
    pinyin: string;
  };
}

/**
 * Current Jia-Zi cycle (1984-2043)
 */
export const CURRENT_JIAZI_CYCLE: JiaZiCycle = {
  startYear: 1984,
  endYear: 2043,
  rulingHexagram: {
    fuXi: 29,
    kingWen: 50,
    name: '鼎',
    pinyin: 'Ding',
  },
};

/**
 * Result from year hexagram calculation
 */
export interface ShaoYongYearResult {
  year: number;
  fuXiCode: number;
  kingWenNumber: number;
  hexagram: {
    name: string;
    pinyin: string;
    chinese: string;
    meaning: string;
    unicode: string;
  };
  cyclePosition: number; // 0-59 position in the 60-year cycle
  generation: 1 | 2; // First or second 30-year generation
  jiaZiCycle: JiaZiCycle;
}

/**
 * Get the Shao Yong annual hexagram for a given year
 *
 * @param year - The year to calculate (e.g., 2026)
 * @returns The annual hexagram information
 *
 * @example
 * const result = getShaoYongYearHexagram(2026);
 * // { year: 2026, fuXiCode: 47, kingWenNumber: 13, hexagram: { pinyin: 'Tong-ren', ... } }
 */
export function getShaoYongYearHexagram(year: number): ShaoYongYearResult {
  // Calculate position in 60-year cycle (0-59)
  const cycleStart = CURRENT_JIAZI_CYCLE.startYear;
  let cyclePosition = ((year - cycleStart) % 60 + 60) % 60; // Handle negative years

  // Get Fu Xi code from sequence
  const fuXiCode = FUXI_YEAR_SEQUENCE[cyclePosition];

  // Convert to King Wen number
  const kingWenNumber = FUXI_TO_KINGWEN[fuXiCode];

  // Get hexagram data from constants
  const hexagramInfo = hexagramData.find(h => h.number === kingWenNumber);

  if (!hexagramInfo) {
    throw new Error(`No hexagram data found for King Wen number ${kingWenNumber}`);
  }

  // Determine which generation (first 30 years or second 30 years)
  const generation: 1 | 2 = cyclePosition < 30 ? 1 : 2;

  // Determine which Jia-Zi cycle this year falls into
  // Handle years before 1984 correctly (e.g., 1924-1983 is the previous cycle)
  const yearsFromReference = year - 1984;
  const cycleNumber = yearsFromReference >= 0
    ? Math.floor(yearsFromReference / 60)
    : Math.floor((yearsFromReference + 1) / 60) - 1;
  const jiaZiCycle: JiaZiCycle = {
    startYear: 1984 + cycleNumber * 60,
    endYear: 2043 + cycleNumber * 60,
    rulingHexagram: CURRENT_JIAZI_CYCLE.rulingHexagram,
  };

  return {
    year,
    fuXiCode,
    kingWenNumber,
    hexagram: {
      name: hexagramInfo.name.pinyin,
      pinyin: hexagramInfo.name.pinyin,
      chinese: hexagramInfo.name.chinese,
      meaning: hexagramInfo.meaning,
      unicode: hexagramInfo.unicode,
    },
    cyclePosition,
    generation,
    jiaZiCycle,
  };
}

/**
 * Get all annual hexagrams for a range of years
 *
 * @param startYear - First year in range
 * @param endYear - Last year in range (inclusive)
 * @returns Array of annual hexagram results
 */
export function getShaoYongYearRange(
  startYear: number,
  endYear: number
): ShaoYongYearResult[] {
  const results: ShaoYongYearResult[] = [];

  for (let year = startYear; year <= endYear; year++) {
    results.push(getShaoYongYearHexagram(year));
  }

  return results;
}

/**
 * Find all years in a given range that have a specific hexagram
 *
 * @param kingWenNumber - King Wen hexagram number (1-64)
 * @param startYear - First year to search
 * @param endYear - Last year to search
 * @returns Array of years with this hexagram
 */
export function findYearsWithHexagram(
  kingWenNumber: number,
  startYear: number,
  endYear: number
): number[] {
  const years: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const result = getShaoYongYearHexagram(year);
    if (result.kingWenNumber === kingWenNumber) {
      years.push(year);
    }
  }

  return years;
}

/**
 * Check if a hexagram is one of the four principal hexagrams
 *
 * @param fuXiCode - Fu Xi code to check
 * @returns true if this is a principal hexagram
 */
export function isPrincipalHexagram(fuXiCode: number): boolean {
  return (
    fuXiCode === PRINCIPAL_HEXAGRAMS.KUN.fuXi
    || fuXiCode === PRINCIPAL_HEXAGRAMS.KAN.fuXi
    || fuXiCode === PRINCIPAL_HEXAGRAMS.LI.fuXi
    || fuXiCode === PRINCIPAL_HEXAGRAMS.QIAN.fuXi
  );
}

/**
 * Get a human-readable explanation of the year hexagram
 *
 * @param year - The year to explain
 * @returns Formatted explanation string
 */
export function explainShaoYongYear(year: number): string {
  const result = getShaoYongYearHexagram(year);

  return `
Year ${year} - Shao Yong Annual Hexagram
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hexagram: ${result.hexagram.unicode} ${result.hexagram.chinese} (${result.hexagram.pinyin})
King Wen #${result.kingWenNumber} / Fu Xi #${result.fuXiCode}
Meaning: "${result.hexagram.meaning}"

Cycle Information:
  • Position: ${result.cyclePosition + 1}/60 in the Jia-Zi cycle
  • Generation: ${result.generation === 1 ? 'First' : 'Second'} (${result.generation === 1 ? '1984-2013' : '2014-2043'})
  • Ruling Hexagram: ${result.jiaZiCycle.rulingHexagram.name} (${result.jiaZiCycle.rulingHexagram.pinyin})
  • Cycle Period: ${result.jiaZiCycle.startYear}-${result.jiaZiCycle.endYear}

Based on 皇極經世書 (Huangji Jingshi Shu) by Shao Yong (邵雍, 1012-1077)
`.trim();
}

/**
 * Get the Jia-Zi cycle number for a given year
 * Cycle 0 = 1984-2043, Cycle -1 = 1924-1983, Cycle 1 = 2044-2103, etc.
 *
 * @param year - The year to check
 * @returns The cycle number (0 for current, negative for past, positive for future)
 */
export function getJiaZiCycleNumber(year: number): number {
  const yearsFromReference = year - 1984;
  return yearsFromReference >= 0
    ? Math.floor(yearsFromReference / 60)
    : Math.floor((yearsFromReference + 1) / 60) - 1;
}

/**
 * Notable historical Jia-Zi cycles for reference
 */
export const HISTORICAL_JIAZI_CYCLES = [
  { cycle: -17, start: 964, end: 1023, note: 'Shao Yong born 1012' },
  { cycle: -2, start: 1864, end: 1923, note: 'Late Qing, WWI' },
  { cycle: -1, start: 1924, end: 1983, note: 'WWII, Cold War' },
  { cycle: 0, start: 1984, end: 2043, note: 'Current cycle' },
  { cycle: 1, start: 2044, end: 2103, note: 'Next cycle' },
] as const;

/**
 * Interesting years for backtesting with their hexagram correlations
 */
export interface BacktestYear {
  year: number;
  hexagram: ShaoYongYearResult;
  historicalSignificance: string;
  correlationNotes?: string;
}

/**
 * Get backtesting data for historically significant years
 */
export function getBacktestYears(): BacktestYear[] {
  const significantYears: Array<{ year: number; significance: string; notes?: string }> = [
    // Within current cycle (1984-2043)
    { year: 1989, significance: 'Fall of Berlin Wall, Tiananmen Square', notes: 'Sheng (Pushing Upward) - rising forces' },
    { year: 1991, significance: 'USSR dissolution, Gulf War end', notes: 'Kun (Oppression) - exhaustion of old systems' },
    { year: 1993, significance: 'EU formed, Oslo Accords', notes: 'Xie (Deliverance) - release from constraints' },
    { year: 2001, significance: '9/11 attacks', notes: 'Jian (Gradual Progress) - interrupted' },
    { year: 2008, significance: 'Global financial crisis', notes: 'Yu (Enthusiasm) - ironic overconfidence' },
    { year: 2016, significance: 'Brexit, Trump election', notes: 'Zhen (Shock) - political upheaval' },
    { year: 2019, significance: 'Pre-pandemic normalcy', notes: 'Wu-wang (Innocence) - unexpected brewing' },
    { year: 2020, significance: 'COVID-19 pandemic', notes: 'Ming-yi (Darkening of Light) - remarkable fit' },
    { year: 2024, significance: 'AI boom, global elections', notes: 'Feng (Abundance) - peak and fullness' },
    { year: 2026, significance: 'Year of Fellowship', notes: 'Tong-ren (Fellowship) - coming together' },

    // Previous cycle (1924-1983)
    { year: 1929, significance: 'Stock market crash', notes: 'Same as 1989 position' },
    { year: 1939, significance: 'WWII begins', notes: 'Same as 1999 position' },
    { year: 1945, significance: 'WWII ends, atomic bombs', notes: 'Same as 2005 position' },
    { year: 1969, significance: 'Moon landing, Woodstock', notes: 'Same as 2029 position' },

    // Earlier cycles
    { year: 1914, significance: 'WWI begins' },
    { year: 1776, significance: 'American independence' },
    { year: 1789, significance: 'French Revolution' },
  ];

  return significantYears.map(({ year, significance, notes }) => ({
    year,
    hexagram: getShaoYongYearHexagram(year),
    historicalSignificance: significance,
    correlationNotes: notes,
  }));
}

/**
 * Find years with the same hexagram as a given year (for pattern analysis)
 *
 * @param year - Reference year
 * @param rangeStart - Start of search range
 * @param rangeEnd - End of search range
 * @returns Array of years with the same hexagram
 */
export function findSameHexagramYears(
  year: number,
  rangeStart: number = 1900,
  rangeEnd: number = 2100
): number[] {
  const reference = getShaoYongYearHexagram(year);
  return findYearsWithHexagram(reference.kingWenNumber, rangeStart, rangeEnd);
}

/**
 * Generate a correlation report comparing hexagram meanings to historical events
 *
 * @param years - Array of years to analyze
 * @returns Formatted report string
 */
export function generateCorrelationReport(years: number[]): string {
  const lines: string[] = [
    '# Shao Yong Year Hexagram Correlation Report',
    '━'.repeat(60),
    '',
  ];

  for (const year of years) {
    const result = getShaoYongYearHexagram(year);
    lines.push(`## ${year}`);
    lines.push(`**${result.hexagram.unicode} ${result.hexagram.chinese} (${result.hexagram.pinyin})** - "${result.hexagram.meaning}"`);
    lines.push(`King Wen #${result.kingWenNumber} | Fu Xi #${result.fuXiCode} | Cycle Position: ${result.cyclePosition + 1}/60`);
    lines.push(`Jia-Zi Cycle: ${result.jiaZiCycle.startYear}-${result.jiaZiCycle.endYear}`);
    lines.push('');
  }

  return lines.join('\n');
}
