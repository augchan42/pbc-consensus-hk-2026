/**
 * Celestial Stems (十天干) and Terrestrial Branches (十二地支)
 * Source: Ma & Zeng 2020 Table 5
 */

export interface CelestialStem {
  chinese: string;
  pinyin: string;
  wuXing: string;
  yinYang: 'yang' | 'yin';
}

export const CELESTIAL_STEMS: CelestialStem[] = [
  { chinese: '甲', pinyin: 'Jiǎ', wuXing: 'wood', yinYang: 'yang' },
  { chinese: '乙', pinyin: 'Yǐ', wuXing: 'wood', yinYang: 'yin' },
  { chinese: '丙', pinyin: 'Bǐng', wuXing: 'fire', yinYang: 'yang' },
  { chinese: '丁', pinyin: 'Dīng', wuXing: 'fire', yinYang: 'yin' },
  { chinese: '戊', pinyin: 'Wù', wuXing: 'earth', yinYang: 'yang' },
  { chinese: '己', pinyin: 'Jǐ', wuXing: 'earth', yinYang: 'yin' },
  { chinese: '庚', pinyin: 'Gēng', wuXing: 'metal', yinYang: 'yang' },
  { chinese: '辛', pinyin: 'Xīn', wuXing: 'metal', yinYang: 'yin' },
  { chinese: '壬', pinyin: 'Rén', wuXing: 'water', yinYang: 'yang' },
  { chinese: '癸', pinyin: 'Guǐ', wuXing: 'water', yinYang: 'yin' },
];

export interface TerrestrialBranch {
  chinese: string;
  pinyin: string;
  animal: string;
  animalChinese: string; // Traditional
  animalChineseSimplified: string; // Simplified
  wuXing: string;
  hour: string;
  organ: string;
  organChinese: string; // Traditional
  organChineseSimplified: string; // Simplified
}

export const TERRESTRIAL_BRANCHES: TerrestrialBranch[] = [
  { chinese: '子', pinyin: 'Zǐ', animal: 'Rat', animalChinese: '鼠', animalChineseSimplified: '鼠', wuXing: 'water', hour: '23-01', organ: 'Gall Bladder', organChinese: '膽', organChineseSimplified: '胆' },
  { chinese: '丑', pinyin: 'Chǒu', animal: 'Ox', animalChinese: '牛', animalChineseSimplified: '牛', wuXing: 'earth', hour: '01-03', organ: 'Liver', organChinese: '肝', organChineseSimplified: '肝' },
  { chinese: '寅', pinyin: 'Yín', animal: 'Tiger', animalChinese: '虎', animalChineseSimplified: '虎', wuXing: 'wood', hour: '03-05', organ: 'Lung', organChinese: '肺', organChineseSimplified: '肺' },
  { chinese: '卯', pinyin: 'Mǎo', animal: 'Rabbit', animalChinese: '兔', animalChineseSimplified: '兔', wuXing: 'wood', hour: '05-07', organ: 'Large Intestine', organChinese: '大腸', organChineseSimplified: '大肠' },
  { chinese: '辰', pinyin: 'Chén', animal: 'Dragon', animalChinese: '龍', animalChineseSimplified: '龙', wuXing: 'earth', hour: '07-09', organ: 'Stomach', organChinese: '胃', organChineseSimplified: '胃' },
  { chinese: '巳', pinyin: 'Sì', animal: 'Snake', animalChinese: '蛇', animalChineseSimplified: '蛇', wuXing: 'fire', hour: '09-11', organ: 'Spleen', organChinese: '脾', organChineseSimplified: '脾' },
  { chinese: '午', pinyin: 'Wǔ', animal: 'Horse', animalChinese: '馬', animalChineseSimplified: '马', wuXing: 'fire', hour: '11-13', organ: 'Heart', organChinese: '心', organChineseSimplified: '心' },
  { chinese: '未', pinyin: 'Wèi', animal: 'Goat', animalChinese: '羊', animalChineseSimplified: '羊', wuXing: 'earth', hour: '13-15', organ: 'Small Intestine', organChinese: '小腸', organChineseSimplified: '小肠' },
  { chinese: '申', pinyin: 'Shēn', animal: 'Monkey', animalChinese: '猴', animalChineseSimplified: '猴', wuXing: 'metal', hour: '15-17', organ: 'Urinary Bladder', organChinese: '膀胱', organChineseSimplified: '膀胱' },
  { chinese: '酉', pinyin: 'Yǒu', animal: 'Rooster', animalChinese: '雞', animalChineseSimplified: '鸡', wuXing: 'metal', hour: '17-19', organ: 'Kidney', organChinese: '腎', organChineseSimplified: '肾' },
  { chinese: '戌', pinyin: 'Xū', animal: 'Dog', animalChinese: '狗', animalChineseSimplified: '狗', wuXing: 'earth', hour: '19-21', organ: 'Pericardium', organChinese: '心包', organChineseSimplified: '心包' },
  { chinese: '亥', pinyin: 'Hài', animal: 'Pig', animalChinese: '豬', animalChineseSimplified: '猪', wuXing: 'water', hour: '21-23', organ: 'Triple Burner', organChinese: '三焦', organChineseSimplified: '三焦' },
];

/**
 * Get stem-branch (干支) for a given year
 */
export function getYearStemBranch(year: number): {
  stem: CelestialStem;
  branch: TerrestrialBranch;
  combined: string;
  pinyin: string;
} {
  // 1984 = 甲子 (Jiǎ-Zǐ), index 0
  const cycleStart = 1984;
  const offset = ((year - cycleStart) % 60 + 60) % 60;

  const stemIndex = offset % 10;
  const branchIndex = offset % 12;

  const stem = CELESTIAL_STEMS[stemIndex];
  const branch = TERRESTRIAL_BRANCHES[branchIndex];

  return {
    stem,
    branch,
    combined: `${stem.chinese}${branch.chinese}`,
    pinyin: `${stem.pinyin}-${branch.pinyin}`,
  };
}
