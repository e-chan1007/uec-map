"use client";

import { useEffect, useState } from "react";

import clsx from "clsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ImageOverlay, MapContainer, Marker, Pane, SVGOverlay } from "react-leaflet";

import styles from "./Map.module.scss";
import createMarkerIcon from "./markerIcon";

import type { BuildingPointFeature } from "@/types/building.js";

interface Props {
  building: BuildingPointFeature,
}

interface IndoorMapManifest {
  width: number;
  height: number;
  icons: {
    levels: number[];
    x: number;
    y: number;
    label?: string;
    icon: string;
  }[];
}

interface IconMarker {
  id: string;
  icon: L.DivIcon;
  position: [number, number];
}

export default function Map({ building }: Props) {
  const [manifest, setManifest] = useState<IndoorMapManifest|null>(null);
  const [icons, setIcons] = useState<IconMarker[]>([]);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    fetch(`/indoor/${building.id}/manifest.json`).then(r => r.json()).then(v => setManifest(v));
  }, []);

  useEffect(() => {
    if (!manifest) return;
    setIcons(manifest.icons.filter(icon => icon.levels.includes(level)).map(icon => ({
      id: `${icon.label}_${icon.x}_${icon.y}`,
      icon: createMarkerIcon(<div className={styles.marker}>
        {icon.label && <div className={styles["marker-label"]}>{icon.label}</div> }
        <img src={`/indoor/icons/${icon.icon}.svg`} alt={icon.label} className={styles["marker-icon"]} />
      </div>),
      position: [manifest.height - icon.y, icon.x]
    })));
  }, [manifest, level]);

  console.log(manifest);

  if (!manifest) return <div>Loading...</div>;

  const levelButtons = [];
  for (let i = building.properties.maxLevel; i >= building.properties.minLevel; i--) {
    levelButtons.push(
      <a
        className={clsx(styles["level-button"], level === i && styles.active)}
        onClick={() => setLevel(i)}
      >
        {i < 0 ? `B${i}F` : `${i + 1}F`}
      </a>
    );
  }

  return <MapContainer
    attributionControl={false}
    crs={L.CRS.Simple}
    center={[manifest.height / 2, manifest.width / 2]}
    bounds={[[0, 0], [manifest.height, manifest.width]]}
    zoom={0}
    maxZoom={2}
    minZoom={-1}
    className={styles.map}
    maxBounds={[[-25, -25], [manifest.height+25, manifest.width+25]]}

  >
    <ImageOverlay
      url={`/indoor/${building.id}/${level}.svg`}
      bounds={[[0, 0], [manifest.height, manifest.width]]}
    />
    {
      icons.map(icon => <Marker
        icon={icon.icon}
        position={icon.position}
        interactive={false}
        keyboard={false}
        key={icon.id}
      />)

    }
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-bar leaflet-control">
        {levelButtons}
      </div>
    </div>
  </MapContainer>;
}
