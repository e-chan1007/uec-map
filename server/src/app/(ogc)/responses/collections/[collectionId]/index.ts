import type { OGCJSONResponse } from "@/utils/routeTypes";

import { collections } from "@/app/(ogc)/constants/collections";
import { ogcErrors } from "@/app/(ogc)/constants/errors";
import { toAbsoluteUrl } from "@/utils/url";


export const createResponse = (collectionId: string): OGCJSONResponse<"/collections/{collectionId}"> => {
  const collection = Object.entries(collections).find(([id]) => id === collectionId);
  if (!collection) {
    return ogcErrors.notFound().toOGCResponse();
  }
  const [id, collectionData] = collection;
  return ({
    _status: 200,
    id,
    title: collectionData.title,
    description: collectionData.description,
    links: [
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}`, { f: "json" }),
        rel: "self",
        type: "application/json",
        title: "This collection (JSON)"
      },
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}`, { f: "html" }),
        rel: "alternate",
        type: "text/html",
        title: "This collection (HTML)"
      },
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}/items`, { f: "json" }),
        rel: "items",
        type: "application/geo+json",
        title: "Items for this collection (GeoJSON)"
      },
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}/items`, { f: "html" }),
        rel: "items",
        type: "text/html",
        title: "Items for this collection (HTML)"
      }
    ],
    extent: { spatial: { bbox: collectionData.bbox } }
  });
};
