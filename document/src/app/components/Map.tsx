"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapLibre, { Layer, Marker, Source } from "react-map-gl/maplibre";

import styles from "./Map.module.css";

import type { Feature, FeatureCollection, Point, Polygon } from "geojson";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";


interface MapLayer {
  id?: string;
  url: string;
  border?: string;
  color: string;
}

export default function Map() {
  const [externals, setExternals] = useState<FeatureCollection<Point>>({ "type": "FeatureCollection", "features": [] });
  const mapRef = useRef<MapRef>(null);
  const mapLayers: MapLayer[] = [
    {
      url: "map/area.geojson",
      color: "#ffffffaa"
    },
    {
      url: "map/building_sub.geojson",
      color: "#17288b44"
    },
    {
      url: "map/road.geojson",
      color: "#aaaaaa"
    },
    {
      url: "map/symbol.geojson",
      color: "#17288b"
    },
    {
      id: "building",
      url: "map/building.geojson",
      color: "#17288b"
    }
  ];

  const [cursor, setCursor] = useState<string>("auto");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features?.[0] as Feature | undefined;
    if (!feature) return;
    let latlng = { lng: 0, lat: 0 };
    if (feature.geometry.type === "Polygon") {
      latlng = { lng: feature.geometry.coordinates[0][0][0], lat: feature.geometry.coordinates[0][0][1] };
    } else if (feature.geometry.type === "MultiPolygon") {
      latlng = { lng: feature.geometry.coordinates[0][0][0][0], lat: feature.geometry.coordinates[0][0][0][1] };
    } else if (feature.geometry.type === "Point") {
      latlng = { lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1] };
    } else {
      return;
    }
    new Popup()
      .setLngLat(latlng)
      .setText(feature.properties!.name)
      .addTo(mapRef.current!.getMap());
  }, []);

  useEffect(() => {
    fetch("map/external.json").then(res => res.json()).then(setExternals);
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
        interactiveLayerIds={["building", "building-ext", "external"]}
        maxZoom={19}
        cursor={cursor}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        mapStyle="style.json"
      >
        {mapLayers.map(({ id, url, color }) => (
          <Source key={url} type="geojson" data={url}>
            <Layer
              id={id}
              type="fill"
              paint={{ "fill-color": color }} />
            { id === "building" && (
              <Layer
                id={`${id}-ext`}
                type="fill-extrusion"
                minzoom={18}
                paint={{
                  "fill-extrusion-color": "#17288b",
                  "fill-extrusion-height": { "type": "interval", "property": "floors", "stops": new Array(10).fill([]).map((_, i) => [i + 1, (i + 1) * 5]) },
                  "fill-extrusion-opacity": 1
                }}/>
            )}
          </Source>
        ))}
        {
          externals.features.map((feature: Feature<Point>) => (
            <Marker
              latitude={ feature.geometry.coordinates[1] }
              longitude={ feature.geometry.coordinates[0] }
              key={ feature.properties!.id } anchor="bottom" />
          ))
        }
      </MapLibre>
    </div>
  );
}
