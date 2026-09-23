import {
  Addition,
  Boolean,
  Complex,
  Degree,
  Division,
  Exponentiation,
  Logarithm,
  Multiplication,
  Negation,
  Numeric,
  Real,
  Subtraction,
  UnaryNode,
  Variable,
} from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { $real } from "./real.ts";

/**
 * Calculates the {@link degree} of an {@link Exponentiation}.
 *
 * This will either be value of a {@link Real}, the magnitude
 * of a {@link Complex}, or Infinity for a {@link Variable}
 */
export const subDegree: UnaryFn<
  Degree,
  Real
> = unary(Degree, Real)(
  when(is(Complex), (c) => [
    $real(Math.hypot(c.raw.a, c.raw.b)),
    Action.Identity,
  ]),
  when(is(Numeric), (n) => [$real(n), Action.Identity]),
  when(is(Variable), [$real(Infinity), Action.Absorption]),
);

/**
 * Calculates the degree of a passed AST expression.
 *
 * The degree, from algebraic analysis of polynomial
 * functions, describes the highest contributing monomial
 * of the polynomial; specifically, the value represents
 * the sum of that monomials powers.
 *
 * This is a {@link Real}-flavored {@link UnaryFn}: all
 * edge cases will return a real value which ranges from
 * -Infinity to Infinity.
 *
 * @example The degree of a 0-value is -Infinity; non-zero
 * numbers have degree 0.
 * ```ts
 * const result = degree(real(0)) // real(-Infinity)
 * const r2 = degree(real(1)) // real(0)
 * ```
 *
 * @example The degree of an addition or subtraction is the
 * max of its children
 * ```ts
 * const result = degree(add(variable('x'), real(1)))
 * // => real(Math.max(1, 0))
 * ```
 *
 * @example The degree of a multiplication is the sum of
 * the degrees of its branches; it is the difference of
 * the subtree degrees of a division.
 * ```ts
 * const r1 = degree(multiply(variable('x'), raise(variable('y'), real(2))))
 * // => real(3)
 * const r2 = degree(divide(variable('x'), raise(variable('y'), real(2))))
 * // => real(-1)
 * ```
 *
 * @example Exponentiation delegates to {@link subDegree}.
 * ```ts
 * const result = degree(raise(real(2), variable('x')))
 * // => subDegree(variable('x')) => real(Infinity)
 * ```
 *
 * @example Degrees of Negations are the degrees of their
 * child trees; degrees of Logarithms are always 0; for all
 * unary nodes, 1
 * ```ts
 * const r1 = degree(negate(variable('x'))) // => real(1)
 * const r2 = degree(ln(variable('x'))) // => real(0)
 * const r3 = degree(cos(variable('x'))) // => real(1)
 * ```
 */
export const degree: UnaryFn<
  Degree,
  Real
> = unary(Degree, Real)(
  when(is(Boolean, (b) => !b.raw), [$real(-Infinity), Action.Annihilator]),
  when(is(Complex, (c) => c.raw.a === 0 && c.raw.b === 0), [
    $real(-Infinity),
    Action.Annihilator,
  ]),
  when(is(Real, (r) => r.raw === 0), [$real(-Infinity), Action.Annihilator]),
  when(is(Numeric), [$real(0), Action.Identity]),
  when(is(Variable), [$real(1), Action.Identity]),
  when(is(Addition), (a) => [
    $real(Math.max(degree(a.left).raw, degree(a.right).raw)),
    Action.Recursion,
  ]),
  when(is(Subtraction), (s) => [
    $real(Math.max(degree(s.left).raw, degree(s.right).raw)),
    Action.Recursion,
  ]),
  when(is(Negation), (n) => [degree(n.child), Action.Recursion]),
  when(is(Multiplication), (m) => [
    $real(degree(m.left).raw + degree(m.right).raw),
    Action.Recursion,
  ]),
  when(is(Division), (d) => [
    $real(degree(d.left).raw - degree(d.right).raw),
    Action.Recursion,
  ]),
  when(is(Exponentiation), (e) => [
    subDegree(e.right),
    Action.Delegation,
  ]),
  when(is(Logarithm), [$real(0), Action.Identity]),
  when(is(UnaryNode), [$real(1), Action.Identity]),
);
