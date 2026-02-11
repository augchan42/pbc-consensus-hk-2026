/**
 * Planetary positions via astronomy-engine
 */

import { Body, EclipticLongitude, SunPosition, EclipticGeoMoon, MakeTime } from "astronomy-engine";
import type { PlanetaryPosition, PlanetName } from "../core/types";
import { zodiacFromLongitude } from "./zodiac";

// Planets computed via EclipticLongitude (heliocentric — correct for planets)
const HELIO_PLANETS: { name: PlanetName; body: Body }[] = [
  { name: "mercury", body: Body.Mercury },
  { name: "venus", body: Body.Venus },
  { name: "mars", body: Body.Mars },
  { name: "jupiter", body: Body.Jupiter },
  { name: "saturn", body: Body.Saturn },
];

// Planets that can be retrograde (not Sun or Moon)
const RETROGRADE_PLANETS: PlanetName[] = ["mercury", "venus", "mars", "jupiter", "saturn"];

/**
 * Check if a planet is retrograde by comparing longitude today vs yesterday
 */
function isRetrograde(body: Body, date: Date): boolean {
  const today = MakeTime(date);
  const yesterday = MakeTime(new Date(date.getTime() - 86400000));
  const lonToday = EclipticLongitude(body, today);
  const lonYesterday = EclipticLongitude(body, yesterday);

  // If longitude decreased (accounting for 360/0 wrap)
  let diff = lonToday - lonYesterday;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

/**
 * Calculate positions for all 7 classical planets
 */
export function calculatePlanetaryPositions(date: Date): PlanetaryPosition[] {
  const astroTime = MakeTime(date);
  const results: PlanetaryPosition[] = [];

  // Sun — geocentric ecliptic longitude via SunPosition
  const sunPos = SunPosition(astroTime);
  const sunZodiac = zodiacFromLongitude(sunPos.elon);
  results.push({
    planet: "sun",
    longitude: sunPos.elon,
    zodiacSign: sunZodiac.sign,
    element: sunZodiac.element,
    degree: sunZodiac.degree,
    isRetrograde: false,
  });

  // Moon — geocentric ecliptic longitude via EclipticGeoMoon
  const moonPos = EclipticGeoMoon(astroTime);
  const moonZodiac = zodiacFromLongitude(moonPos.lon);
  results.push({
    planet: "moon",
    longitude: moonPos.lon,
    zodiacSign: moonZodiac.sign,
    element: moonZodiac.element,
    degree: moonZodiac.degree,
    isRetrograde: false,
  });

  // Other planets — heliocentric ecliptic longitude
  for (const { name, body } of HELIO_PLANETS) {
    const longitude = EclipticLongitude(body, astroTime);
    const zodiac = zodiacFromLongitude(longitude);
    const retrograde = isRetrograde(body, date);

    results.push({
      planet: name,
      longitude,
      zodiacSign: zodiac.sign,
      element: zodiac.element,
      degree: zodiac.degree,
      isRetrograde: retrograde,
    });
  }

  return results;
}
