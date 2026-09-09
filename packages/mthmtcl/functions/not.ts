import { Boolean, Complement, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { boolean } from "./boolean.ts";

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
);
