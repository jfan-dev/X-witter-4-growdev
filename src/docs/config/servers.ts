import { env } from "../../config/env.js";

const localServer = {
  url: "http://localhost:3002",
  description: "Local server",
};

const productionUrl = env.swaggerServerUrl || env.renderExternalUrl;

export const servers = productionUrl
  ? [
      localServer,
      {
        url: productionUrl,
        description: "Production server",
      },
    ]
  : [localServer];