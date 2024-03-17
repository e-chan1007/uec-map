"use client";

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";
import { useQueryState } from "nuqs";
import MapLibre, { Layer, GeolocateControl, Source, Marker, Popup } from "react-map-gl/maplibre";


import styles from "./Map.module.css";


import type { Feature } from "geojson";
import type { MapLayerTouchEvent, MapRef } from "react-map-gl/maplibre";

import allBuildings from "@/assets/list.json";
import { nearestPoint } from "@/utils/nearestPoint";


export default function Map() {
  const mapRef = useRef<MapRef>(null);

  const [pinId, setPinId] = useQueryState("pin");

  const [cursor, setCursor] = useState<string>("auto");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  const [pinPos, setPinPos] = useState<{ lat: number, lng: number } | null>(null);

  const timer = useRef<number | null>(null);

  const onTouchStart = useCallback((e: MapLayerTouchEvent) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    timer.current = window.setTimeout(() => {
      setPinPos(e.lngLat);
    }, 1000);
  }, []);
  const onTouchEnd = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    if (pinId) {
      const feature = allBuildings.features.find(f => f.id === pinId);
      if (feature) {
        const [lng, lat] = feature.geometry.coordinates;
        setPinPos({ lng, lat });
      }
    }
  }, [pinId]);

  const MapPin = memo(function MapPin({ pos } : {pos: { lat: number, lng: number } | null}) {
    if (!pos) return null;
    const nearest = nearestPoint([pos.lng, pos.lat]);
    mapRef.current?.flyTo({ center: [pos.lng, pos.lat], zoom: 17 });
    return (<>
      <Marker latitude={pos.lat} longitude={pos.lng} />
      <Popup latitude={pos.lat} longitude={pos.lng} offset={32} onClose={() => {
        setPinPos(null);
        if (pinId) setPinId(null);
      }}>
        <h1>{nearest.properties.name}{!pinId && "付近"}</h1>
        {/* <Button>共有する</Button> */}
      </Popup>
    </>);
  });

  return (
    <>
      <div className={styles.map}>
        <MapLibre
          antialias
          reuseMaps
          attributionControl={false}
          ref={mapRef}
          initialViewState={{
            longitude: 139.542834,
            latitude: 35.657511,
            zoom: 16
          }}
          interactiveLayerIds={["building", "building_sub", "external", "gate"]}
          maxZoom={20}
          cursor={cursor}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          mapStyle="style.json"
        >
          <GeolocateControl positionOptions={{ enableHighAccuracy: true }} trackUserLocation/>
          <Source type="geojson" data="/ogc/collections/all/items?limit=1000">
            <Layer
              id="area"
              type="fill"
              minzoom={12}
              filter={["==", ["get", "amenity"], "university"]}
              paint={{
                "fill-color": [
                  "step",
                  ["zoom"],
                  "transparent",
                  12,
                  "#17288b22",
                  14,
                  "#ffffff"
                ],
                "fill-outline-color": [
                  "step",
                  ["zoom"],
                  "transparent",
                  12,
                  "#17288b"
                ]
              }}
            />
            <Layer
              id="path"
              type="fill"
              minzoom={14}
              filter={["==", ["get", "uec:category"], "path"]}
              paint={{ "fill-color": "#aaaaaa" }}/>
            <Layer
              id="road"
              type="fill"
              minzoom={18}
              filter={["==", ["get", "uec:category"], "road"]}
              paint={{ "fill-color": "#777777" }}/>
            <Layer
              id="building_sub"
              type="fill"
              minzoom={15}
              filter={["all", ["==", ["get", "uec:category"], "building"], ["!", ["in", ["get", "building"], ["literal", ["university", "sports_hall"]]]]]}
              paint={{ "fill-color": "#9ca7e3" }}/>
            <Layer
              id="building"
              type="fill"
              minzoom={14}
              filter={["in", "building", "university", "sports_hall"]}
              paint={{ "fill-color": "#17288b" }}/>
            <Layer
              id="external"
              type="circle"
              filter={["==", ["get", "type"], "external"]}
              paint={{ "circle-color": "#9ca7e3", "circle-radius": 15 }}/>
            <Layer
              id="area-label"
              type="symbol"
              filter={["all", ["has", "name"], ["==", "uec:category", "area"]]}
              minzoom={13}
              maxzoom={16}
              layout={{
                "text-font": ["NotoSansCJKjp-Regular"],
                "text-field": ["get", "name"]
              }}
              paint={{
                "text-halo-color": "#ffffff",
                "text-halo-width": 2
              }}/>
            <Layer
              id="building-label"
              type="symbol"
              filter={["all",
                ["has", "name"],
                ["any",
                  ["in", ["get", "uec:category"], ["literal", ["gate"]]],
                  ["in", ["get", "building"], ["literal", ["commercial", "dormitory", "university", "sports_hall"]]]]]}
              minzoom={16}
              layout={{
                "text-font": ["NotoSansCJKjp-Regular"],
                "text-field": ["get", "name"]
              }}
              paint={{
                "text-halo-color": "#ffffff",
                "text-halo-width": 2
              }}/>
            <Layer
              id="building-label-all"
              type="symbol"
              filter={["all",
                ["has", "name"],
                ["!=", "uec:category", "area"],
                ["!in", "uec:category", "gate"],
                ["!in", "building", "commercial", "dormitory", "university", "sports_hall"]]}
              minzoom={19}
              layout={{
                "text-font": ["NotoSansCJKjp-Regular"],
                "text-field": ["get", "name"]
              }}
              paint={{
                "text-halo-color": "#ffffff",
                "text-halo-width": 2
              }}/>
          </Source>
          {<MapPin pos={pinPos} />}
        </MapLibre>
      </div>
    </>
  );
}
