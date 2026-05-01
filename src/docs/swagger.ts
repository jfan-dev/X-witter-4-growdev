import { responses } from "./components/responses/index.js";
import { schemas } from "./components/schemas/index.js";
import { globalSecurity, securitySchemes } from "./config/security.js";
import { servers } from "./config/servers.js";
import { tags } from "./config/tags.js";
import { paths } from "./paths/index.js";

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "X-uitter API",
    version: "1.0.0",
    description: "REST API for X-uitter MVP",
  },
  servers,
  tags,
  paths,
  components: {
    securitySchemes,
    schemas,
    responses,
  },
  security: globalSecurity,
};