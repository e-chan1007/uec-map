import { geojson } from "flatgeobuf";
import type { Feature, FeatureCollection } from "geojson";
import allData from "../all.json";
import { mkdir, writeFile } from "fs/promises";

(async () => {
  const collectionTypes = [
    "area",
    "building",
    "building_sub",
    "symbol",
    "external",
    "road"
  ];

  const areas = ["east", "west", "100th"];

  await mkdir("dist", { recursive: true });

  for (const type of collectionTypes) {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: allData.features.filter(
        feature => feature.properties.type === type
      ) as Feature[]
    };

    const serialized = geojson.serialize(collection);
    const rawBody = JSON.stringify(collection);

    await writeFile(`dist/${type}.geojson`, rawBody);
    await writeFile(`dist/${type}.json`, rawBody);
    await writeFile(`dist/${type}.fgb`, serialized);
  }

  for (const area of areas) {
    const areaCollection: FeatureCollection = {
      type: "FeatureCollection",
      features: allData.features.filter(
        feature => feature.properties.area === area
      ) as Feature[]
    };

    await mkdir(`dist/${area}`, { recursive: true });

    const serialized = geojson.serialize(areaCollection);
    const rawBody = JSON.stringify(areaCollection);

    await writeFile(`dist/${area}/all.geojson`, rawBody);
    await writeFile(`dist/${area}/all.json`, rawBody);
    await writeFile(`dist/${area}/all.fgb`, serialized);
  }

  const serializedAll = geojson.serialize(allData as FeatureCollection);
  const rawBodyAll = JSON.stringify(allData);

  await writeFile(`dist/all.geojson`, rawBodyAll);
  await writeFile(`dist/all.json`, rawBodyAll);
  await writeFile(`dist/all.fgb`, serializedAll);
})();
