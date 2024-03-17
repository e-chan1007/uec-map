import { createSwaggerSpec } from "next-swagger-doc";
import "swagger-ui-react/swagger-ui.css";

import ReactSwagger from "./components/ReactSwagger";

import { ogcSpec } from "@/app/(ogc)/constants/spec";

export default function ApiDoc() {
  const spec = createSwaggerSpec({ definition: ogcSpec });
  return <ReactSwagger spec={spec} />;
}
