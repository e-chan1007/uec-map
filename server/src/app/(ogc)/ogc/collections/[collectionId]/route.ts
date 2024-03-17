import type { NextRequest } from "next/server";

import { asNextResponse, createResponse } from "@/app/(ogc)/responses";

interface Props {
  params: {
    collectionId: string;
  }
}

export async function GET(_request: NextRequest, { params: { collectionId } }: Props) {
  return asNextResponse(createResponse("/collections/{collectionId}", collectionId));
}
