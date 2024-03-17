import type { OGCJSONResponse } from "@/utils/routeTypes";

import { toAbsoluteUrl } from "@/utils/url";

export const createResponse = (): OGCJSONResponse<"/"> => ({
  _status: 200,
  title: "UEC Map",
  description: "Access to data about buildings and rooms in the University of Electro-Communications.",
  links: [
    {
      rel: "self",
      href: toAbsoluteUrl("/ogc?f=json"),
      type: "application/json",
      title: "This document (JSON)"
    },
    {
      rel: "alternate",
      href: toAbsoluteUrl("/ogc?f=html"),
      type: "text/html",
      title: "This document (HTML)"
    },
    {
      rel: "conformance",
      href: toAbsoluteUrl("/ogc/conformance?f=json"),
      type: "application/json",
      title: "OGC API conformance classes implemented by this server (JSON)"
    },
    {
      rel: "conformance",
      href: toAbsoluteUrl("/ogc/conformance?f=html"),
      type: "text/html",
      title: "OGC API conformance classes implemented by this server (HTML)"
    },
    {
      rel: "service-desc",
      href: toAbsoluteUrl("/ogc/api?f=json"),
      type: "application/vnd.oai.openapi+json;version=3.0",
      title: "The API definition (JSON)"
    },
    {
      rel: "service-doc",
      href: toAbsoluteUrl("/ogc/api?f=html"),
      type: "text/html",
      title: "The API documentation (HTML)"
    },
    {
      rel: "data",
      href: toAbsoluteUrl("/ogc/collections?f=json"),
      type: "application/json",
      title: "Information about the feature collections (JSON)"
    },
    {
      rel: "data",
      href: toAbsoluteUrl("/ogc/collections?f=html"),
      type: "text/html",
      title: "Information about the feature collections (HTML)"
    }
  ]
});
