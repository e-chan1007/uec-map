import type { OGCJSONResponse } from "@/utils/routeTypes";
import type { Feature } from "geojson";


import { collections } from "@/app/(ogc)/constants/collections";
import { ogcErrors } from "@/app/(ogc)/constants/errors";
import { toAbsoluteUrl } from "@/utils/url";


export const createResponse = (collectionId: string, featureId: string): OGCJSONResponse<"/collections/{collectionId}/items/{featureId}"> => {
  const collection = Object.entries(collections).find(([id]) => id === collectionId);
  if (!collection) {
    return ogcErrors.notFound().toOGCResponse();
  }
  const [id, collectionData] = collection;

  const feature = collectionData.data.features.find(feature => feature.id === featureId) as Feature | null;
  if (!feature) {
    return ogcErrors.notFound().toOGCResponse();
  }
  return {
    _status: 200,
    ...feature,
    links: [
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}/items/${featureId}`, { f: "json" }),
        rel: "self",
        type: "application/geo+json",
        title: "This item (GeoJSON)"
      },
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}/items/${featureId}`, { f: "html" }),
        rel: "alternate",
        type: "text/html",
        title: "This item (HTML)"
      },
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}`, { f: "json" }),
        rel: "collection",
        type: "application/json",
        title: "This collection (JSON)"
      },
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}`, { f: "html" }),
        rel: "collection",
        type: "text/html",
        title: "This collection (HTML)"
      }
    ]
  };
};
