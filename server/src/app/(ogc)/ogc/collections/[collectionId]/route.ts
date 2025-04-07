import type { NextRequest } from "next/server";

import { asNextResponse, createResponse } from "@/app/(ogc)/responses";

interface Props {
  params: Promise<{
    collectionId: string;
  }>
}

export async function GET(_request: NextRequest, { params }: Props) {
  const { collectionId } = await params;
  return asNextResponse(createResponse("/collections/{collectionId}", collectionId));
}
