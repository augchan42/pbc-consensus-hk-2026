/**
 * Element-Thing and Social Correspondences
 * Based on Suoyin (索引) classification from Shao Yong
 */

import { ELEMENT_THINGS, SOCIAL_ROLES } from "../core/constants";

/**
 * Get associated things for a Wu Xing element
 */
export function getElementThings(element: string): string[] {
  return ELEMENT_THINGS[element] || [];
}

/**
 * Get social role for a Wu Xing element
 */
export function getSocialRole(element: string): string {
  return SOCIAL_ROLES[element] || "";
}
