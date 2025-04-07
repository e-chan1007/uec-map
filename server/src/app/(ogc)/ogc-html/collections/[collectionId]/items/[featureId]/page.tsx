import { createResponse, isOGCResponseError, isOGCResponseSuccess } from "@/app/(ogc)/responses";

interface Props {
  params: Promise<{
    collectionId: string;
    featureId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { collectionId, featureId } = await params;
  const ogcCollectionInfoPageData = createResponse("/collections/{collectionId}", collectionId);
  const ogcItemPageData = createResponse("/collections/{collectionId}/items/{featureId}", collectionId, featureId);

  return isOGCResponseSuccess(ogcCollectionInfoPageData) && isOGCResponseSuccess(ogcItemPageData) ? (
    <div>
      <h1>{ ogcCollectionInfoPageData.title } - Item: { (ogcItemPageData.properties as { name?: string}).name }</h1>
      <ul>
        {
          ogcItemPageData.links!.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.title}</a>
            </li>
          ))
        }
      </ul>
    </div>
  ) : isOGCResponseError(ogcItemPageData) && (
    <div>
      <h1>{ ogcItemPageData.code }</h1>
      <p>{ ogcItemPageData.description }</p>
    </div>
  );
}
