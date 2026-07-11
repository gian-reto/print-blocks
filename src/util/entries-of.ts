import type { Prettify } from "./prettify";

/**
 * Returns a type of the given `Record`s entries as key-value tuples. This is
 * similar to the return type of `Object.entries`. Warning: Objects can contain
 * additional properties that are not reflected in its type, which this type
 * does not (and cannot) account for.
 */
export type EntriesOf<TRecord extends Record<PropertyKey, unknown>> = Prettify<
  Array<
    {
      [TKey in keyof TRecord]: [TKey, TRecord[TKey]];
    }[keyof TRecord]
  >
>;

/**
 * A strongly typed version of `Object.entries`. Warning: Objects can contain
 * additional properties that are not reflected in its type, which the return
 * type of this function does not (and cannot) account for.
 */
export const entriesOf = <const TRecord extends Record<PropertyKey, unknown>>(
  record: TRecord,
): EntriesOf<TRecord> => Object.entries(record) as EntriesOf<TRecord>;
