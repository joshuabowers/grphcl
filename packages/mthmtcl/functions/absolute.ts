import { Absolute, Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, when } from "../factories/unary.ts";

/**
 * Creates {@link Absolute} AST nodes;
 *
 * Derived from {@link unary}: has a singular input, returning
 * a {@link TreeNode} of some form.
 *
 * This function calculates the absolute value of its input:
 * for real inputs, this is analogous to sign flipping for
 * values less than 0.
 *
 * @example
 * ```ts
 * const result = abs(new Real(-10)) // => new Real(10)
 * ```
 *
 * For complex numbers, this calculates the magnitude of the
 * vector which describes the number.
 *
 * @example
 * ```ts
 * const result = abs(new Complex({a: 3, b: 4})) // => new Complex({a: 5, b: 0})
 * ```
 */
export const abs = unary(Absolute)(
  when(is(Boolean), (b) => [b, Action.Application]),
  when(
    is(Complex),
    (c) => [
      new Complex({ a: Math.hypot(c.raw.a, c.raw.b), b: 0 }),
      Action.Absorption,
    ],
  ),
  when(is(Real), (r) => [new Real(Math.abs(r.raw)), Action.Application]),
);
