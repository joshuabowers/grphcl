import type { Constructor } from "./factory.ts";

export const are = <T, U>(
  ctorT: Constructor<T>,
  ctorU: Constructor<U>,
  inner?: (t: T, u: U) => boolean,
) =>
(valueT: unknown, valueU: unknown): boolean =>
  valueT instanceof ctorT &&
  valueU instanceof ctorU &&
  (inner?.(valueT, valueU) ?? true);
