/**
 * Místa, kde se kruhy konají. Jediný zdroj pravdy pro mapu, GPS a strukturovaná data.
 *
 * Přidání nového místa:
 *   1. najdi ho na mapy.com a zkopíruj krátký odkaz (Sdílet → kopírovat odkaz)
 *   2. z odkazu opiš souřadnice: `x` = zeměpisná délka (lng), `y` = šířka (lat)
 *   3. přidej záznam sem
 *   4. v novém termínu (src/content/circles/*.mdx) napiš `placeId: <klíč>`
 *
 * Když `placeId` chybí, web použije text z frontmatteru `place` a mapu nezobrazí.
 */
export interface Place {
  /** Název tak, jak se má zobrazit, když termín nemá vlastní `place`. */
  name: string;
  /** Odkaz na mapy.com (krátký odkaz nebo odkaz na hledání). */
  mapUrl: string;
  /** Zeměpisná šířka. */
  lat: number;
  /** Zeměpisná délka. */
  lng: number;
}

export const places = {
  'adamov-zenker': {
    name: 'Adamov Zenker',
    mapUrl: 'https://mapy.com/s/banujolafu',
    lat: 49.284949,
    lng: 16.66873,
  },
  'babi-doly': {
    name: 'Babí doly',
    mapUrl: 'https://mapy.com/s/cafazameto',
    lat: 49.289487,
    lng: 16.602683,
  },
  'bilovice-nad-svitavou': {
    name: 'Bílovice nad Svitavou',
    // Krátký odkaz zadaný uživatelem je mrtvý (otevírá mapu ČR); zatím hledání.
    mapUrl: 'https://mapy.com/cs/turisticka?q=B%C3%ADlovice%20nad%20Svitavou',
    lat: 49.24715,
    lng: 16.672364,
  },
  'zernovnik-u-vladimira': {
    name: 'Žernovník u Vladimíra',
    mapUrl: 'https://mapy.com/s/nafekojoco',
    lat: 49.412605,
    lng: 16.554813,
  },
  lysice: {
    name: 'Lysice',
    mapUrl: 'https://mapy.com/s/lasekobefu',
    lat: 49.456505,
    lng: 16.539618,
  },
} satisfies Record<string, Place>;

export type PlaceId = keyof typeof places;

/** Pro Zod enum — neprázdná n-tice klíčů. */
export const placeIds = Object.keys(places) as [PlaceId, ...PlaceId[]];
