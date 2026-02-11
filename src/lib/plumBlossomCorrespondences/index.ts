/**
 * Plum Blossom (梅花易數) Correspondences
 *
 * Comprehensive correspondence tables for expert-level I Ching interpretation.
 * Based on Ma & Zeng 2020 scholarly publication and Shao Yong's 皇極經世書.
 *
 * @see docs/research/shao-yong-extractions/hexagram-table/index.md
 */

export * from './wuXing';
export * from './stemsBranches';
export * from './solarTerms';
export * from './macroCycles';

import { WU_XING, type WuXingElement } from './wuXing';
import { getYearStemBranch, type CelestialStem, type TerrestrialBranch } from './stemsBranches';
import { getMacroCycleContext, type MacroCycleContext } from './macroCycles';

/**
 * Comprehensive plum blossom context for a year
 */
export interface PlumBlossomYearContext {
  year: number;
  stemBranch: {
    stem: CelestialStem;
    branch: TerrestrialBranch;
    combined: string;
    pinyin: string;
  };
  element: WuXingElement;
  macroCycle: MacroCycleContext;
  animal: string;
  animalChinese: string;
}

export function getPlumBlossomYearContext(year: number): PlumBlossomYearContext {
  const stemBranch = getYearStemBranch(year);
  const element = WU_XING[stemBranch.stem.wuXing];
  const macroCycle = getMacroCycleContext(year);

  return {
    year,
    stemBranch,
    element,
    macroCycle,
    animal: stemBranch.branch.animal,
    animalChinese: stemBranch.branch.animalChinese,
  };
}
