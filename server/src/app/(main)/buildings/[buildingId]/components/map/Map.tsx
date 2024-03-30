"use client";

import { useEffect, useState } from "react";

import clsx from "clsx";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { ImageOverlay, MapContainer, Marker, Pane, SVGOverlay } from "react-leaflet";

import styles from "./Map.module.scss";
import createMarkerIcon from "./markerIcon";

import type { BuildingPointFeature } from "@/types/building.js";

interface Props {
  building: BuildingPointFeature,
}

interface IconManifest {
  levels: number[];
  x: number;
  y: number;
  label?: string;
  link?: string;
  icon: string;
}

interface IndoorMapManifest {
  width: number;
  height: number;
  floors?: number[];
  icons: IconManifest[];
}

interface IconMarker {
  id: string;
  icon: L.DivIcon;
  position: [number, number];
}

export default function Map({ building }: Props) {
  const router = useRouter();
  const [manifest, setManifest] = useState<IndoorMapManifest|null>(null);
  const [icons, setIcons] = useState<IconMarker[]>([]);
  const [iconManifests, setIconManifests] = useState<IconManifest[]>([]);
  const [level, setLevel] = useQueryState("level", parseAsInteger.withDefault(0));

  useEffect(() => {
    fetch(`/indoor/${building.id}/manifest.json`).then(r => r.json()).then(v => {
      setManifest(v);
      if (v.floors && !v.floors.includes(level)) setLevel(v.floors[0]);
    });
  }, []);

  useEffect(() => {
    if (!manifest) return;
    const iconManifests = manifest.icons.filter(icon => icon.levels.includes(level));
    setIconManifests(iconManifests);
    setIcons(iconManifests.map(icon => ({
      id: `${icon.label}_${icon.x}_${icon.y}`,
      icon: createMarkerIcon(<div className={styles.marker}>
        {icon.label && <div className={styles["marker-label"]}>{icon.label}</div> }
        <img src={`/indoor/icons/${icon.icon}.svg`} alt={icon.label} className={styles["marker-icon"]} />
      </div>),
      position: [manifest.height - icon.y, icon.x]
    })));
  }, [manifest, level]);

  if (!manifest) return <div>Loading...</div>;

  const levelButtons = [];
  for (let i = building.properties.maxLevel; i >= building.properties.minLevel; i--) {
    if (manifest.floors && !manifest.floors.includes(i)) continue;
    levelButtons.push(
      <a
        className={clsx(styles["level-button"], level === i && styles.active)}
        onClick={() => setLevel(i)}
      >
        {i < 0 ? `B${-i}F` : `${i + 1}F`}
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
      icons.map((icon, i) => <Marker
        icon={icon.icon}
        position={icon.position}
        interactive={true}
        keyboard={false}
        key={icon.id}
        eventHandlers={{
          click: () => {
            const icon = iconManifests[i];
            if (icon.link) router.replace(`/buildings/${icon.link}?level=${level}`);
          }
        }}
      />)

    }
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-bar leaflet-control">
        {levelButtons}
      </div>
    </div>
  </MapContainer>;
}
