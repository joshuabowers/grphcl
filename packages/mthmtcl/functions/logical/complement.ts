import {
  AlternativeDenial,
  Biconditional,
  Boolean,
  Complement,
  Complex,
  Conjunction,
  ConverseImplication,
  Disjunction,
  ExclusiveDisjunction,
  Implication,
  JointDenial,
  Real,
} from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { unary, type UnaryFn, when } from "../../factories/unary.ts";
import { boolean } from "../boolean.ts";
import { $and } from "./conjunction.ts";
import { $or } from "./disjunction.ts";
import { $xor } from "./exclusiveDisjunction.ts";
import { $nand } from "./alternativeDenial.ts";
import { $nor } from "./jointDenial.ts";
import { $xnor } from "./biconditional.ts";
import { canonicalizeFrom } from "../../utility/canonicalization.ts";

/**
 * Internal implementation of {@link xnor}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $not: UnaryFn<
  Complement,
  Boolean
> = unary(Complement, Boolean)(
  when(is(Boolean), (b) => [boolean(!b.raw), Action.Application]),
  when(
    is(Complex),
    (c) => [boolean(c.raw.a === 0 && c.raw.b === 0), Action.Application],
  ),
  when(is(Real), (r) => [boolean(r.raw === 0), Action.Application]),
  when(
    is(Complement),
    (v) => [v.child, Action.Idempotency],
  ),
  when(
    is(Conjunction),
    (v) => [$nand(v.left, v.right), Action.Complementation],
  ),
  when(
    is(Disjunction),
    (v) => [$nor(v.left, v.right), Action.Complementation],
  ),
  when(
    is(AlternativeDenial),
    (v) => [$and(v.left, v.right), Action.Complementation],
  ),
  when(
    is(JointDenial),
    (v) => [$or(v.left, v.right), Action.Complementation],
  ),
  when(
    is(ExclusiveDisjunction),
    (v) => [$xnor(v.left, v.right), Action.Complementation],
  ),
  when(
    is(Implication),
    (v) => [
      $and(v.left, $not(v.right)),
      Action.Complementation,
    ],
  ),
  when(
    is(Biconditional),
    (v) => [$xor(v.left, v.right), Action.Complementation],
  ),
  when(
    is(ConverseImplication),
    (v) => [
      $and($not(v.left), v.right),
      Action.Complementation,
    ],
  ),
);

/**
 * A {@link Boolean}-valued logical connective operator,
 * which calculates the complement of its operand.
 *
 * Non-boolean numeric inputs are coerced to boolean before comparison.
 *
 * @example For a pair of boolean values:
 * ```ts
 * const result = not(boolean(true))
 * // => boolean(false)
 * ```
 *
 * @example For two indeterminate subtrees, creates
 * an {@link Complement}:
 * ```ts
 * const result = not(variable('x'))
 * // => new Complement(variable('x'))
 * ```
 *
 * @example Like other logical connectives, this will convert to
 * other connectives under the right circumstances:
 * ```ts
 * const result = not(xor(variable('x'), variable('y')))
 * // => xnor(variable('x'), variable('y'))
 * ```
 */
export const not: UnaryFn<Complement, Boolean> = canonicalizeFrom($not);
