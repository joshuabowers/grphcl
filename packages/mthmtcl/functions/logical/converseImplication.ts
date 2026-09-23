import { Boolean, ConverseImplication, Numeric } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { _ } from "@arrows/multimethod";
import { isValue } from "../../utility/deepEquals.ts";
import { $not } from "./complement.ts";
import { $or } from "./disjunction.ts";
import { canonicalizeFrom } from "../../utility/canonicalization.ts";

/**
 * Internal implementation of {@link converse}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $converse: BinaryFn<
  ConverseImplication,
  Boolean
> = binary(ConverseImplication, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    $or(l, $not(r)),
    Action.Application,
  ]),
  when(
    [isValue(boolean(true)), _],
    [boolean(true), Action.Annihilator],
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [l, Action.Identity],
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [$not(r), Action.Conversion],
  ),
  when(
    [_, isValue(boolean(false))],
    [boolean(true), Action.Annihilator],
  ),
);

/**
 * A {@link Boolean}-valued logical connective operator,
 * which calculates the converse implication of its operands.
 * This is equivalent to the {@link Disjunction} of the left
 * operand and the {@link Complement} of the right.
 *
 * Non-boolean numeric inputs are coerced to boolean before comparison.
 *
 * @example For a pair of boolean values:
 * ```ts
 * const result = converse(boolean(false), boolean(false))
 * // => boolean(true)
 * ```
 *
 * @example For two indeterminate subtrees, creates
 * an {@link ConverseImplication}:
 * ```ts
 * const result = converse(variable('x'), variable('y'))
 * // => new ConverseImplication(variable('x'), variable('y'))
 * ```
 *
 * @example Like other logical connectives, this will convert to
 * other connectives under the right circumstances:
 * ```ts
 * const result = converse(boolean(false), variable('x'))
 * // => not(variable('x'))
 * ```
 */
export const converse: BinaryFn<
  ConverseImplication,
  Boolean
> = canonicalizeFrom($converse);
