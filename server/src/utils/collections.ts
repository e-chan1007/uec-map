// @ts-expect-error package.json is broken
import { bbox as calcBBox, bboxPolygon, booleanWithin, flatten, intersect } from "@turf/turf";

// @ts-expect-error package.json is broken
import type { Polygon } from "@turf/turf";
import type { BBox, Feature, FeatureCollection } from "geojson";

import { ogcErrors } from "@/app/(ogc)/constants/errors";

export const getCollectionBBox = (collection: FeatureCollection) => calcBBox(collection);

export interface CollectionFilter {
  bbox?: string | null;
  datetime?: string | null;
  limit?: number | null;
  offset?: number | null;
}

const isBBox = (bbox: number[]): bbox is BBox => (bbox.length === 4 || bbox.length === 6) && bbox.every(n => !Number.isNaN(n));

/**
 * @throws {Error} Invalid bbox filter
 */
export const filterCollections = (collection: FeatureCollection, filter: CollectionFilter) => {
  const { bbox, limit, offset } = filter;
  const bboxFilter = bbox ? bbox.split(",").map(n => parseFloat(n)) : null;
  if (bboxFilter && !isBBox(bboxFilter)) {
    throw ogcErrors.badValue("bbox");
  }
  const limitFilter = limit || 10;
  const offsetFilter = offset || 0;
  const filtered = collection.features.filter(feature => {
    if (bboxFilter) {
      if (feature.geometry.type === "Point") {
        return booleanWithin(feature.geometry, bboxPolygon(bboxFilter));
      } else if (feature.geometry.type === "Polygon") {
        return intersect(feature.geometry as Polygon, bboxPolygon(bboxFilter));
      } else if (feature.geometry.type === "MultiPolygon") {
        return flatten(feature.geometry).features.some((v: Feature) => booleanWithin(v, bboxPolygon(bboxFilter)));
      }
      return false;
    }
    return true;
  });
  const sliced = filtered.slice(offsetFilter, offsetFilter + limitFilter);
  return {
    features: sliced,
    next: filtered.length <= (offsetFilter + limitFilter) ? null : {
      offset: offsetFilter + limitFilter,
      limit: filtered.length - (offsetFilter + limitFilter) > limitFilter
        ? limitFilter
        : filtered.length - (offsetFilter + limitFilter)
    },
    prev: offsetFilter === 0 ? null : {
      offset: offsetFilter - limitFilter > 0 ? offsetFilter - limitFilter : 0,
      limit: limitFilter
    },
    numberMatched: filtered.length,
    numberReturned: sliced.length
  };
};
