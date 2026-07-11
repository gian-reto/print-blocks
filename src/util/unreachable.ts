/**
 * Utility function to assert that a code path is unreachable. This is useful
 * for ensuring that all cases in a switch statement or conditional are handled,
 * and to catch potential bugs where a case is not accounted for.
 *
 * Note: At runtime, this function will only log an error, but never throw an
 * exception.
 */
export function unreachable(value: never, message?: string): never {
  console.error(
    `Unreachable code reached${message ? `: ${message}` : ""}. Value:`,
    value,
  );

  return value;
}
