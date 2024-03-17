import styles from "./BuildingList.module.scss";
import { BuildingListItem } from "./BuildingListItem";

import type { BuildingPointFeature } from "@/types/building";


import list from "@/assets/list.json";

export function BuildingList() {
  return <div className={styles.list}>
    {(list.features as BuildingPointFeature[]).map(building => <BuildingListItem key={building.id} building={building} />)}
  </div>;
}
