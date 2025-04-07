import {
  createResponse,
  isOGCResponseError,
  isOGCResponseSuccess,
} from "@/app/(ogc)/responses";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    collectionId: string;
  }>;
  searchParams: Promise<{
    limit?: string;
    offset?: string;
    bbox?: string;
  }>;
}
export default async function Page({
  params,
  searchParams: _searchParams,
}: Props) {
  const { collectionId } = await params;
  const searchParams = await _searchParams;
  const limit = parseInt(searchParams.limit || "10") || null;
  const offset = parseInt(searchParams.offset || "0") || null;
  const bbox = searchParams.bbox || null;
  const ogcCollectionInfoPageData = createResponse(
    "/collections/{collectionId}",
    collectionId
  );
  const ogcItemListPageData = createResponse(
    "/collections/{collectionId}/items",
    collectionId,
    { limit, offset, bbox }
  );

  return (
    <Suspense>
      {isOGCResponseSuccess(ogcCollectionInfoPageData) &&
      isOGCResponseSuccess(ogcItemListPageData) ? (
        <div>
          <h1>{ogcCollectionInfoPageData.title} - Items</h1>
          <p>{ogcCollectionInfoPageData.description}</p>
          <h2>Items</h2>
          <ul>
            {ogcItemListPageData.features!.map((item) => (
              <li key={item.id}>
                {(item.properties as { name?: string }).name}
              </li>
            ))}
          </ul>
          <ul>
            {ogcItemListPageData.links!.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        isOGCResponseError(ogcItemListPageData) && (
          <div>
            <h1>{ogcItemListPageData.code}</h1>
            <p>{ogcItemListPageData.description}</p>
          </div>
        )
      )}
    </Suspense>
  );
}
