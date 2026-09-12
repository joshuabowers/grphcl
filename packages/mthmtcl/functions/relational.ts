import {
  Boolean,
  Complex,
  Equality,
  GreaterThan,
  GreaterThanOrEquals,
  Inequality,
  LessThan,
  LessThanOrEquals,
  Numeric,
  Real,
} from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, when } from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { not } from "./not.ts";
import { abs } from "./absolute.ts";

/**
 * Creates {@link Equality} AST nodes for unbound inputs and returns a
 * Boolean-valued result for Boolean, Complex, and Real numeric inputs.
 *
 * @example Numeric input:
 * ```ts
 * const result = equals(real(1), real(1));
 * // => boolean(true)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = equals(variable('x'), variable('y'));
 * // => new Equality(new Variable('x'), new Variable('y'))
 * ```
 */
export const equals: BinaryFn<
  Equality,
  Boolean
> = binary(Equality, Boolean)(
  when([is(Boolean), is(Boolean)], (l, r) => [
    boolean(l.raw === r.raw),
    Action.Application,
  ]),
  when([is(Complex), is(Complex)], (l, r) => [
    boolean(l.raw.a === r.raw.a && l.raw.b === r.raw.b),
    Action.Application,
  ]),
  when([is(Real), is(Real)], (l, r) => [
    boolean(l.raw === r.raw),
    Action.Application,
  ]),
);

/**
 * Creates {@link GreaterThan} AST nodes for unbound inputs and evaluates to
 * a Boolean result for Boolean, Complex, and Real numeric inputs.
 *
 * @example Numeric input:
 * ```ts
 * const result = gt(real(2), real(1));
 * // => boolean(true)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = gt(variable('x'), variable('y'));
 * // => new GreaterThan(new Variable('x'), new Variable('y'))
 * ```
 */
export const gt: BinaryFn<
  GreaterThan,
  Boolean
> = binary(GreaterThan, Boolean)(
  when([is(Boolean), is(Boolean)], (l, r) => [
    boolean(l.raw > r.raw),
    Action.Application,
  ]),
  when([is(Complex), is(Complex)], (l, r) => [
    boolean(abs(l).raw.a > abs(r).raw.a),
    Action.Application,
  ]),
  when([is(Real), is(Real)], (l, r) => [
    boolean(l.raw > r.raw),
    Action.Application,
  ]),
);

/**
 * Creates {@link GreaterThanOrEquals} AST nodes for unbound inputs and
 * returns a Boolean-valued result for numeric inputs.
 *
 * @example Numeric input:
 * ```ts
 * const result = gte(real(2), real(2));
 * // => boolean(true)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = gte(variable('x'), variable('y'));
 * // => new GreaterThanOrEquals(new Variable('x'), new Variable('y'))
 * ```
 */
export const gte: BinaryFn<
  GreaterThanOrEquals,
  Boolean
> = binary(GreaterThanOrEquals, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    not(lt(l, r)),
    Action.Delegation,
  ]),
);

/**
 * Creates {@link LessThan} AST nodes for unbound inputs and evaluates to
 * a Boolean result for Boolean, Complex, and Real numeric inputs.
 *
 * @example Numeric input:
 * ```ts
 * const result = lt(real(1), real(2));
 * // => boolean(true)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = lt(variable('x'), variable('y'));
 * // => new LessThan(new Variable('x'), new Variable('y'))
 * ```
 */
export const lt: BinaryFn<
  LessThan,
  Boolean
> = binary(LessThan, Boolean)(
  when([is(Boolean), is(Boolean)], (l, r) => [
    boolean(l.raw < r.raw),
    Action.Application,
  ]),
  when([is(Complex), is(Complex)], (l, r) => [
    boolean(abs(l).raw.a < abs(r).raw.a),
    Action.Application,
  ]),
  when([is(Real), is(Real)], (l, r) => [
    boolean(l.raw < r.raw),
    Action.Application,
  ]),
);

/**
 * Creates {@link LessThanOrEquals} AST nodes for unbound inputs and returns
 * a Boolean-valued result for numeric inputs.
 *
 * @example Numeric input:
 * ```ts
 * const result = lte(real(1), real(1));
 * // => boolean(true)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = lte(variable('x'), variable('y'));
 * // => new LessThanOrEquals(new Variable('x'), new Variable('y'))
 * ```
 */
export const lte: BinaryFn<
  LessThanOrEquals,
  Boolean
> = binary(LessThanOrEquals, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    not(gt(l, r)),
    Action.Delegation,
  ]),
);

/**
 * Creates {@link Inequality} AST nodes for unbound inputs and returns a
 * Boolean-valued result for numeric inputs.
 *
 * @example Numeric input:
 * ```ts
 * const result = nequals(real(1), real(2));
 * // => boolean(true)
 * ```
 *
 * @example Unbound input:
 * ```ts
 * const result = nequals(variable('x'), variable('y'));
 * // => new Inequality(new Variable('x'), new Variable('y'))
 * ```
 */
export const nequals: BinaryFn<
  Inequality,
  Boolean
> = binary(Inequality, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    not(equals(l, r)),
    Action.Delegation,
  ]),
);
