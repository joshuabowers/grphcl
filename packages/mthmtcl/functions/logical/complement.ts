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
import { and } from "./conjunction.ts";
import { or } from "./disjunction.ts";
import { xor } from "./exclusiveDisjunction.ts";
import { nand } from "./alternativeDenial.ts";
import { nor } from "./jointDenial.ts";
import { xnor } from "./biconditional.ts";

/**
 * Creates AST node instances of the logical operator
 * {@link Complement}.
 *
 * Unlike most other {@link unary}-derived functions, this
 * is {@link Boolean}-flavored for its numerical analyses.
 * That is, unless its input is unbound, it will always return
 * a boolean value.
 *
 * @example Boolean input
 * ```ts
 * const result = not(boolean(true)) // => boolean(false)
 * ```
 *
 * @example Real input
 * ```ts
 * const result = not(real(5)) // => boolean(false)
 * ```
 *
 * @example Complex input
 * ```ts
 * const result = not(complex(0, 0)) // => boolean(true)
 * ```
 *
 * @example Unbound input
 * ```ts
 * const result = not(variable('x'))
 * // => new Complement(new Variable('x'))
 * ```
 */
export const not: UnaryFn<
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
    (v) => [nand(v.left, v.right), Action.Complementation],
  ),
  when(
    is(Disjunction),
    (v) => [nor(v.left, v.right), Action.Complementation],
  ),
  when(
    is(AlternativeDenial),
    (v) => [and(v.left, v.right), Action.Complementation],
  ),
  when(
    is(JointDenial),
    (v) => [or(v.left, v.right), Action.Complementation],
  ),
  when(
    is(ExclusiveDisjunction),
    (v) => [xnor(v.left, v.right), Action.Complementation],
  ),
  when(
    is(Implication),
    (v) => [
      and(v.left, not(v.right)),
      Action.Complementation,
    ],
  ),
  when(
    is(Biconditional),
    (v) => [xor(v.left, v.right), Action.Complementation],
  ),
  when(
    is(ConverseImplication),
    (v) => [
      and(not(v.left), v.right),
      Action.Complementation,
    ],
  ),
);
