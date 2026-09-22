import { _ } from "@arrows/multimethod";
import {
  Boolean,
  Complex,
  Division,
  Exponentiation,
  Multiplication,
  Numeric,
  Real,
  TreeNode,
} from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialLeft,
  rearrange,
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
import { deepEquals } from "../utility/deepEquals.ts";
import { $add } from "./add.ts";
import { raise, reciprocal, square } from "./raise.ts";
import { isNegativeOne, isOne, isZero } from "../utility/integers.ts";
import { monolex } from "../utility/monolex.ts";
import { canonicalizeFrom } from "../utility/canonicalization.ts";

/**
 * Internal implementation of {@link multiply}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $multiply: BinaryFn<Multiplication> = binary(Multiplication)(
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
  when(
    (l, r) => monolex(l, r) > 0,
    (l, r) => [$multiply(r, l), Action.Commutation],
  ),
  when(
    [is(Numeric, isZero), _],
    (l, _r) => [l, Action.Annihilator],
  ),
  when(
    [is(Numeric, isOne), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    deepEquals,
    (l, _r) => [square(l), Action.Idempotency],
  ),
  when<Exponentiation, Exponentiation>(
    (l, r) =>
      is(Exponentiation)(l) &&
      is(Exponentiation)(r) &&
      deepEquals(l.left, r.left),
    (l, r) => [
      raise(l.left, $add(l.right, r.right)),
      Action.Absorption,
    ],
  ),
  when<Exponentiation, TreeNode>(
    (l, r) => is(Exponentiation)(l) && deepEquals(l.left, r),
    (l, r) => [
      raise(r, $add(l.right, real(1))),
      Action.Absorption,
    ],
  ),
  when<TreeNode, Exponentiation>(
    (l, r) => is(Exponentiation)(r) && deepEquals(l, r.left),
    (l, r) => [
      raise(l, $add(r.right, real(1))),
      Action.Absorption,
    ],
  ),
  when(
    [
      is(Exponentiation, (e) =>
        !is(Multiplication)(e.left) &&
        isNegativeOne(e.right)),
      is(TreeNode, (e) =>
        !(e instanceof Exponentiation) &&
        !(e instanceof Multiplication)),
    ],
    (l, r) => [
      new Division(r, l.left),
      Action.Conversion,
    ],
  ),
  when(
    [is(Division), is(Division)],
    (l, r) => [
      $multiply(
        $multiply(l.left, r.left),
        reciprocal($multiply(l.right, r.right)),
      ),
      Action.Absorption,
    ],
  ),
  when(
    [is(Division), _],
    (l, r) => [
      $multiply(
        $multiply(l.left, r),
        reciprocal(l.right),
      ),
      Action.Absorption,
    ],
  ),
  when(
    [_, is(Division)],
    (l, r) => [
      $multiply(
        $multiply(l, r.left),
        reciprocal(r.right),
      ),
      Action.Absorption,
    ],
  ),
  rearrange(Multiplication, () => $multiply, monolex),
);

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
export const multiply: BinaryFn<Multiplication> = canonicalizeFrom($multiply);

/**
 * Internal implementation of {@link double}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $double: PartialBinaryFn<
  Multiplication,
  Real
> = partialLeft($multiply, real(2));

/**
 * Creates {@link Multiplication} AST nodes.
 *
 * This function is derived from {@link $multiply}, partially
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
> = canonicalizeFrom($double);
