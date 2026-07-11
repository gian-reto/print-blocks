import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { HttpStatus } from "http-status";
import type { PickByKeyType } from "../util/pick-by-key-type";

export type HttpStatusCode = keyof PickByKeyType<
  HttpStatus,
  ContentfulStatusCode
>;
