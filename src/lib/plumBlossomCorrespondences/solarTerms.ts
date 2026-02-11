/**
 * 24 Solar Terms (二十四节气)
 * Source: Ma & Zeng 2020 Table 6
 */

export interface SolarTerm {
  chinese: string; // Traditional
  chineseSimplified: string; // Simplified
  pinyin: string;
  english: string;
  eclipticLongitude: number;
  type: 'nodal' | 'medial';
  season: string;
  branch: string;
  approximateDate: string; // Format: "MM-DD"
}

export const SOLAR_TERMS: SolarTerm[] = [
  // Spring
  { chinese: '立春', chineseSimplified: '立春', pinyin: 'Lìchūn', english: 'Spring Beginning', eclipticLongitude: 315, type: 'nodal', season: 'spring', branch: '寅', approximateDate: '02-04' },
  { chinese: '雨水', chineseSimplified: '雨水', pinyin: 'Yǔshuǐ', english: 'Rain Water', eclipticLongitude: 330, type: 'medial', season: 'spring', branch: '寅', approximateDate: '02-19' },
  { chinese: '驚蟄', chineseSimplified: '惊蛰', pinyin: 'Jīngzhé', english: 'Insect Awakening', eclipticLongitude: 345, type: 'nodal', season: 'spring', branch: '卯', approximateDate: '03-06' },
  { chinese: '春分', chineseSimplified: '春分', pinyin: 'Chūnfēn', english: 'Spring Equinox', eclipticLongitude: 0, type: 'medial', season: 'spring', branch: '卯', approximateDate: '03-21' },
  { chinese: '清明', chineseSimplified: '清明', pinyin: 'Qīngmíng', english: 'Pure Brightness', eclipticLongitude: 15, type: 'nodal', season: 'spring', branch: '辰', approximateDate: '04-05' },
  { chinese: '穀雨', chineseSimplified: '谷雨', pinyin: 'Gǔyǔ', english: 'Grain Rain', eclipticLongitude: 30, type: 'medial', season: 'spring', branch: '辰', approximateDate: '04-20' },
  // Summer
  { chinese: '立夏', chineseSimplified: '立夏', pinyin: 'Lìxià', english: 'Summer Beginning', eclipticLongitude: 45, type: 'nodal', season: 'summer', branch: '巳', approximateDate: '05-06' },
  { chinese: '小滿', chineseSimplified: '小满', pinyin: 'Xiǎomǎn', english: 'Lesser Fullness', eclipticLongitude: 60, type: 'medial', season: 'summer', branch: '巳', approximateDate: '05-21' },
  { chinese: '芒種', chineseSimplified: '芒种', pinyin: 'Mángzhòng', english: 'Grain in Ear', eclipticLongitude: 75, type: 'nodal', season: 'summer', branch: '午', approximateDate: '06-06' },
  { chinese: '夏至', chineseSimplified: '夏至', pinyin: 'Xiàzhì', english: 'Summer Solstice', eclipticLongitude: 90, type: 'medial', season: 'summer', branch: '午', approximateDate: '06-21' },
  { chinese: '小暑', chineseSimplified: '小暑', pinyin: 'Xiǎoshǔ', english: 'Lesser Heat', eclipticLongitude: 105, type: 'nodal', season: 'summer', branch: '未', approximateDate: '07-07' },
  { chinese: '大暑', chineseSimplified: '大暑', pinyin: 'Dàshǔ', english: 'Greater Heat', eclipticLongitude: 120, type: 'medial', season: 'summer', branch: '未', approximateDate: '07-23' },
  // Autumn
  { chinese: '立秋', chineseSimplified: '立秋', pinyin: 'Lìqiū', english: 'Autumn Beginning', eclipticLongitude: 135, type: 'nodal', season: 'autumn', branch: '申', approximateDate: '08-08' },
  { chinese: '處暑', chineseSimplified: '处暑', pinyin: 'Chǔshǔ', english: 'End of Heat', eclipticLongitude: 150, type: 'medial', season: 'autumn', branch: '申', approximateDate: '08-23' },
  { chinese: '白露', chineseSimplified: '白露', pinyin: 'Báilù', english: 'White Dew', eclipticLongitude: 165, type: 'nodal', season: 'autumn', branch: '酉', approximateDate: '09-08' },
  { chinese: '秋分', chineseSimplified: '秋分', pinyin: 'Qiūfēn', english: 'Autumn Equinox', eclipticLongitude: 180, type: 'medial', season: 'autumn', branch: '酉', approximateDate: '09-23' },
  { chinese: '寒露', chineseSimplified: '寒露', pinyin: 'Hánlù', english: 'Cold Dew', eclipticLongitude: 195, type: 'nodal', season: 'autumn', branch: '戌', approximateDate: '10-08' },
  { chinese: '霜降', chineseSimplified: '霜降', pinyin: 'Shuāngjiàng', english: 'Frost Descent', eclipticLongitude: 210, type: 'medial', season: 'autumn', branch: '戌', approximateDate: '10-24' },
  // Winter
  { chinese: '立冬', chineseSimplified: '立冬', pinyin: 'Lìdōng', english: 'Winter Beginning', eclipticLongitude: 225, type: 'nodal', season: 'winter', branch: '亥', approximateDate: '11-08' },
  { chinese: '小雪', chineseSimplified: '小雪', pinyin: 'Xiǎoxuě', english: 'Lesser Snow', eclipticLongitude: 240, type: 'medial', season: 'winter', branch: '亥', approximateDate: '11-22' },
  { chinese: '大雪', chineseSimplified: '大雪', pinyin: 'Dàxuě', english: 'Greater Snow', eclipticLongitude: 255, type: 'nodal', season: 'winter', branch: '子', approximateDate: '12-07' },
  { chinese: '冬至', chineseSimplified: '冬至', pinyin: 'Dōngzhì', english: 'Winter Solstice', eclipticLongitude: 270, type: 'medial', season: 'winter', branch: '子', approximateDate: '12-22' },
  { chinese: '小寒', chineseSimplified: '小寒', pinyin: 'Xiǎohán', english: 'Lesser Cold', eclipticLongitude: 285, type: 'nodal', season: 'winter', branch: '丑', approximateDate: '01-06' },
  { chinese: '大寒', chineseSimplified: '大寒', pinyin: 'Dàhán', english: 'Greater Cold', eclipticLongitude: 300, type: 'medial', season: 'winter', branch: '丑', approximateDate: '01-20' },
];

/**
 * Get current solar term for a given date
 */
export function getCurrentSolarTerm(date: Date = new Date()): {
  current: SolarTerm;
  next: SolarTerm;
} {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateNum = month * 100 + day;

  let currentIndex = 0;
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const [termMonth, termDay] = SOLAR_TERMS[i].approximateDate.split('-').map(Number);
    const termDateNum = termMonth * 100 + termDay;
    if (dateNum >= termDateNum) {
      currentIndex = i;
    }
  }

  return {
    current: SOLAR_TERMS[currentIndex],
    next: SOLAR_TERMS[(currentIndex + 1) % 24],
  };
}
