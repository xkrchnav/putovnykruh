import { places, type PlaceId } from '../data/places';

export interface ResolvedPlace {
  name: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
  isKnown: boolean;
}

/**
 * Spojí termín s registrem míst. Text z frontmatteru má přednost (historické
 * termíny mají vlastní názvy), registry dodává mapu a souřadnice.
 */
export function resolvePlace(data: {
  place?: string;
  placeId?: PlaceId;
}): ResolvedPlace {
  const known = data.placeId ? places[data.placeId] : undefined;

  return {
    name: data.place ?? known?.name ?? 'místo bude upřesněno',
    mapUrl: known?.mapUrl,
    lat: known?.lat,
    lng: known?.lng,
    isKnown: Boolean(known),
  };
}
