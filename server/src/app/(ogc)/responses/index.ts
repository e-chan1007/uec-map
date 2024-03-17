import { createResponse as createAPIResponse } from "./api";
import { createResponse as createCollectionListResponse } from "./collections";
import { createResponse as createCollectionInfoResponse } from "./collections/[collectionId]";
import { createResponse as createItemListResponse } from "./collections/[collectionId]/items";
import { createResponse as createItemInfoResponse } from "./collections/[collectionId]/items/[featureId]";
import { createResponse as createConformanceResponse } from "./conformance";
import { createResponse as createLandingResponse } from "./landing";

import type { OGCJSONResponse, OGCPaths, OGCResponseStatuses } from "@/utils/routeTypes";

type OGCResponseGenerators = { [Path in OGCPaths]: (...args: any[]) => (OGCJSONResponse<Path>) };

type ResponseGenerators = OGCResponseGenerators & {
  "/api": typeof createAPIResponse;
};

const responseGenerators = {
  "/": createLandingResponse,
  "/api": createAPIResponse,
  "/conformance": createConformanceResponse,
  "/collections": createCollectionListResponse,
  "/collections/{collectionId}": createCollectionInfoResponse,
  "/collections/{collectionId}/items": createItemListResponse,
  "/collections/{collectionId}/items/{featureId}": createItemInfoResponse
} as const satisfies ResponseGenerators;

export type Routes = keyof ResponseGenerators;
export const routes: Routes[] = Object.keys(responseGenerators) as Routes[];
export const isValidRoute = (route: string): route is Routes => routes.includes(route as Routes);

export const createResponse = <Path extends keyof ResponseGenerators>(
  path: Path,
  ...args: Parameters<(typeof responseGenerators)[Path]>
  // @ts-expect-error FIXME: cannot infer argument type
): ReturnType<(typeof responseGenerators)[Path]> => responseGenerators[path](...args);

export const asNextResponse = <Path extends keyof ResponseGenerators>(
  result: ReturnType<typeof createResponse<Path>>
): Response => {
  const status = result._status || 200;
  delete result._status;
  return Response.json(result, { status });
};

export const isOGCResponseSuccess = <Path extends keyof OGCResponseGenerators>(
  response: OGCJSONResponse<Path, OGCResponseStatuses<Path>>
): response is OGCJSONResponse<Path, 200> => response._status === 200;

export const isOGCResponseError = <Path extends keyof OGCResponseGenerators>(
  response: OGCJSONResponse<Path, OGCResponseStatuses<Path>>
): response is OGCJSONResponse<Path, Exclude<OGCResponseStatuses<Path>, 200>> => response._status !== 200;
