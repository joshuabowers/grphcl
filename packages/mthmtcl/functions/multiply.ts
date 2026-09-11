import { _ } from "@arrows/multimethod";
import { Boolean, Complex, Multiplication, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialLeft,
  when,
} from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import {
  complex,
  ComplexInfinity,
  isComplexInfinity,
  isImaginary,
  isReal,
} from "./complex.ts";
import { real } from "./real.ts";

/**
 * Creates {@link Multiplication} AST nodes.
 *
 * Derived from {@link binary}: takes two {@link TreeNode}
 * inputs, returning some flavor of {@link TreeNode} output.
 *
 * This function performs numerous numerical and algebraic
 * analyses, yielding different types of TreeNode for
 * different edge casees. Some of these are documented by
 * the examples.
 *
 * Note that, like all {@link binary}-derived functions,
 * multiply will coerce mixed types (@see {@link BinaryFn}).
 *
 * @example Default algebraic analysis
 * ```ts
 * const multiplied = multiply(variable('x'), variable('y'));
 * // => new Multiplication(new Variable('x'), new Variable('y'))
 * ```
 *
 * @example Real multiplication
 * ```ts
 * const result = multiply(real(5), real(10)) // => real(50)
 * ```
 *
 * @example Complex multiplication
 * ```ts
 * const result = multipy(complex(2, 3), complex(3, 4))
 * // => complex(-6, 17)
 * ```
 *
 * @example Complex-coercion
 * ```ts
 * const result = multiply(real(5), complex(1, 2))
 * // => complex(5, 10)
 * ```
 */
export const multiply: BinaryFn<Multiplication> = binary(Multiplication)(
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [boolean(l.raw && r.raw), Action.Application],
  ),
  when([isComplexInfinity, _], [ComplexInfinity, Action.Absorption]),
  when([_, isComplexInfinity], [ComplexInfinity, Action.Absorption]),
  when(
    [is(Complex, isReal), is(Complex, isImaginary)],
    (r, c) => [complex(0, r.raw.a * c.raw.b), Action.Application],
  ),
  when(
    [is(Complex, isImaginary), is(Complex, isReal)],
    (c, r) => [complex(0, c.raw.b * r.raw.a), Action.Application],
  ),
  when(
    [is(Complex), is(Complex)],
    (l, r) => [
      complex(
        (l.raw.a * r.raw.a) - (l.raw.b * r.raw.b),
        (l.raw.a * r.raw.b) + (l.raw.b * r.raw.a),
      ),
      Action.Application,
    ],
  ),
  when(
    [is(Real), is(Real)],
    (l, r) => [real(l.raw * r.raw), Action.Application],
  ),
);

/**
 * Creates {@link Multiplication} AST nodes.
 *
 * This function is derived from {@link multiply}, partially
 * evaluating the latter by binding its left-input to `real(2)`.
 *
 * This function will behave mostly analogously to a unary
 * function (but please refer to {@link PartialBinaryFn} for
 * type behavior), in that it accepts a single input which
 * will always be multiplied by 2.
 */
export const double: PartialBinaryFn<
  Multiplication,
  Real
> = partialLeft(multiply, real(2));
