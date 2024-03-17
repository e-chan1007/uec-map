import type { NextRequest } from "next/server";

import { asNextResponse, createResponse } from "@/app/(ogc)/responses";

interface Props {
  params: {
    collectionId: string;
    featureId: string;
  }
}

export async function GET(_request: NextRequest, { params: { collectionId, featureId } }: Props) {
  return asNextResponse(createResponse("/collections/{collectionId}/items/{featureId}", collectionId, featureId));
}
