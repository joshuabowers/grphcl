import { Boolean, Complex, Exponentiation, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialRight,
  when,
} from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

/**
 * Creates {@link Exponentiation} AST nodes.
 *
 * Derived from {@link binary}: takes two {@link TreeNode}
 * inputs, returning some flavor of {@link TreeNode} output.
 *
 * This function performs numerous numerical and algebraic
 * analyses, yielding different types of TreeNode for
 * different edge casees. Some of these are documented by
 * the examples.
 *
 * Note that, like all {@link binary}-derived functions,
 * raise will coerce mixed types (@see {@link BinaryFn}).
 *
 * @example Default algebraic analysis
 * ```ts
 * const raised = raise(variable('x'), variable('y'));
 * // => new Exponentiation(new Variable('x'), new Variable('y'))
 * ```
 *
 * @example Real exponentiation
 * ```ts
 * const result = raise(real(2), real(10)) // => real(1024)
 * ```
 *
 * @example Complex exponentiation
 * ```ts
 * const result = raise(complex(0, 1), complex(0, 1))
 * // => complex(0.20787957635076193, 0)
 * ```
 *
 * @example Complex-coercion
 * ```ts
 * const result = raise(real(5), complex(1, 2))
 * // => ~= complex(-4.9851, -0.3860)
 * ```
 */
export const raise: BinaryFn<Exponentiation> = binary(Exponentiation)(
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [boolean(l.raw || !r.raw), Action.Application],
  ),
  when([is(Complex), is(Complex)], (l, r) => {
    const p = Math.hypot(l.raw.a, l.raw.b),
      arg = Math.atan2(l.raw.b, l.raw.a);
    const dLnP = r.raw.b * Math.log(p), cArg = r.raw.a * arg;
    const multiplicand = (p ** r.raw.a) * Math.exp(-r.raw.b * arg);
    return [
      complex(
        multiplicand * Math.cos(dLnP + cArg),
        multiplicand * Math.sin(dLnP + cArg),
      ),
      Action.Application,
    ];
  }),
  when(
    [is(Real), is(Real)],
    (l, r) => [real(l.raw ** r.raw), Action.Application],
  ),
);

/**
 * Creates {@link Exponentiation} AST nodes.
 *
 * This function is derived from {@link raise}, partially
 * evaluating the latter by binding its right-input to `real(-1)`.
 *
 * This function will behave mostly analogously to a unary
 * function (but please refer to {@link PartialBinaryFn} for
 * type behavior), in that it accepts a single input which
 * will always be raised by -1.
 */
export const reciprocal: PartialBinaryFn<
  Exponentiation,
  Real
> = partialRight(raise, real(-1));

/**
 * Creates {@link Exponentiation} AST nodes.
 *
 * This function is derived from {@link raise}, partially
 * evaluating the latter by binding its right-input to `real(0.5)`.
 *
 * This function will behave mostly analogously to a unary
 * function (but please refer to {@link PartialBinaryFn} for
 * type behavior), in that it accepts a single input which
 * will always be raised by 0.5.
 */
export const sqrt: PartialBinaryFn<
  Exponentiation,
  Real
> = partialRight(raise, real(0.5));

/**
 * Creates {@link Exponentiation} AST nodes.
 *
 * This function is derived from {@link raise}, partially
 * evaluating the latter by binding its right-input to `real(2)`.
 *
 * This function will behave mostly analogously to a unary
 * function (but please refer to {@link PartialBinaryFn} for
 * type behavior), in that it accepts a single input which
 * will always be raised by 2.
 */
export const square: PartialBinaryFn<
  Exponentiation,
  Real
> = partialRight(raise, real(2));
