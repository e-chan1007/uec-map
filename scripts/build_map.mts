import { geojson } from "flatgeobuf";
import type { Feature, FeatureCollection } from "geojson";
import allData from "../all.json";
import { mkdir, rm, writeFile } from "fs/promises";

(async () => {
  const collectionTypes = [
    "external"
  ];

  const areas = ["east", "west", "100th"];

  await rm("dist", { force: true, recursive: true });
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

    const serialized = geojson.serialize(areaCollection);
    const rawBody = JSON.stringify(areaCollection);

    await writeFile(`dist/${area}.geojson`, rawBody);
    await writeFile(`dist/${area}.json`, rawBody);
    await writeFile(`dist/${area}.fgb`, serialized);
  }

  const serializedAll = geojson.serialize(allData as FeatureCollection);
  const rawBodyAll = JSON.stringify(allData);

  await writeFile(`dist/all.geojson`, rawBodyAll);
  await writeFile(`dist/all.json`, rawBodyAll);
  await writeFile(`dist/all.fgb`, serializedAll);
})();
