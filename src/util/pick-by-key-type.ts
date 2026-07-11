/**
 * Pick all properties from `TObj` whose keys are assignable to type `TKeyType`.
 */
export type PickByKeyType<TObj, TKeyType> = {
  [Key in keyof TObj as Key extends TKeyType | undefined
    ? Key
    : never]: TObj[Key];
};
