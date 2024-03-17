import type { OGCJSONResponse } from "@/utils/routeTypes";
import type { Feature } from "geojson";

import { collections } from "@/app/(ogc)/constants/collections";
import { OGCError, ogcErrors } from "@/app/(ogc)/constants/errors";
import { toAbsoluteUrl } from "@/utils/url";

interface QueryParams {
  bbox: string | null;
  limit: number | null;
  offset: number | null;
}

export const createResponse = (collectionId: string, query: QueryParams): OGCJSONResponse<"/collections/{collectionId}/items"> => {
  const collection = Object.entries(collections).find(([id]) => id === collectionId);
  if (!collection) {
    return ogcErrors.notFound().toOGCResponse();
  }
  const [id, collectionData] = collection;
  let result: ReturnType<typeof collectionData.filter>;
  try {
    result = collectionData.filter(query);
  } catch (err) {
    if (err instanceof OGCError) {
      return err.toOGCResponse();
    } else {
      return ogcErrors.internalServerError().toOGCResponse();
    }
  }
  const { features, next, numberMatched, numberReturned } = result;
  const collectionItems = {
    _status: 200,
    type: "FeatureCollection",
    features: features,
    links: [
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}/items`, { f: "json", ...query }),
        rel: "self",
        type: "application/geo+json",
        title: "Items for this collection (GeoJSON)"
      },
      {
        href: toAbsoluteUrl(`/ogc/collections/${id}/items`, { f: "html", ...query }),
        rel: "alternate",
        type: "text/html",
        title: "Items for this collection (HTML)"
      }
    ],
    timeStamp: new Date().toISOString(),
    numberMatched,
    numberReturned
  } satisfies OGCJSONResponse<"/collections/{collectionId}/items", 200>;
  if (next) {
    collectionItems.links.push({
      href: toAbsoluteUrl(`/ogc/collections/${collectionId}/items`, { f: "json", ...query, ...next }),
      rel: "next",
      type: "application/geo+json",
      title: "Next Page (GeoJSON)"
    }, {
      href: toAbsoluteUrl(`/ogc/collections/${collectionId}/items`, { f: "html", ...query, ...next }),
      rel: "next",
      type: "text/html",
      title: "Next Page (HTML)"
    });
  }
  return collectionItems;
};
