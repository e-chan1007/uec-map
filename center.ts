import FastGlob from "fast-glob";
import { readFile, writeFile } from "fs/promises";

(async () => {
  const files = await FastGlob.glob("./features/**/*.geojson");
  for (const file of files) {
    const feature = JSON.parse(await readFile(file, "utf8"));
    feature;
    await writeFile(file, JSON.stringify(feature, null, 2));
  // await writeFile("./all-with-center.json", JSON.stringify(newData, null, 2));
  }
})();
