import type { Feature, FeatureCollection, Point } from "geojson";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { glob } from "fast-glob";
import * as turf from "@turf/turf";
import type { BuildingPointFeature } from "../server/src/types/building";

(async () => {
  await rm("dist", { force: true, recursive: true });
  await mkdir("dist", { recursive: true });

  const allFeatures = await glob("features/**/*.geojson");

  const collection: FeatureCollection = {
    type: "FeatureCollection",
    features: []
  };

  const listData: FeatureCollection<Point, BuildingPointFeature["properties"] & { score?: number }> = {
    type: "FeatureCollection",
    features: []
  };

  for (const featureData of allFeatures) {
    const feature = JSON.parse(await readFile(featureData, "utf8"));
    delete feature.$schema;
    delete feature.creator;
    collection.features.push(feature as Feature);

    if (feature.properties?.["uec:category"] === "building") {
      if (!feature.properties?.name) continue;
      if (feature.properties.name.match(/噴水|倉庫|物品庫|薬品庫|電話|車庫|受電室|管理棟/)) continue;


      let center = turf.centerOfMass(feature);
      try {
        if (!turf.booleanContains(feature, center)) center = turf.pointOnFeature(feature);
      } catch (e) {
        const tempFeature: Feature = structuredClone(feature);
        tempFeature.geometry.type = "Polygon";
        tempFeature.geometry.coordinates = tempFeature.geometry.coordinates[0];
        center = turf.center(tempFeature);
        if (!turf.booleanContains(tempFeature, center)) center = turf.pointOnFeature(tempFeature);
      }

      const data: Feature<Point, BuildingPointFeature["properties"] & { score: number }> = {
        ...feature, properties: {
          "name": feature.properties.name,
          "name:en": feature.properties["name:en"],
          "name:ja": feature.properties["name:ja"],
          "area": feature.properties["uec:area"],
          "indoorMap": feature.properties["uec:indoorMap"],
          "minLevel": feature.properties["min_level"],
          "maxLevel": feature.properties["max_level"],
          "score": 0
        },
        geometry: center.geometry
      };

      if (data.properties.name.match(/^[東西]/)) data.properties.score++;
      if (data.properties.name.match(/棟$/)) data.properties.score+=5;
      if (data.properties.name.match(/号館/)) data.properties.score++;
      if (data.properties.name.match(/体育館|講堂|保健|大学会館|本館/)) data.properties.score+=3;
      if (data.properties.name.match(/ドーム|課外/)) data.properties.score+=1;
      if (data.properties.name.match(/プール|テニス|弓道|職員|保育/)) data.properties.score-=10;
      console.log(data.properties.name, data.properties.score!);

      listData.features.push(data);
    }
  }

  listData.features.sort((a, b) => {
    const parsedAName = parseInt(a.properties.name.slice(1), 10);
    const parsedBName = parseInt(b.properties.name.slice(1), 10);
    if (!(isNaN(parsedAName) || isNaN(parsedBName))) return parsedAName - parsedBName;
    const nameA = a.properties.name.replace(/^新/, "");
    const nameB = b.properties.name.replace(/^新/, "");
    return nameA.localeCompare(nameB);
  });

  listData.features.sort((a, b) =>
    a.properties.area.localeCompare(b.properties.area)
  );

  listData.features.sort((a, b) => b.properties.score! - a.properties.score!);

  listData.features = listData.features.map(feature => {
    delete feature.properties.score;
    return feature;
  });

  await writeFile(`dist/all.geojson`, JSON.stringify(collection));
  await writeFile(`dist/list.geojson`, JSON.stringify(listData));

  console.info("Successfully built map!");
})();
