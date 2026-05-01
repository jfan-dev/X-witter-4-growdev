import { env } from "../../config/env.js";

const localServer = {
  url: "http://localhost:3002",
  description: "Local server",
};

const deployedUrl =
  env.swaggerServerUrl ||
  (env.vercelUrl ? `https://${env.vercelUrl}` : undefined);

const isProduction =
  process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

export const servers =
  isProduction && deployedUrl
    ? [
        {
          url: deployedUrl,
          description: "Production server",
        },
      ]
    : deployedUrl
      ? [
          {
            url: deployedUrl,
            description: "Production server",
          },
          localServer,
        ]
      : [localServer];