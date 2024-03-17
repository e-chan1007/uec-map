import { createResponse, isOGCResponseSuccess } from "@/app/(ogc)/responses";

export default async function Page() {
  const ogcLandingPageData = createResponse("/");

  return isOGCResponseSuccess(ogcLandingPageData) ? (
    <div>
      <h1>{ogcLandingPageData.title}</h1>
      <p>{ogcLandingPageData.description}</p>
      {
        ogcLandingPageData.links.map(link => (
          <li key={link.href}>
            <a href={link.href}>{link.title}</a>
          </li>
        ))
      }
    </div>
  ) : (
    <div>
      <h1>{ogcLandingPageData.code}</h1>
      <p>{ogcLandingPageData.description}</p>
    </div>
  );
}
