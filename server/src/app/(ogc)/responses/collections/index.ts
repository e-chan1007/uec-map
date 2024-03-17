import { collections } from "../../constants/collections";

import type { OGCJSONResponse } from "@/utils/routeTypes";

import { toAbsoluteUrl } from "@/utils/url";

export const createResponse = (): OGCJSONResponse<"/collections"> => ({
  _status: 200,
  collections: Object.entries(collections).map(([id, collection]) =>
    ({
      id,
      title: collection.title,
      description: collection.description,
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
      extent: { spatial: { bbox: collection.bbox } }
    })
  ),
  links: [
    {
      href: toAbsoluteUrl("/ogc/collections"),
      rel: "self",
      type: "application/json",
      title: "This document (JSON)"
    }, {
      href: toAbsoluteUrl("/ogc/collections?f=html"),
      rel: "alternate",
      type: "text/html",
      title: "This document (HTML)"
    }, {
      href: "/LICENSE",
      rel: "license",
      type: "text/plain",
      title: "License"
    }
  ]
});
