"use client";

import React, { useCallback, useRef, useState } from "react";


import { Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createRoot } from "react-dom/client";
import MapLibre, { Layer, GeolocateControl, Source } from "react-map-gl/maplibre";

import styles from "./Map.module.css";

import type { Feature } from "geojson";
import type { DataDrivenPropertyValueSpecification } from "maplibre-gl";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";


interface MapLayer {
  type: string;
  border?: string | DataDrivenPropertyValueSpecification<string>;
  minzoom?: number;
  maxzoom?: number;
  color: string | DataDrivenPropertyValueSpecification<string>;
}

export default function Map() {
  const mapRef = useRef<MapRef>(null);
  const mapLayers: MapLayer[] = [
    {
      type: "area",
      minzoom: 12,
      color: [
        "step",
        ["zoom"],
        "transparent",
        12,
        "#17288b22",
        14,
        "#ffffff"
      ],
      border: [
        "step",
        ["zoom"],
        "transparent",
        12,
        "#17288b"
      ]
    },
    {
      type: "path",
      color: "#aaaaaa",
      minzoom: 14
    },
    {
      type: "road",
      color: "#777777",
      minzoom: 17
    },
    {
      type: "building_sub",
      color: "#00afdd",
      minzoom: 15
    },
    {
      type: "symbol",
      color: "#00afdd",
      minzoom: 15
    },
    {
      type: "building",
      color: "#17288b",
      minzoom: 14
    }
  ];

  const [cursor, setCursor] = useState<string>("auto");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features?.[0] as Feature | undefined;
    if (!feature?.properties?.center) return;
    const lnglat: [number, number] = JSON.parse(feature.properties?.center);
    const popup = new Popup();
    popup.setLngLat(lnglat);
    popup.setText("");
    popup.addTo(mapRef.current!.getMap());
    const root = document.createElement("div");
    const el = popup._content;
    el.appendChild(root);
    createRoot(root).render(<>
      <h1>{feature.properties.name}</h1>
      <pre className={styles["map-popup-pre"]}>{JSON.stringify(feature.properties, null, 2)}</pre>
    </>);
  }, []);

  return (
    <div className={styles.map}>
      <MapLibre
        ref={mapRef}
        initialViewState={{
          longitude: 139.542834,
          latitude: 35.657511,
          zoom: 16
        }}
        interactiveLayerIds={["building", "building_sub", "symbol", "external", "gate"]}
        maxZoom={20}
        cursor={cursor}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        mapStyle="style.json"
      >
        <GeolocateControl positionOptions={{ enableHighAccuracy: true }} trackUserLocation/>
        <Source type="geojson" data="map/all.geojson">
          {mapLayers.map(({ type, border, minzoom, maxzoom, color }) => (
            <Layer
              id={type}
              key={type}
              type="fill"
              minzoom={minzoom ?? 0}
              maxzoom={maxzoom ?? 21}
              filter={["==", ["get", "type"], type]}
              paint={{ "fill-color": color ?? "transparent", "fill-outline-color": border ?? "transparent" }} />
          ))}
          <Layer
            id="gate"
            type="circle"
            filter={["==", ["get", "type"], "gate"]}
            minzoom={17}
            paint={{ "circle-color": "#00afdd", "circle-radius": 15 }}/>
          <Layer
            id="external"
            type="circle"
            filter={["==", ["get", "type"], "external"]}
            paint={{ "circle-color": "#00afdd", "circle-radius": 15 }}/>
          <Layer
            id="extrusion"
            type="fill-extrusion"
            minzoom={18}
            filter={["in", "type", "building", "building_sub"]}
            paint={{
              "fill-extrusion-color": {
                "type": "categorical",
                "property": "type",
                "default": "#17288b",
                "stops": [
                  ["building_sub", "#00afdd"]
                ]
              },
              "fill-extrusion-height": { "type": "categorical", "property": "floors", "stops": new Array(11).fill([]).map((_, i) => [i, i * 7]) }
            }}/>
        </Source>
      </MapLibre>
    </div>
  );
}
