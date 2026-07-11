import { pipe } from "remeda";
import { omitByValue, type OmitByValue } from "./omit-by-value";

/**
 * Returns a function that omits all properties of `TRecord` whose value is
 * `undefined`.
 */
export const omitUndefined = <
  const TRecord extends Record<PropertyKey, unknown>,
>(
  record: TRecord,
): OmitByValue<TRecord, undefined> => pipe(record, omitByValue([undefined]));
