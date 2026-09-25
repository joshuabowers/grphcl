import {
  Absolute,
  Addition,
  Arcus,
  AreaHyperbolic,
  type Differentiation,
  Division,
  Exponentiation,
  Factorial,
  Gamma,
  Hyperbolic,
  Logarithm,
  Multiplication,
  Negation,
  Numeric,
  Polygamma,
  Real,
  Subtraction,
  TreeNode,
  Trigonometric,
  type UnaryNode,
  Variable,
} from "../tree/mod.ts";
import {
  Action,
  is,
  type MathFn,
  type Predicate,
  type Rewrite,
} from "../factories/factory.ts";
import { method, multi } from "@arrows/multimethod";
import { $real } from "./real.ts";
import { preserve } from "./preserve.ts";
import { $add } from "./add.ts";
import { $subtract } from "./subtract.ts";
import { $multiply } from "./multiply.ts";
import { $divide } from "./divide.ts";
import { $raise, $reciprocal, $sqrt, $square } from "./raise.ts";
import { $negate } from "./negate.ts";
import { $abs } from "./absolute.ts";
import { $ln } from "./log.ts";
import { $cos, $cot, $csc, $sec, $sin, $tan } from "./trigonometric.ts";
import { $cosh, $coth, $csch, $sech, $sinh, $tanh } from "./hyperbolic.ts";
import { $digamma, $polygamma } from "./polygamma.ts";
import { canonicalizeFrom } from "../utility/canonicalization.ts";

type RewriteRule<T> =
  | Rewrite<TreeNode>
  | ((expression: T) => Rewrite<TreeNode>);

const unwrap = <T>(rewrite: RewriteRule<T>) => (t: T) =>
  (typeof rewrite === "function" ? rewrite(t) : rewrite)[0];

const when = <T>(
  predicate: Predicate<T>,
  rewrite: RewriteRule<T>,
) => method(predicate, unwrap(rewrite));

const chain = <U extends UnaryNode>(
  derivativeFor: (expression: U) => TreeNode,
) =>
(expression: U): Rewrite<TreeNode> => [
  $multiply(
    derivativeFor(expression),
    $differentiate(expression.child),
  ),
  Action.Application,
];

interface DifferentiateFn
  extends MathFn<Differentiation, [TreeNode, Real?, Variable?]> {
  (expression: Variable): Real;
  (expression: TreeNode): TreeNode;
}

/**
 * Internal implementation of {@link differentiate}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $differentiate: DifferentiateFn = multi(
  method(
    [is(TreeNode), is(Real), is(Variable)],
    (expression: TreeNode, order: Real, _wrt: Variable) =>
      [
        Array.from({ length: order.raw })
          .reduce((prev: TreeNode) => differentiate(prev), expression),
        Action.Recursion,
      ][0],
  ),
  when(is(Numeric), (e) => [preserve(e, $real(0)), Action.Application]),
  when(is(Variable), [$real(1), Action.Application]),
  when(is(Addition), (e) => [
    $add($differentiate(e.left), $differentiate(e.right)),
    Action.Application,
  ]),
  when(is(Subtraction), (e) => [
    $subtract($differentiate(e.left), $differentiate(e.right)),
    Action.Application,
  ]),
  when(is(Multiplication), (e) => [
    $add(
      $multiply(e.left, $differentiate(e.right)),
      $multiply($differentiate(e.left), e.right),
    ),
    Action.Application,
  ]),
  when(is(Division), (e) => [
    $divide(
      $subtract(
        $multiply($differentiate(e.left), e.right),
        $multiply(e.left, $differentiate(e.right)),
      ),
      $raise(e.right, $real(2)),
    ),
    Action.Application,
  ]),
  when(is(Negation), (e) => [
    $negate($differentiate(e.child)),
    Action.Application,
  ]),
  when(is(Exponentiation), (e) => [
    $multiply(
      e,
      $add(
        $multiply($differentiate(e.left), $divide(e.right, e.left)),
        $multiply($differentiate(e.right), $ln(e.left)),
      ),
    ),
    Action.Application,
  ]),
  when(is(Logarithm), (e) => [
    $divide(
      $differentiate(e.right),
      $multiply(e.right, $ln(e.left)),
    ),
    Action.Application,
  ]),
  when(is(Absolute), chain((e) => $divide(e.child, e))),
  when(
    is(Trigonometric.Cosine),
    chain((e) => $negate($sin(e.child))),
  ),
  when(
    is(Trigonometric.Cotangent),
    chain((e) => $negate($square($csc(e.child)))),
  ),
  when(
    is(Trigonometric.Cosecant),
    chain((e) =>
      $multiply(
        $negate($csc(e.child)),
        $cot(e.child),
      )
    ),
  ),
  when(
    is(Trigonometric.Secant),
    chain((e) => $multiply($sec(e.child), $tan(e.child))),
  ),
  when(
    is(Trigonometric.Sine),
    chain((e) => $cos(e.child)),
  ),
  when(
    is(Trigonometric.Tangent),
    chain((e) => $square($sec(e.child))),
  ),
  when(
    is(Arcus.Cosine),
    chain((e) =>
      $negate($divide(
        $differentiate(e.child),
        $sqrt($subtract($real(1), $square(e.child))),
      ))
    ),
  ),
  when(
    is(Arcus.Cotangent),
    chain((e) => $negate($reciprocal($add($square(e.child), $real(1))))),
  ),
  when(
    is(Arcus.Cosecant),
    chain((e) =>
      $negate(
        $reciprocal($multiply(
          $abs(e.child),
          $sqrt($subtract($square(e.child), $real(1))),
        )),
      )
    ),
  ),
  when(
    is(Arcus.Secant),
    chain((e) =>
      $reciprocal($multiply(
        $abs(e.child),
        $sqrt($subtract($square(e.child), $real(1))),
      ))
    ),
  ),
  when(
    is(Arcus.Sine),
    chain((e) => $reciprocal($sqrt($subtract($real(1), $square(e.child))))),
  ),
  when(
    is(Arcus.Tangent),
    chain((e) => $reciprocal($add($real(1), $square(e.child)))),
  ),
  when(
    is(Hyperbolic.Cosine),
    chain((e) => $sinh(e.child)),
  ),
  when(
    is(Hyperbolic.Cotangent),
    chain((e) => $negate($square($csch(e.child)))),
  ),
  when(
    is(Hyperbolic.Cosecant),
    chain((e) =>
      $multiply(
        $negate($coth(e.child)),
        $csch(e.child),
      )
    ),
  ),
  when(
    is(Hyperbolic.Secant),
    chain((e) =>
      $multiply(
        $negate($tanh(e.child)),
        $sech(e.child),
      )
    ),
  ),
  when(
    is(Hyperbolic.Sine),
    chain((e) => $cosh(e.child)),
  ),
  when(
    is(Hyperbolic.Tangent),
    chain((e) => $square($sech(e.child))),
  ),
  when(
    is(AreaHyperbolic.Cosine),
    chain((e) => $reciprocal($sqrt($subtract($square(e.child), $real(1))))),
  ),
  when(
    is(AreaHyperbolic.Cotangent),
    chain((e) => $reciprocal($subtract($real(1), $square(e.child)))),
  ),
  when(
    is(AreaHyperbolic.Cosecant),
    chain((e) =>
      $negate($reciprocal($multiply(
        $abs(e.child),
        $sqrt($add($real(1), $square(e.child))),
      )))
    ),
  ),
  when(
    is(AreaHyperbolic.Secant),
    chain((e) =>
      $negate(
        $reciprocal($multiply(
          e.child,
          $sqrt($subtract($real(1), $square(e.child))),
        )),
      )
    ),
  ),
  when(
    is(AreaHyperbolic.Sine),
    chain((e) => $reciprocal($sqrt($add($real(1), $square(e.child))))),
  ),
  when(
    is(AreaHyperbolic.Tangent),
    chain((e) => $reciprocal($subtract($real(1), $square(e.child)))),
  ),
  when(
    is(Factorial),
    chain((e) => $multiply(e, $digamma($add(e.child, $real(1))))),
  ),
  when(
    is(Gamma),
    chain((e) => $multiply(e, $digamma(e.child))),
  ),
  when(
    is(Polygamma),
    (e) => [
      $multiply(
        $polygamma($add(e.left, $real(1)), e.right),
        $differentiate(e.right),
      ),
      Action.Application,
    ],
  ),
  method((expression: TreeNode) => {
    console.log("differentiate: unhandled");
    console.log("=> expression:", expression);
  }),
);

/**
 * Generates a new expression representing the derivative of
 * the expression passed to it.
 *
 * This process is defined on most {@link TreeNode} types, and
 * should be (currently) viable for single-variate use cases.
 *
 * Derivatives are calculated in a recursive fashion, with
 * node-specific rules guiding the process. For most functions,
 * this will result in application of the chain rule: the derivative
 * is the derivative of the function multiplied by the derivative
 * of its argument.
 *
 * For most functions and operators, the return value of this
 * function will be a {@link TreeNode} containing, somewhere
 * within its structure, an indeterminate {@link Variable}.
 *
 * @example Differentiation of an indeterminate function
 * ```ts
 * const result = differentiate(cos(variable('x')))
 * // => negate(sin(variable('x')))
 * ```
 *
 * @example Differentiation of a higher order
 *
 * It is possible to apply `differentiate` to itself, which is
 * the same as taking multiple successive derivatives. However,
 * a second argument to the function allows the specification of
 * the order of the derivative to find:
 *
 * ```ts
 * const d1 = differentiate(differentiate(raise(variable('x'), real(3))))
 * // ~=> 6 * x
 * const d2 = differentiate(raise(variable('x'), real(3)), real(2))
 * // ~=> 6 * x
 * ```
 */
export const differentiate: DifferentiateFn = canonicalizeFrom($differentiate);
