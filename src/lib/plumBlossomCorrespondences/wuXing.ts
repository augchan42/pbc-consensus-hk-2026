/**
 * Five Phases (五行) Correspondences
 * Source: Ma & Zeng 2020 Table 1
 */

export interface WuXingElement {
  chinese: string; // Traditional Chinese
  chineseSimplified: string; // Simplified Chinese
  pinyin: string;
  english: string;
  direction: string;
  directionChinese: string; // Traditional
  directionChineseSimplified: string; // Simplified
  season: string;
  seasonChinese: string; // Traditional
  seasonChineseSimplified: string; // Simplified
  color: string;
  colorChinese: string; // Traditional
  colorChineseSimplified: string; // Simplified
  guardian: string;
  guardianChinese: string; // Traditional
  guardianChineseSimplified: string; // Simplified
  yinYang: 'yang' | 'yin';
}

export const WU_XING: Record<string, WuXingElement> = {
  wood: {
    chinese: '木',
    chineseSimplified: '木',
    pinyin: 'mù',
    english: 'Wood',
    direction: 'East',
    directionChinese: '東',
    directionChineseSimplified: '东',
    season: 'Spring',
    seasonChinese: '春',
    seasonChineseSimplified: '春',
    color: 'Azure/Green',
    colorChinese: '綠',
    colorChineseSimplified: '绿',
    guardian: 'Azure Dragon',
    guardianChinese: '青龍',
    guardianChineseSimplified: '青龙',
    yinYang: 'yang',
  },
  fire: {
    chinese: '火',
    chineseSimplified: '火',
    pinyin: 'huǒ',
    english: 'Fire',
    direction: 'South',
    directionChinese: '南',
    directionChineseSimplified: '南',
    season: 'Summer',
    seasonChinese: '夏',
    seasonChineseSimplified: '夏',
    color: 'Red',
    colorChinese: '紅',
    colorChineseSimplified: '红',
    guardian: 'Vermillion Bird',
    guardianChinese: '朱雀',
    guardianChineseSimplified: '朱雀',
    yinYang: 'yang',
  },
  earth: {
    chinese: '土',
    chineseSimplified: '土',
    pinyin: 'tǔ',
    english: 'Earth',
    direction: 'Center',
    directionChinese: '中',
    directionChineseSimplified: '中',
    season: 'Late Summer',
    seasonChinese: '晚夏',
    seasonChineseSimplified: '晚夏',
    color: 'Yellow',
    colorChinese: '黃',
    colorChineseSimplified: '黄',
    guardian: 'Yellow Unicorn',
    guardianChinese: '麒麟',
    guardianChineseSimplified: '麒麟',
    yinYang: 'yin',
  },
  metal: {
    chinese: '金',
    chineseSimplified: '金',
    pinyin: 'jīn',
    english: 'Metal',
    direction: 'West',
    directionChinese: '西',
    directionChineseSimplified: '西',
    season: 'Autumn',
    seasonChinese: '秋',
    seasonChineseSimplified: '秋',
    color: 'White',
    colorChinese: '白',
    colorChineseSimplified: '白',
    guardian: 'White Tiger',
    guardianChinese: '白虎',
    guardianChineseSimplified: '白虎',
    yinYang: 'yin',
  },
  water: {
    chinese: '水',
    chineseSimplified: '水',
    pinyin: 'shuǐ',
    english: 'Water',
    direction: 'North',
    directionChinese: '北',
    directionChineseSimplified: '北',
    season: 'Winter',
    seasonChinese: '冬',
    seasonChineseSimplified: '冬',
    color: 'Black',
    colorChinese: '黑',
    colorChineseSimplified: '黑',
    guardian: 'Black Tortoise',
    guardianChinese: '玄武',
    guardianChineseSimplified: '玄武',
    yinYang: 'yin',
  },
};
