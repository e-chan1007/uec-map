import type { OGCJSONResponse } from "@/utils/routeTypes";

export const createResponse = (): OGCJSONResponse<"/conformance"> => ({
  _status: 200,
  conformsTo: [
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/html",
    "http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson"
  ]
});
