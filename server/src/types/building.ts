import type { Feature, Point } from "geojson";

export type BuildingPointFeature = Feature<Point, {
  area: "east" | "west" | "100th";
  name: string;
  "name:en": string;
  "name:ja": string;
  hasIndoorMap?: boolean;
  minLevel: number;
  maxLevel: number;
}>
