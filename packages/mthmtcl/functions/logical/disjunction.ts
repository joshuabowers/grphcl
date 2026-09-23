import {
  Boolean,
  Complement,
  Complex,
  Conjunction,
  Disjunction,
  Real,
} from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { $converse } from "./converseImplication.ts";
import { $implies } from "./implication.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";
import { canonicalizeFrom } from "../../utility/canonicalization.ts";

/**
 * Internal implementation of {@link or}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $or: BinaryFn<
  Disjunction,
  Boolean
> = binary(Disjunction, Boolean)(
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [boolean(l.raw || r.raw), Action.Application],
  ),
  when([is(Complex), is(Complex)], (l, r) => [
    boolean(
      l.raw.a !== 0 || l.raw.b !== 0 ||
        r.raw.a !== 0 || r.raw.b !== 0,
    ),
    Action.Application,
  ]),
  when(
    [is(Real), is(Real)],
    (l, r) => [boolean(l.raw !== 0 || r.raw !== 0), Action.Application],
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [l, Action.Identity],
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    [_, isValue(boolean(true))],
    [boolean(true), Action.Annihilator],
  ),
  when(
    [isValue(boolean(true)), _],
    [boolean(true), Action.Annihilator],
  ),
  when(
    deepEquals,
    (l, _r) => [l, Action.Idempotency],
  ),
  when(
    (l, r) => is(Conjunction)(r) && deepEquals(l, r.left),
    (l, _r) => [l, Action.Absorption],
  ),
  when(
    (l, r) => is(Conjunction)(r) && deepEquals(l, r.right),
    (l, _r) => [l, Action.Absorption],
  ),
  when(
    (l, r) => is(Conjunction)(l) && deepEquals(l.left, r),
    (_l, r) => [r, Action.Absorption],
  ),
  when(
    (l, r) => is(Conjunction)(l) && deepEquals(l.right, r),
    (_l, r) => [r, Action.Absorption],
  ),
  when(
    (l, r) => is(Complement)(r) && deepEquals(l, r.child),
    [boolean(true), Action.Tautology],
  ),
  when(
    (l, r) => is(Complement)(l) && deepEquals(l.child, r),
    [boolean(true), Action.Tautology],
  ),
  when(
    [is(Complement), _],
    (l, r) => [
      $implies(l.child, r),
      Action.Conversion,
    ],
  ),
  when(
    [_, is(Complement)],
    (l, r) => [
      $converse(l, r.child),
      Action.Conversion,
    ],
  ),
);

/**
 * A {@link Boolean}-valued logical connective operator,
 * which calculates the disjunction of its operands.
 *
 * Non-boolean numeric inputs are coerced to boolean before comparison.
 *
 * @example For a pair of boolean values:
 * ```ts
 * const result = or(boolean(true), boolean(false))
 * // => boolean(true)
 * ```
 *
 * @example For two indeterminate subtrees, creates
 * an {@link Disjunction}:
 * ```ts
 * const result = or(variable('x'), variable('y'))
 * // => new Disjunction(variable('x'), variable('y'))
 * ```
 *
 * @example Like other logical connectives, this will convert to
 * other connectives under the right circumstances:
 * ```ts
 * const result = or(not(variable('x')), variable('y'))
 * // => implies(variable('x'), variable('y'))
 * ```
 */
export const or: BinaryFn<
  Disjunction,
  Boolean
> = canonicalizeFrom($or);
