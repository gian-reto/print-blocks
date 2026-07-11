import type { UnknownRecord } from "./unknown-record";

/**
 * Prettifies the given type, i.e., collapses the type to its most basic form.
 * For example, it will reduce intersections of {@link Record}s to a single,
 * unified {@link Record}.
 */
export type Prettify<T> = T extends UnknownRecord
  ? {
      [K in keyof T]: T[K];
    } & {}
  : T;
