import { Boolean, Implication, Numeric } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { _ } from "@arrows/multimethod";
import { boolean } from "../boolean.ts";
import { isValue } from "../../utility/deepEquals.ts";
import { $not } from "./complement.ts";
import { $or } from "./disjunction.ts";
import { canonicalizeFrom } from "../../utility/canonicalization.ts";

/**
 * Internal implementation of {@link implies}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $implies: BinaryFn<
  Implication,
  Boolean
> = binary(Implication, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    $or($not(l), r),
    Action.Application,
  ]),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    [_, isValue(boolean(true))],
    [boolean(true), Action.Annihilator],
  ),
  when(
    [isValue(boolean(false)), _],
    [boolean(true), Action.Annihilator],
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [
      $not(l),
      Action.Conversion,
    ],
  ),
);

/**
 * A {@link Boolean}-valued logical connective operator,
 * which calculates the implication of its operands. This is
 * the disjunction of the left operand with the right.
 *
 * Non-boolean numeric inputs are coerced to boolean before comparison.
 *
 * @example For a pair of boolean values:
 * ```ts
 * const result = implies(boolean(true), boolean(false))
 * // => boolean(false)
 * ```
 *
 * @example For two indeterminate subtrees, creates
 * an {@link Implication}:
 * ```ts
 * const result = implies(variable('x'), variable('y'))
 * // => new Implication(variable('x'), variable('y'))
 * ```
 *
 * @example Like other logical connectives, this will convert to
 * other connectives under the right circumstances:
 * ```ts
 * const result = implies(variable('x'), boolean(false))
 * // => not(variable('x'))
 * ```
 */
export const implies: BinaryFn<
  Implication,
  Boolean
> = canonicalizeFrom($implies);
