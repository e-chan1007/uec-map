import dynamic from "next/dynamic";
import { MdArrowBack, MdMap } from "react-icons/md";

import styles from "./page.module.scss";

import type { BuildingPointFeature } from "@/types/building.js";

import { Button } from "@/app/components/button/Button";
import allBuildings from "@/assets/list.json";


interface Slug {
  buildingId: string;
}

export default async function BuildingPage({ params }: { params: Slug }) {
  const building = allBuildings.features.find(f => f.id === params.buildingId) as BuildingPointFeature;
  if (!building || !building.properties.hasIndoorMap) {
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

  const Map = dynamic(() => import("./components/map/Map"), { ssr: false });


  return <div className={styles.container}>
    <Button href={`/buildings`} variant="outlined"><MdArrowBack /> 施設一覧に戻る</Button>
    <h1>{building.properties.name}</h1>
    <Button href={`/?pin=${building.id}`}><MdMap /> マップに表示</Button>
    <Map building={building} />
  </div>;
}
