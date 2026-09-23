import { Biconditional, Boolean, Numeric } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";
import { $not } from "./complement.ts";
import { $and } from "./conjunction.ts";
import { $implies } from "./implication.ts";
import { canonicalizeFrom } from "../../utility/canonicalization.ts";

/**
 * Internal implementation of {@link xnor}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $xnor: BinaryFn<
  Biconditional,
  Boolean
> = binary(Biconditional, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    $and($implies(l, r), $implies(r, l)),
    Action.Application,
  ]),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [r, Action.Identity],
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
    (l, _r) => [$not(l), Action.Conversion],
  ),
  when(deepEquals, [boolean(true), Action.Annihilator]),
);

/**
 * A {@link Boolean}-valued logical connective operator,
 * which calculates the equivalence of its operands.
 *
 * Non-boolean numeric inputs are coerced to boolean before comparison.
 *
 * @example For a pair of boolean values:
 * ```ts
 * const result = xnor(boolean(true), boolean(true))
 * // => boolean(true)
 * ```
 *
 * @example For two indeterminate subtrees, creates
 * an {@link Biconditional}:
 * ```ts
 * const result = xnor(variable('x'), variable('y'))
 * // => new Biconditional(variable('x'), variable('y'))
 * ```
 *
 * @example Like other logical connectives, this will convert to
 * other connectives under the right circumstances:
 * ```ts
 * const result = xnor(boolean(false), variable('x'))
 * // => not(variable('x'))
 * ```
 */
export const xnor: BinaryFn<
  Biconditional,
  Boolean
> = canonicalizeFrom($xnor);
