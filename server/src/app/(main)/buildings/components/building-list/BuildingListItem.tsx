"use client";

import { MdDoorFront, MdMap } from "react-icons/md";

import styles from "./BuildingListItem.module.scss";

import type { BuildingPointFeature } from "../../../../../types/building";

import { Button } from "@/app/components/button/Button";


interface Props {
  building: BuildingPointFeature;
}

const areaNames = {
  "east": "東地区",
  "west": "西地区",
  "100th": "100周年キャンパス"
} as const satisfies Record<"east" | "west" | "100th", string>;

export function BuildingListItem({ building }: Props) {
  return <div className={styles.item}>
    <h2 className={styles.name}>{building.properties.name}</h2>
    <p className={styles.area}>{areaNames[building.properties.area]}</p>
    <div className={styles.control}>
      <Button href={`/?pin=${building.id}`}><MdMap /> マップに表示</Button>
      {building.properties.indoorMap && <Button href={`/buildings/${building.id}`}><MdDoorFront /> 屋内マップを表示</Button>}
    </div>
  </div>;
}
