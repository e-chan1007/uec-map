import L from "leaflet";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";

import styles from "./icon.module.scss";


export default function createMarkerIcon(component: React.ReactNode) {
  const el = document.createElement("div");
  createRoot(el).render(component);
  return L.divIcon({ html: el, className: styles.marker, iconSize: undefined });
}
