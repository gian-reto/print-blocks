import type { OpenAPIHono } from "@hono/zod-openapi";

export const registerOpenApiRoute = (app: OpenAPIHono) => {
  app.doc("/openapi.json", (c) => ({
    openapi: "3.0.0",
    info: {
      title: "Print Blocks API",
      version: "0.1.0",
    },
    servers: [
      {
        url: new URL(c.req.url).origin,
        description: "Current server",
      },
    ],
  }));
};
