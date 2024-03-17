import type { CollectionFilter } from "@/utils/collections";
import type { BBox, FeatureCollection } from "geojson";

import allFeatures from "@/generated/all.json";
import { getCollectionBBox, filterCollections } from "@/utils/collections";

interface Collection {
  title: string;
  description: string;
  data: FeatureCollection;
  bbox: BBox;
  filter: (filter: CollectionFilter) => ReturnType<typeof filterCollections>;
}

export const collections = {
  all: {
    title: "All",
    description: "All features",
    data: allFeatures as FeatureCollection,
    bbox: getCollectionBBox(allFeatures as FeatureCollection),
    filter: filterCollections.bind(null, allFeatures as FeatureCollection)
  }
} as const satisfies Record<string, Collection>;
