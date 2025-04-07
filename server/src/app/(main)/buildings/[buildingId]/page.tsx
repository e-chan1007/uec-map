
import { MdArrowBack, MdMap } from "react-icons/md";

import styles from "./page.module.scss";

import type { BuildingPointFeature } from "@/types/building.js";

import { Button } from "@/app/components/button/Button";
import allBuildings from "@/assets/list.json";

import { Map } from "./components/map";

interface Slug {
  buildingId: string;
}

export default async function BuildingPage({ params: _params }: { params: Promise<Slug> }) {
  const params = (await _params);
  const building = allBuildings.features.find(f => f.id === params.buildingId) as BuildingPointFeature;
  if (!building || !building.properties.indoorMap) {
    return <div>Building not found</div>;
  }

  const images: {
    label: string;
    src: string;
  }[] = [];
  for (let i = building.properties.minLevel; i <= building.properties.maxLevel; i++) {
    images.push({
      label: (i < 0 ? `地下${i}階` : `${i + 1}階`),
      src: `/indoor/${building.id}/${i}.svg`
    });
  }


  return <div className={styles.container}>
    <Button href={`/buildings`} variant="outlined"><MdArrowBack /> 施設一覧に戻る</Button>
    <h1>{building.properties.name}</h1>
    <div>{building.properties.maxLevel+1}階建て{building.properties.minLevel < 0 && `(地下${-building.properties.minLevel}階)`}</div>
    <Button href={`/?pin=${building.id}`}><MdMap /> マップに表示</Button>
    {building.properties.indoorMap === "partial" && (
      <div className={styles.alert}>
        この施設の屋内マップは一部の階のみ表示できます。
      </div>
    )}
    <Map building={building} />
  </div>;
}
