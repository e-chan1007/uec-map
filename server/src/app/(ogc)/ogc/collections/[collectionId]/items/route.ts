import type { NextRequest } from "next/server";

import { asNextResponse, createResponse } from "@/app/(ogc)/responses";

interface Props {
  params: Promise<{
    collectionId: string;
  }>
}

export async function GET(request: NextRequest, { params }: Props) {
  const { collectionId } = await params;
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10") || null;
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0") || null;
  const bbox = request.nextUrl.searchParams.get("bbox");
  return asNextResponse(createResponse("/collections/{collectionId}/items", collectionId, { bbox, limit, offset }));
}
