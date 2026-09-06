import { Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { field, type FieldFn, when } from "../factories/field.ts";

/**
 * Creates instances of {@link Complex} field types.
 *
 * Can take:
 * 1. a numeric pair, `[a, b] = [number, number]`
 * 2. a {@link Boolean}, setting {@link Complex.raw.a} to 0 or 1
 *    depending upon truthiness.
 * 3. a {@link Complex}, copying its {@link Complex.raw}
 * 4. a {@link Real}, copying it as the real part of the
 *    generated complex.
 *
 * @example
 * ```ts
 * const z = complex(3, 4) // => new Complex({a: 3, b: 4})
 * ```
 *
 * @example
 * ```ts
 * const z = complex(real(5.5)) // => new Complex({a: 5.5, b: 0})
 * ```
 */
export const complex: FieldFn<
  Complex,
  { a: number; b: number },
  [number, number]
> = field(
  Complex,
  ([a, b]: [number, number]) => ({ a, b }),
)(
  when(is(Boolean), (b) => [[b.raw ? 1 : 0, 0], Action.Conversion]),
  when(is(Complex), (c) => [[c.raw.a, c.raw.b], Action.Identity]),
  when(is(Real), (r) => [[r.raw, 0], Action.Conversion]),
);
