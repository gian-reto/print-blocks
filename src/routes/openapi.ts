import type { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import type { AppConfig } from "../config";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { packageInfo } from "../util/package-info";

const createOpenApiDocumentConfig = (origin: string) => ({
  openapi: "3.0.0",
  info: {
    title: "Print Blocks API",
    version: packageInfo.version,
  },
  servers: [
    {
      url: origin,
      description: "Current server",
    },
  ],
});

const getRequestOrigin = (url: string) => new URL(url).origin;

type RegisterOpenApiRouteOptions = Pick<
  AppConfig,
  "exposeDocs" | "exposeLlmsTxt"
>;

export const registerOpenApiRoute = (
  app: OpenAPIHono,
  options: RegisterOpenApiRouteOptions,
) => {
  app.doc("/openapi.json", (c) =>
    createOpenApiDocumentConfig(getRequestOrigin(c.req.url)),
  );

  if (options.exposeDocs) {
    app.get(
      "/docs",
      Scalar({
        url: "/openapi.json",
        pageTitle: "Print Blocks API Reference",
        agent: {
          disabled: true,
        },
        hideClientButton: true,
        mcp: {
          disabled: true,
        },
        theme: "default",
      }),
    );
  }

  if (options.exposeLlmsTxt) {
    app.get("/llms.txt", async (c) => {
      const document = app.getOpenAPIDocument(
        createOpenApiDocumentConfig(getRequestOrigin(c.req.url)),
      );
      const markdown = await createMarkdownFromOpenApi(
        JSON.stringify(document),
      );

      return c.text(markdown);
    });
  }
};
