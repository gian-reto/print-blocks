import type { UnknownRecord } from "./unknown-record";

/**
 * Omit properties from `TRecord` whose values extend `TValue`. Note: Optional
 * properties are removed, if they would have the specified value type when
 * defined.
 *
 * @example
 * Trivial examples:
 *
 * ```ts
 * type Example1 = OmitByValue<{ a: string; b: number; }, string>; // { b: number; }
 * type Example2 = OmitByValue<{ a: string; b: any; }, string>; // { b: any; }
 * type Example3 = OmitByValue<{ a: string; b: unknown; }, string>; // { b: unknown; }
 * type Example4 = OmitByValue<{ a: string; b: void; }, string>; // { b: void; }
 * type Example5 = OmitByValue<{ a: string; b: undefined; }, string>; // { b: undefined; }
 * type Example6 = OmitByValue<{ a: string; b: null; }, string>; // { b: null; }
 * type Example7 = OmitByValue<{ a?: string; b: number; }, string>; // { b: number; }
 * ```
 *
 * @example
 * Noteworthy cases:
 *
 * ```ts
 * type Example1 = OmitByValue<{ a: string; b: never; }, string>; // {}
 * ```
 *
 * @example
 * Unions and intersections:
 *
 * ```ts
 * type Example1 = OmitByValue<{ a: string; } | { a: string; }, string>; // {} | {}
 * type Example2 = OmitByValue<{ a: string; } | { a: number; }, string>; // {} | { a: number; }
 * type Example3 = OmitByValue<{ a: string; } & { b: string; }, string>; // {}
 * type Example4 = OmitByValue<{ a: string; } & { b: number; }, string>; // { b: number; }
 * ```
 */
export type OmitByValue<TRecord extends UnknownRecord, TValue> = {
  [K in keyof TRecord as Required<TRecord>[K] extends TValue
    ? never
    : K]: Exclude<TRecord[K], TValue>;
};

/**
 * Like `omit`, but by value.
 *
 * @example
 * ```ts
 * const example = omitByValue([2])({ a: 1, b: 2, c: 3 }); // { a: 1, c: 3 }
 * ```
 */
export const omitByValue =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  <const TValue extends unknown = unknown>(omittedValues: Array<TValue>) =>
    <const TRecord extends Record<PropertyKey, unknown>>(
      record: TRecord,
    ): OmitByValue<TRecord, (typeof omittedValues)[number]> => {
      const copy = { ...record };

      for (const key in copy) {
        // Cast doesn't matter because if the value is not in `omittedValues`,
        // `includes` will just return `false`, which is exactly what we want.
        if (omittedValues.includes(copy[key] as TValue)) {
          delete copy[key];
        }
      }

      return copy as unknown as OmitByValue<
        TRecord,
        (typeof omittedValues)[number]
      >;
    };
