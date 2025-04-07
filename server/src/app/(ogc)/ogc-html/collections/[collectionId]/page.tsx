import { createResponse, isOGCResponseSuccess } from "@/app/(ogc)/responses";

interface Props {
  params: Promise<{
    collectionId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { collectionId } = await params;
  const ogcCollectionInfoPageData = createResponse("/collections/{collectionId}", collectionId);

  return isOGCResponseSuccess(ogcCollectionInfoPageData) ? (
    <div>
      <h1>{ ogcCollectionInfoPageData.title }</h1>
      <p>{ ogcCollectionInfoPageData.description }</p>
      <ul>
        {
          ogcCollectionInfoPageData.links.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.title}</a>
            </li>
          ))
        }
      </ul>
    </div>
  ) : (
    <div>
      <h1>{ ogcCollectionInfoPageData.code }</h1>
      <p>{ ogcCollectionInfoPageData.description }</p>
    </div>
  );
}
