/**
 * Macro Cycle Context (Yuan-Hui-Yun-Shi 元會運世)
 * Source: Ma & Zeng 2020 "Hexagram-Allocated Table of Shao Yong's 129,600-Year
 * Supreme World-Ordering Principles" + vol1-lower extractions
 *
 * Structure:
 * - 1 Yuan (元) = 129,600 years = 12 Hui
 * - 1 Hui (會) = 10,800 years = 30 Yun
 * - 1 Yun (運) = 360 years = 12 Shi
 * - 1 Shi (世) = 30 years
 */

export interface MacroCycleContext {
  hui: {
    name: string;
    chinese: string; // Traditional
    chineseSimplified: string; // Simplified
    inspector: string;
    inspectorChinese: string;
    inspectorUnicode: string;
    season: string;
    branch: string;
    branchNumber: number;
    hexagramNumber: number;
    hexagramUnicode: string;
    startYear: number;
    endYear: number;
  };
  yun: {
    hexagramNumber: number;
    unicode: string;
    chinese: string; // Traditional
    chineseSimplified: string; // Simplified
    pinyin: string;
    english: string;
    startYear: number;
    endYear: number;
    yunNumber: number; // 1-360 within Yuan
  };
  shi: {
    hexagramNumber: number;
    unicode: string;
    chinese: string; // Traditional
    chineseSimplified: string; // Simplified
    pinyin: string;
    english: string;
    startYear: number;
    endYear: number;
    shiNumber: number; // 1-4320 within Yuan
  };
}

/**
 * 12 Hui (Epochs) data from Ma & Zeng 2020 Table 7
 * Each Hui spans 10,800 years and is associated with an Earthly Branch
 */
interface HuiData {
  branch: string;
  branchChinese: string;
  branchNumber: number; // 1-12
  hexagramNumber: number; // King Wen number
  hexagramUnicode: string;
  hexagramChinese: string;
  season: string;
  inspector: string; // Principal hexagram that inspects this season
  inspectorChinese: string;
  inspectorUnicode: string;
  startYear: number;
  endYear: number;
}

const HUI_DATA: HuiData[] = [
  {
    branch: 'Zi', branchChinese: '子', branchNumber: 1,
    hexagramNumber: 24, hexagramUnicode: '䷗', hexagramChinese: '復',
    season: 'Winter', inspector: 'Qian', inspectorChinese: '乾', inspectorUnicode: '☰',
    startYear: -67017, endYear: -56218
  },
  {
    branch: 'Chou', branchChinese: '丑', branchNumber: 2,
    hexagramNumber: 19, hexagramUnicode: '䷒', hexagramChinese: '臨',
    season: 'Winter', inspector: 'Qian', inspectorChinese: '乾', inspectorUnicode: '☰',
    startYear: -56217, endYear: -45418
  },
  {
    branch: 'Yin', branchChinese: '寅', branchNumber: 3,
    hexagramNumber: 11, hexagramUnicode: '䷊', hexagramChinese: '泰',
    season: 'Spring', inspector: 'Li', inspectorChinese: '離', inspectorUnicode: '☲',
    startYear: -45417, endYear: -34618
  },
  {
    branch: 'Mao', branchChinese: '卯', branchNumber: 4,
    hexagramNumber: 34, hexagramUnicode: '䷡', hexagramChinese: '大壯',
    season: 'Spring', inspector: 'Li', inspectorChinese: '離', inspectorUnicode: '☲',
    startYear: -34617, endYear: -23818
  },
  {
    branch: 'Chen', branchChinese: '辰', branchNumber: 5,
    hexagramNumber: 43, hexagramUnicode: '䷪', hexagramChinese: '夬',
    season: 'Spring', inspector: 'Li', inspectorChinese: '離', inspectorUnicode: '☲',
    startYear: -23817, endYear: -13018
  },
  {
    branch: 'Si', branchChinese: '巳', branchNumber: 6,
    hexagramNumber: 1, hexagramUnicode: '䷀', hexagramChinese: '乾',
    season: 'Summer', inspector: 'Kan', inspectorChinese: '坎', inspectorUnicode: '☵',
    startYear: -13017, endYear: -2218
  },
  {
    branch: 'Wu', branchChinese: '午', branchNumber: 7,
    hexagramNumber: 44, hexagramUnicode: '䷫', hexagramChinese: '姤',
    season: 'Summer', inspector: 'Kan', inspectorChinese: '坎', inspectorUnicode: '☵',
    startYear: -2217, endYear: 8583
  },
  {
    branch: 'Wei', branchChinese: '未', branchNumber: 8,
    hexagramNumber: 33, hexagramUnicode: '䷠', hexagramChinese: '遯',
    season: 'Summer', inspector: 'Kan', inspectorChinese: '坎', inspectorUnicode: '☵',
    startYear: 8584, endYear: 19383
  },
  {
    branch: 'Shen', branchChinese: '申', branchNumber: 9,
    hexagramNumber: 12, hexagramUnicode: '䷋', hexagramChinese: '否',
    season: 'Autumn', inspector: 'Kun', inspectorChinese: '坤', inspectorUnicode: '☷',
    startYear: 19384, endYear: 30183
  },
  {
    branch: 'You', branchChinese: '酉', branchNumber: 10,
    hexagramNumber: 20, hexagramUnicode: '䷓', hexagramChinese: '觀',
    season: 'Autumn', inspector: 'Kun', inspectorChinese: '坤', inspectorUnicode: '☷',
    startYear: 30184, endYear: 40983
  },
  {
    branch: 'Xu', branchChinese: '戌', branchNumber: 11,
    hexagramNumber: 23, hexagramUnicode: '䷖', hexagramChinese: '剝',
    season: 'Autumn', inspector: 'Kun', inspectorChinese: '坤', inspectorUnicode: '☷',
    startYear: 40984, endYear: 51783
  },
  {
    branch: 'Hai', branchChinese: '亥', branchNumber: 12,
    hexagramNumber: 2, hexagramUnicode: '䷁', hexagramChinese: '坤',
    season: 'Winter', inspector: 'Qian', inspectorChinese: '乾', inspectorUnicode: '☰',
    startYear: 51784, endYear: 62583
  },
];

/**
 * Qi-Term hexagram data for each Principal Hexagram
 * Each Principal has 6 derivatives covering 5,400 years each
 * Source: Ma & Zeng 2020 Table 8
 */
interface QiTermHexagram {
  hexagramNumber: number;
  unicode: string;
  chinese: string;
  pinyin: string;
  english: string;
  solarTerm: string;
  durationYears: number;
}

interface PrincipalHexagramData {
  principal: string;
  hexagramNumber: number;
  derivatives: QiTermHexagram[];
}

const PRINCIPAL_HEXAGRAM_DATA: PrincipalHexagramData[] = [
  {
    principal: 'Li',
    hexagramNumber: 30,
    derivatives: [
      { hexagramNumber: 56, unicode: '䷷', chinese: '旅', pinyin: 'Lǚ', english: 'The Wanderer', solarTerm: 'Winter Solstice', durationYears: 5400 },
      { hexagramNumber: 14, unicode: '䷍', chinese: '大有', pinyin: 'Dàyǒu', english: 'Possession in Great Measure', solarTerm: 'Less Cold', durationYears: 5400 },
      { hexagramNumber: 21, unicode: '䷔', chinese: '噬嗑', pinyin: 'Shìkè', english: 'Biting Through', solarTerm: 'Great Cold', durationYears: 5400 },
      { hexagramNumber: 35, unicode: '䷢', chinese: '晉', pinyin: 'Jìn', english: 'Progress', solarTerm: 'Spring Beginning', durationYears: 5400 },
      { hexagramNumber: 13, unicode: '䷌', chinese: '同人', pinyin: 'Tóngrén', english: 'Fellowship with Men', solarTerm: 'Rain Water', durationYears: 5400 },
      { hexagramNumber: 55, unicode: '䷶', chinese: '豐', pinyin: 'Fēng', english: 'Abundance', solarTerm: 'Insect Waking', durationYears: 5400 },
    ]
  },
  {
    principal: 'Qian',
    hexagramNumber: 1,
    derivatives: [
      { hexagramNumber: 44, unicode: '䷫', chinese: '姤', pinyin: 'Gòu', english: 'Coming to Meet', solarTerm: 'Spring Equinox', durationYears: 5400 },
      { hexagramNumber: 13, unicode: '䷌', chinese: '同人', pinyin: 'Tóngrén', english: 'Fellowship with Men', solarTerm: 'Pure Brightness', durationYears: 5400 },
      { hexagramNumber: 10, unicode: '䷉', chinese: '履', pinyin: 'Lǚ', english: 'Treading', solarTerm: 'Grain Rain', durationYears: 5400 },
      { hexagramNumber: 9, unicode: '䷈', chinese: '小畜', pinyin: 'Xiǎoxù', english: 'The Taming Power of the Small', solarTerm: 'Summer Beginning', durationYears: 5400 },
      { hexagramNumber: 14, unicode: '䷍', chinese: '大有', pinyin: 'Dàyǒu', english: 'Possession in Great Measure', solarTerm: 'Less Fullness', durationYears: 5400 },
      { hexagramNumber: 43, unicode: '䷪', chinese: '夬', pinyin: 'Guài', english: 'Break-through', solarTerm: 'Grain in Ear', durationYears: 5400 },
    ]
  },
  {
    principal: 'Kan',
    hexagramNumber: 29,
    derivatives: [
      { hexagramNumber: 60, unicode: '䷻', chinese: '節', pinyin: 'Jié', english: 'Limitation', solarTerm: 'Summer Solstice', durationYears: 5400 },
      { hexagramNumber: 8, unicode: '䷇', chinese: '比', pinyin: 'Bǐ', english: 'Holding Together', solarTerm: 'Less Heat', durationYears: 5400 },
      { hexagramNumber: 48, unicode: '䷯', chinese: '井', pinyin: 'Jǐng', english: 'The Well', solarTerm: 'Great Heat', durationYears: 5400 },
      { hexagramNumber: 47, unicode: '䷮', chinese: '困', pinyin: 'Kùn', english: 'Oppression', solarTerm: 'Autumn Beginning', durationYears: 5400 },
      { hexagramNumber: 7, unicode: '䷆', chinese: '師', pinyin: 'Shī', english: 'The Army', solarTerm: 'Heat End', durationYears: 5400 },
      { hexagramNumber: 59, unicode: '䷺', chinese: '渙', pinyin: 'Huàn', english: 'Dispersion', solarTerm: 'White Dew', durationYears: 5400 },
    ]
  },
  {
    principal: 'Kun',
    hexagramNumber: 2,
    derivatives: [
      { hexagramNumber: 24, unicode: '䷗', chinese: '復', pinyin: 'Fù', english: 'Return', solarTerm: 'Autumn Equinox', durationYears: 5400 },
      { hexagramNumber: 7, unicode: '䷆', chinese: '師', pinyin: 'Shī', english: 'The Army', solarTerm: 'Cold Dew', durationYears: 5400 },
      { hexagramNumber: 15, unicode: '䷎', chinese: '謙', pinyin: 'Qiān', english: 'Modesty', solarTerm: 'Frost Descending', durationYears: 5400 },
      { hexagramNumber: 16, unicode: '䷏', chinese: '豫', pinyin: 'Yù', english: 'Enthusiasm', solarTerm: 'Winter Beginning', durationYears: 5400 },
      { hexagramNumber: 8, unicode: '䷇', chinese: '比', pinyin: 'Bǐ', english: 'Holding Together', solarTerm: 'Less Snow', durationYears: 5400 },
      { hexagramNumber: 23, unicode: '䷖', chinese: '剝', pinyin: 'Bō', english: 'Splitting Apart', solarTerm: 'Great Snow', durationYears: 5400 },
    ]
  },
];

/**
 * On-duty hexagram sequence for Shi periods (30 years each)
 * This is the 60 hexagrams excluding the 4 principals (Qian, Kun, Kan, Li)
 * Following Fu Xi circular sequence clockwise
 */
const ON_DUTY_HEXAGRAM_SEQUENCE = [
  { number: 44, unicode: '䷫', chinese: '姤', pinyin: 'Gòu', english: 'Coming to Meet' },
  { number: 33, unicode: '䷠', chinese: '遯', pinyin: 'Dùn', english: 'Retreat' },
  { number: 12, unicode: '䷋', chinese: '否', pinyin: 'Pǐ', english: 'Standstill' },
  { number: 20, unicode: '䷓', chinese: '觀', pinyin: 'Guān', english: 'Contemplation' },
  { number: 23, unicode: '䷖', chinese: '剝', pinyin: 'Bō', english: 'Splitting Apart' },
  { number: 35, unicode: '䷢', chinese: '晉', pinyin: 'Jìn', english: 'Progress' },
  { number: 14, unicode: '䷍', chinese: '大有', pinyin: 'Dàyǒu', english: 'Possession in Great Measure' },
  { number: 34, unicode: '䷡', chinese: '大壯', pinyin: 'Dàzhuàng', english: 'The Power of the Great' },
  { number: 43, unicode: '䷪', chinese: '夬', pinyin: 'Guài', english: 'Break-through' },
  { number: 5, unicode: '䷄', chinese: '需', pinyin: 'Xū', english: 'Waiting' },
  { number: 26, unicode: '䷙', chinese: '大畜', pinyin: 'Dàxù', english: 'The Taming Power of the Great' },
  { number: 11, unicode: '䷊', chinese: '泰', pinyin: 'Tài', english: 'Peace' },
  { number: 10, unicode: '䷉', chinese: '履', pinyin: 'Lǚ', english: 'Treading' },
  { number: 9, unicode: '䷈', chinese: '小畜', pinyin: 'Xiǎoxù', english: 'The Taming Power of the Small' },
  { number: 13, unicode: '䷌', chinese: '同人', pinyin: 'Tóngrén', english: 'Fellowship with Men' },
  { number: 25, unicode: '䷘', chinese: '無妄', pinyin: 'Wúwàng', english: 'Innocence' },
  { number: 36, unicode: '䷣', chinese: '明夷', pinyin: 'Míngyí', english: 'Darkening of the Light' },
  { number: 22, unicode: '䷕', chinese: '賁', pinyin: 'Bì', english: 'Grace' },
  { number: 63, unicode: '䷾', chinese: '既濟', pinyin: 'Jìjì', english: 'After Completion' },
  { number: 37, unicode: '䷤', chinese: '家人', pinyin: 'Jiārén', english: 'The Family' },
  { number: 55, unicode: '䷶', chinese: '豐', pinyin: 'Fēng', english: 'Abundance' },
  { number: 30, unicode: '䷝', chinese: '離', pinyin: 'Lí', english: 'The Clinging' }, // Note: Skip as principal but included for sequence
  { number: 49, unicode: '䷰', chinese: '革', pinyin: 'Gé', english: 'Revolution' },
  { number: 13, unicode: '䷌', chinese: '同人', pinyin: 'Tóngrén', english: 'Fellowship with Men' },
  { number: 19, unicode: '䷒', chinese: '臨', pinyin: 'Lín', english: 'Approach' },
  { number: 41, unicode: '䷨', chinese: '損', pinyin: 'Sǔn', english: 'Decrease' },
  { number: 60, unicode: '䷻', chinese: '節', pinyin: 'Jié', english: 'Limitation' },
  { number: 61, unicode: '䷼', chinese: '中孚', pinyin: 'Zhōngfú', english: 'Inner Truth' },
  { number: 54, unicode: '䷵', chinese: '歸妹', pinyin: 'Guīmèi', english: 'The Marrying Maiden' },
  { number: 38, unicode: '䷥', chinese: '睽', pinyin: 'Kuí', english: 'Opposition' },
  { number: 58, unicode: '䷹', chinese: '兌', pinyin: 'Duì', english: 'The Joyous' },
  { number: 10, unicode: '䷉', chinese: '履', pinyin: 'Lǚ', english: 'Treading' },
  { number: 28, unicode: '䷛', chinese: '大過', pinyin: 'Dàguò', english: 'Preponderance of the Great' },
  { number: 50, unicode: '䷱', chinese: '鼎', pinyin: 'Dǐng', english: 'The Caldron' },
  { number: 32, unicode: '䷟', chinese: '恆', pinyin: 'Héng', english: 'Duration' },
  { number: 57, unicode: '䷸', chinese: '巽', pinyin: 'Xùn', english: 'The Gentle' },
  { number: 48, unicode: '䷯', chinese: '井', pinyin: 'Jǐng', english: 'The Well' },
  { number: 18, unicode: '䷑', chinese: '蠱', pinyin: 'Gǔ', english: 'Work on What Has Been Spoiled' },
  { number: 46, unicode: '䷭', chinese: '升', pinyin: 'Shēng', english: 'Pushing Upward' },
  { number: 6, unicode: '䷅', chinese: '訟', pinyin: 'Sòng', english: 'Conflict' },
  { number: 47, unicode: '䷮', chinese: '困', pinyin: 'Kùn', english: 'Oppression' },
  { number: 64, unicode: '䷿', chinese: '未濟', pinyin: 'Wèijì', english: 'Before Completion' },
  { number: 40, unicode: '䷧', chinese: '解', pinyin: 'Xiè', english: 'Deliverance' },
  { number: 59, unicode: '䷺', chinese: '渙', pinyin: 'Huàn', english: 'Dispersion' },
  { number: 4, unicode: '䷃', chinese: '蒙', pinyin: 'Méng', english: 'Youthful Folly' },
  { number: 7, unicode: '䷆', chinese: '師', pinyin: 'Shī', english: 'The Army' },
  { number: 24, unicode: '䷗', chinese: '復', pinyin: 'Fù', english: 'Return' },
  { number: 42, unicode: '䷩', chinese: '益', pinyin: 'Yì', english: 'Increase' },
  { number: 3, unicode: '䷂', chinese: '屯', pinyin: 'Zhūn', english: 'Difficulty at the Beginning' },
  { number: 27, unicode: '䷚', chinese: '頤', pinyin: 'Yí', english: 'The Corners of the Mouth' },
  { number: 51, unicode: '䷲', chinese: '震', pinyin: 'Zhèn', english: 'The Arousing' },
  { number: 16, unicode: '䷏', chinese: '豫', pinyin: 'Yù', english: 'Enthusiasm' },
  { number: 62, unicode: '䷽', chinese: '小過', pinyin: 'Xiǎoguò', english: 'Preponderance of the Small' },
  { number: 53, unicode: '䷴', chinese: '漸', pinyin: 'Jiàn', english: 'Development' },
  { number: 39, unicode: '䷦', chinese: '蹇', pinyin: 'Jiǎn', english: 'Obstruction' },
  { number: 52, unicode: '䷳', chinese: '艮', pinyin: 'Gèn', english: 'Keeping Still' },
  { number: 15, unicode: '䷎', chinese: '謙', pinyin: 'Qiān', english: 'Modesty' },
  { number: 56, unicode: '䷷', chinese: '旅', pinyin: 'Lǚ', english: 'The Wanderer' },
  { number: 31, unicode: '䷞', chinese: '咸', pinyin: 'Xián', english: 'Influence' },
  { number: 8, unicode: '䷇', chinese: '比', pinyin: 'Bǐ', english: 'Holding Together' },
];

// Constants for cycle calculations
const YUAN_YEARS = 129600;
const HUI_YEARS = 10800;
const YUN_YEARS = 360;
const SHI_YEARS = 30;
const YUAN_START_YEAR = -67017;

/**
 * Find which Hui a given year falls into
 */
function findHuiForYear(year: number): HuiData | null {
  for (const hui of HUI_DATA) {
    if (year >= hui.startYear && year <= hui.endYear) {
      return hui;
    }
  }
  return null;
}

/**
 * Get the Qi-Term hexagram for a position within a Hui
 * Each Hui is inspected by a Principal hexagram with 6 derivatives
 */
function getQiTermHexagram(hui: HuiData, yearWithinHui: number): QiTermHexagram | null {
  // Find principal hexagram data for this season's inspector
  const principalData = PRINCIPAL_HEXAGRAM_DATA.find(p => p.principal === hui.inspector);
  if (!principalData) return null;

  // Each derivative covers 5400 years (10800 / 2 = 5400 for half-hui)
  // Actually, looking at Ma & Zeng Table 9, each Qi-Term is 5400 years
  // and there are 2 Qi-Terms per Hui (each Hui = 10,800 years)
  const qiTermIndex = Math.floor(yearWithinHui / 5400);
  const derivativeIndex = qiTermIndex % principalData.derivatives.length;

  return principalData.derivatives[derivativeIndex] || null;
}

/**
 * Calculate the Yun (Revolution) data for a given year
 */
function calculateYun(year: number, hui: HuiData): {
  hexagramNumber: number;
  unicode: string;
  chinese: string;
  chineseSimplified: string;
  pinyin: string;
  english: string;
  startYear: number;
  endYear: number;
  yunNumber: number;
} {
  const yearFromYuanStart = year - YUAN_START_YEAR;
  const yunNumber = Math.floor(yearFromYuanStart / YUN_YEARS) + 1;
  const yunStartYear = YUAN_START_YEAR + (yunNumber - 1) * YUN_YEARS;
  const yunEndYear = yunStartYear + YUN_YEARS - 1;

  // Get the Qi-Term hexagram for this Yun position
  const yearWithinHui = year - hui.startYear;
  const qiTerm = getQiTermHexagram(hui, yearWithinHui);

  // Use Qi-Term hexagram if available, otherwise fall back to a calculation
  if (qiTerm) {
    return {
      hexagramNumber: qiTerm.hexagramNumber,
      unicode: qiTerm.unicode,
      chinese: qiTerm.chinese,
      chineseSimplified: qiTerm.chinese, // Would need separate simplified data
      pinyin: qiTerm.pinyin,
      english: qiTerm.english,
      startYear: yunStartYear,
      endYear: yunEndYear,
      yunNumber,
    };
  }

  // Fallback for edge cases
  return {
    hexagramNumber: 60,
    unicode: '䷻',
    chinese: '節',
    chineseSimplified: '节',
    pinyin: 'Jié',
    english: 'Limitation',
    startYear: yunStartYear,
    endYear: yunEndYear,
    yunNumber,
  };
}

/**
 * Calculate the Shi (Generation) data for a given year
 */
function calculateShi(year: number): {
  hexagramNumber: number;
  unicode: string;
  chinese: string;
  chineseSimplified: string;
  pinyin: string;
  english: string;
  startYear: number;
  endYear: number;
  shiNumber: number;
} {
  const yearFromYuanStart = year - YUAN_START_YEAR;
  const shiNumber = Math.floor(yearFromYuanStart / SHI_YEARS) + 1;
  const shiStartYear = YUAN_START_YEAR + (shiNumber - 1) * SHI_YEARS;
  const shiEndYear = shiStartYear + SHI_YEARS - 1;

  // Use on-duty hexagram sequence (60 hexagrams, cycling)
  const hexagramIndex = (shiNumber - 1) % ON_DUTY_HEXAGRAM_SEQUENCE.length;
  const hexagram = ON_DUTY_HEXAGRAM_SEQUENCE[hexagramIndex];

  return {
    hexagramNumber: hexagram.number,
    unicode: hexagram.unicode,
    chinese: hexagram.chinese,
    chineseSimplified: hexagram.chinese, // Would need separate simplified data
    pinyin: hexagram.pinyin,
    english: hexagram.english,
    startYear: shiStartYear,
    endYear: shiEndYear,
    shiNumber,
  };
}

/**
 * Get macro cycle context for a year
 * Full implementation based on Ma & Zeng 2020 methodology
 */
export function getMacroCycleContext(year: number): MacroCycleContext {
  // Find the Hui for this year
  const hui = findHuiForYear(year);

  if (!hui) {
    // Year is outside the Yuan cycle, return default modern era values
    return getDefaultMacroCycleContext();
  }

  // Calculate Yun and Shi
  const yun = calculateYun(year, hui);
  const shi = calculateShi(year);

  return {
    hui: {
      name: hui.branch,
      chinese: `${hui.branchChinese}會`,
      chineseSimplified: `${hui.branchChinese}会`,
      inspector: hui.inspector,
      inspectorChinese: hui.inspectorChinese,
      inspectorUnicode: hui.inspectorUnicode,
      season: hui.season,
      branch: hui.branch,
      branchNumber: hui.branchNumber,
      hexagramNumber: hui.hexagramNumber,
      hexagramUnicode: hui.hexagramUnicode,
      startYear: hui.startYear,
      endYear: hui.endYear,
    },
    yun,
    shi,
  };
}

/**
 * Default macro cycle context for modern era (fallback)
 */
function getDefaultMacroCycleContext(): MacroCycleContext {
  const hui = HUI_DATA[6]; // Wu (午) - current era
  return {
    hui: {
      name: 'Wu',
      chinese: '午會',
      chineseSimplified: '午会',
      inspector: 'Kan',
      inspectorChinese: '坎',
      inspectorUnicode: '☵',
      season: 'Summer',
      branch: 'Wu',
      branchNumber: 7,
      hexagramNumber: 44,
      hexagramUnicode: '䷫',
      startYear: hui.startYear,
      endYear: hui.endYear,
    },
    yun: {
      hexagramNumber: 60,
      unicode: '䷻',
      chinese: '節',
      chineseSimplified: '节',
      pinyin: 'Jié',
      english: 'Limitation',
      startYear: -2217,
      endYear: 3183,
      yunNumber: 181,
    },
    shi: {
      hexagramNumber: 28,
      unicode: '䷛',
      chinese: '大過',
      chineseSimplified: '大过',
      pinyin: 'Dàguò',
      english: 'Preponderance of the Great',
      startYear: -57,
      endYear: 2103,
      shiNumber: 2233,
    },
  };
}

// Export the legacy constant for backward compatibility
export const CURRENT_MACRO_CYCLE = getDefaultMacroCycleContext();
