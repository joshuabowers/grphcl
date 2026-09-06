import { Boolean, Complex, Negation, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

/**
 * Creates {@link Negation} AST node instances.
 *
 * This is a derivative of {@link unary}.
 *
 * For real values, this is a sign flip:
 * @example
 * ```ts
 * const n = negate(real(5)) // => real(-5)
 * const m = negate(real(-5)) // => real(5)
 * ```
 *
 * For complex values, this sign flips both the real and
 * imaginary parts; e.g., for `z = a + bi; -z = -a - bi`:
 * @example
 * ```ts
 * const z = negate(complex(3, 4)) // => complex(-3, -4);
 * ```
 */
export const negate: UnaryFn<Negation> = unary(Negation)(
  when(is(Boolean), (b) => [b, Action.Application]),
  when(is(Complex), (c) => [complex(-c.raw.a, -c.raw.b), Action.Application]),
  when(is(Real), (r) => [real(-r.raw), Action.Application]),
);
