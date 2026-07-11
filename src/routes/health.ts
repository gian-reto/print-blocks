import { createRoute, type OpenAPIHono } from "@hono/zod-openapi";
import { createJsonResponseConfig } from "../http/response";
import status from "http-status";

export const registerHealthRoute = (app: OpenAPIHono) => {
  const route = createRoute({
    method: "get",
    path: "/healthz",
    responses: {
      [status.OK]: createJsonResponseConfig("Application liveness response."),
    },
  });

  app.openapi(route, (c) => c.json({ ok: true }, status.OK));
};
