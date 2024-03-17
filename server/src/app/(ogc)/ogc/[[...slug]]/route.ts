import { ogcErrors } from "../../constants/errors";

import type { NextRequest } from "next/server";

import { asNextResponse, isValidRoute, createResponse } from "@/app/(ogc)/responses";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.pathname.replace(/^(.*\/ogc\/?)/, "/");
  if (isValidRoute(url)) {
    return asNextResponse(createResponse(url));
  }
  return ogcErrors.notFound().toResponse();
}
