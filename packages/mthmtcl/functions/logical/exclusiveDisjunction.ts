import { Boolean, ExclusiveDisjunction, Numeric } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { $not } from "./complement.ts";
import { $and } from "./conjunction.ts";
import { $or } from "./disjunction.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";
import { canonicalizeFrom } from "../../utility/canonicalization.ts";

/**
 * Internal implementation of {@link xor}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $xor: BinaryFn<
  ExclusiveDisjunction,
  Boolean
> = binary(ExclusiveDisjunction, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    $and($or(l, r), $not($and(l, r))),
    Action.Application,
  ]),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [l, Action.Identity],
  ),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [$not(r), Action.Conversion],
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [$not(l), Action.Conversion],
  ),
  when(
    deepEquals,
    [boolean(false), Action.Annihilator],
  ),
);

/**
 * A {@link Boolean}-valued logical connective operator,
 * which calculates the exclusive disjunction of its operands.
 * This is only true when the operands are inequivalent.
 *
 * Non-boolean numeric inputs are coerced to boolean before comparison.
 *
 * @example For a pair of boolean values:
 * ```ts
 * const result = xor(boolean(true), boolean(true))
 * // => boolean(false)
 * ```
 *
 * @example For two indeterminate subtrees, creates
 * an {@link ExclusiveDisjunction}:
 * ```ts
 * const result = xor(variable('x'), variable('y'))
 * // => new ExclusiveDisjunction(variable('x'), variable('y'))
 * ```
 *
 * @example Like other logical connectives, this will convert to
 * other connectives under the right circumstances:
 * ```ts
 * const result = xor(boolean(true), variable('y'))
 * // => not(variable('y'))
 * ```
 */
export const xor: BinaryFn<
  ExclusiveDisjunction,
  Boolean
> = canonicalizeFrom($xor);
