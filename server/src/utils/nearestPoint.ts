// @ts-expect-error package.json is broken
import * as turf from "@turf/turf";

import type { BuildingPointFeature } from "@/types/building";

import pointList from "@/assets/list.json";

export const nearestPoint = (point: [number, number]) => turf.nearestPoint(point, pointList) as BuildingPointFeature;
