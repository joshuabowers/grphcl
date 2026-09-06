import { Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { field, type FieldFn, when } from "../factories/field.ts";

/**
 * Creates instances of {@link Real} field types.
 *
 * Can take:
 * 1. a numeric input
 * 2. a {@link Boolean}, assigning 0 for false, 1 otherwise
 * 3. a {@link Complex}, copying its {@link Complex.raw.a}
 * 4. a {@link Real}, copying its value
 *
 * @example
 * ```ts
 * const n = real(5.5) // === new Real(5.5)
 * ```
 *
 * @example
 * ```ts
 * const cast = real(complex(3, 4)) // === new Real(3)
 * ```
 */
export const real: FieldFn<Real, number, [number]> = field(
  Real,
  ([n]: [number]) => n,
)(
  when(is(Boolean), (b) => [[b.raw ? 1 : 0], Action.Conversion]),
  when(is(Complex), (c) => [[c.raw.a], Action.Conversion]),
  when(is(Real), (r) => [[r.raw], Action.Identity]),
);

/**
 * The Euler-Mascheroni constant, used in calculating the
 * digamma function.
 *
 * @see {@link https://en.wikipedia.org/wiki/Euler%27s_constant | Euler's Constant}.
 */
export const EulerMascheroni = real(0.57721566490153286060);
