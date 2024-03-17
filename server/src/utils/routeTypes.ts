import type { paths as ogcPaths } from "@/generated/ogc-spec";

export type OGCPaths = keyof ogcPaths;

type OGC<Path extends OGCPaths> = ogcPaths[Path]["get"];

export type OGCResponseStatuses<Path extends OGCPaths> = keyof OGC<Path>["responses"];

type OGCResponse<Path extends OGCPaths, Status extends OGCResponseStatuses<Path>> =
   OGC<Path>["responses"][Status];

type OGCJSONResponseOf<Path extends OGCPaths, Status extends OGCResponseStatuses<Path>> =
  OGCResponse<Path, Status> extends { content: { "application/json": unknown }}
  ? OGCResponse<Path, Status>["content"]["application/json"]
  : OGCResponse<Path, Status> extends { content: { "application/geo+json": unknown }}
  ? OGCResponse<Path, Status>["content"]["application/geo+json"]
  : never;

type OGCJSONResponseAll<Path extends OGCPaths> = {
  [Status in OGCResponseStatuses<Path>]: (OGCJSONResponseOf<Path, Status> & { _status?: Status });
}[OGCResponseStatuses<Path>];

export type OGCJSONResponse<Path extends OGCPaths, Status extends OGCResponseStatuses<Path> | void = void> =
  Status extends OGCResponseStatuses<Path> ? OGCJSONResponseOf<Path, Status> & { _status?: Status } : OGCJSONResponseAll<Path>;

export type OGCQuery<Path extends OGCPaths> = ogcPaths[Path]["get"]["parameters"]["query"];
