import {
  Absolute,
  Addition,
  Arcus,
  AreaHyperbolic,
  type Differentiation,
  Division,
  Exponentiation,
  Hyperbolic,
  Logarithm,
  Multiplication,
  Negation,
  Numeric,
  type Real,
  Subtraction,
  type TreeNode,
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
import { real } from "./real.ts";
import { preserve } from "./preserve.ts";
import { $add } from "./add.ts";
import { $subtract } from "./subtract.ts";
import { $multiply } from "./multiply.ts";
import { $divide } from "./divide.ts";
import { $raise, $reciprocal, $sqrt, $square } from "./raise.ts";
import { $negate } from "./negate.ts";
import { $abs } from "./absolute.ts";
import { $ln } from "./log.ts";
import { cos, cot, csc, sec, sin, tan } from "./trigonometric.ts";
import { $cosh, $coth, $csch, $sech, $sinh, $tanh } from "./hyperbolic.ts";
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
  extends MathFn<Differentiation, [TreeNode, Real, Variable]> {
  (expression: Variable): Real;
  (expression: TreeNode): TreeNode;
}

export const $differentiate: DifferentiateFn = multi(
  when(is(Numeric), (e) => [preserve(e, real(0)), Action.Application]),
  when(is(Variable), [real(1), Action.Application]),
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
      $raise(e.right, real(2)),
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
    chain((e) => $negate(sin(e.child))),
  ),
  when(
    is(Trigonometric.Cotangent),
    chain((e) => $negate($square(csc(e.child)))),
  ),
  when(
    is(Trigonometric.Cosecant),
    chain((e) =>
      $multiply(
        $negate(csc(e.child)),
        cot(e.child),
      )
    ),
  ),
  when(
    is(Trigonometric.Secant),
    chain((e) => $multiply(sec(e.child), tan(e.child))),
  ),
  when(
    is(Trigonometric.Sine),
    chain((e) => cos(e.child)),
  ),
  when(
    is(Trigonometric.Tangent),
    chain((e) => $square(sec(e.child))),
  ),
  when(
    is(Arcus.Cosine),
    chain((e) =>
      $negate($divide(
        $differentiate(e.child),
        $sqrt($subtract(real(1), $square(e.child))),
      ))
    ),
  ),
  when(
    is(Arcus.Cotangent),
    chain((e) => $negate($reciprocal($add($square(e.child), real(1))))),
  ),
  when(
    is(Arcus.Cosecant),
    chain((e) =>
      $negate(
        $reciprocal($multiply(
          $abs(e.child),
          $sqrt($subtract($square(e.child), real(1))),
        )),
      )
    ),
  ),
  when(
    is(Arcus.Secant),
    chain((e) =>
      $reciprocal($multiply(
        $abs(e.child),
        $sqrt($subtract($square(e.child), real(1))),
      ))
    ),
  ),
  when(
    is(Arcus.Sine),
    chain((e) => $reciprocal($sqrt($subtract(real(1), $square(e.child))))),
  ),
  when(
    is(Arcus.Tangent),
    chain((e) => $reciprocal($add(real(1), $square(e.child)))),
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
    chain((e) => $reciprocal($sqrt($subtract($square(e.child), real(1))))),
  ),
  when(
    is(AreaHyperbolic.Cotangent),
    chain((e) => $reciprocal($subtract(real(1), $square(e.child)))),
  ),
  when(
    is(AreaHyperbolic.Cosecant),
    chain((e) =>
      $negate($reciprocal($multiply(
        $abs(e.child),
        $sqrt($add(real(1), $square(e.child))),
      )))
    ),
  ),
  when(
    is(AreaHyperbolic.Secant),
    chain((e) =>
      $negate(
        $reciprocal($multiply(
          e.child,
          $sqrt($subtract(real(1), $square(e.child))),
        )),
      )
    ),
  ),
  when(
    is(AreaHyperbolic.Sine),
    chain((e) => $reciprocal($sqrt($add(real(1), $square(e.child))))),
  ),
  when(
    is(AreaHyperbolic.Tangent),
    chain((e) => $reciprocal($subtract(real(1), $square(e.child)))),
  ),
);

export const differentiate: DifferentiateFn = canonicalizeFrom($differentiate);
