import { Boolean, Negation, Numeric } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { canonicalizeFrom, flip } from "../utility/canonicalization.ts";

/**
 * Creates {@link Negation} AST node instances.
 *
 * This is a derivative of {@link unary}.
 *
 * @example For real values, this is a sign flip:
 * ```ts
 * const n = negate(real(5)) // => real(-5)
 * const m = negate(real(-5)) // => real(5)
 * ```
 *
 * @example For complex values, this sign flips both the real
 * and imaginary parts; e.g., for `z = a + bi; -z = -a - bi`:
 * ```ts
 * const z = negate(complex(3, 4)) // => complex(-3, -4);
 * ```
 */
export const $negate: UnaryFn<Negation> = unary(Negation)(
  when(is(Boolean), (b) => [b, Action.Application]),
  when(is(Numeric), (n) => [flip(n), Action.Application]),
  when(is(Negation), (e) => [e.child, Action.Identity]),
);

export const negate: UnaryFn<Negation> = canonicalizeFrom($negate);
