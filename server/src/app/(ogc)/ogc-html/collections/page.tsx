import { createResponse, isOGCResponseSuccess } from "@/app/(ogc)/responses";

export default async function Page() {
  const ogcCollectionsPageData = createResponse("/collections");

  return isOGCResponseSuccess(ogcCollectionsPageData) ? (
    <div>
      <h1>Collections</h1>
      {
        ogcCollectionsPageData.collections.map(link => (
          <section key={link.id}>
            <h2>{link.title}</h2>
            <ul>
              { link.links.map(link => (
                <li key={link.href}>
                  <a href={link.href}>{link.title}</a>
                </li>
              ))}
            </ul>
          </section>
        ))
      }
      <ul>
        {
          ogcCollectionsPageData.links.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.title}</a>
            </li>
          ))
        }
      </ul>
    </div>
  ) : (
    <div>
      <h1>{ ogcCollectionsPageData.code }</h1>
      <p>{ ogcCollectionsPageData.description }</p>
    </div>
  );
}
