/**
 * Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
 * type.
 *
 * @example
 * ```ts
 * const example = omit(['a', 'b'])({ a: 1, b: 2, c: 3 }); // { c: 3 }
 * ```
 *
 * @returns A new object without the omitted keys.
 */
export const omit =
  <const TOmittedKeys extends PropertyKey>(omittedKeys: Array<TOmittedKeys>) =>
  <const TRecord extends Record<PropertyKey, unknown>>(
    record: TRecord,
  ): Omit<TRecord, TOmittedKeys> => {
    const copy = { ...record };

    for (const key of omittedKeys) {
      delete copy[key];
    }

    return copy as Omit<TRecord, TOmittedKeys>;
  };
