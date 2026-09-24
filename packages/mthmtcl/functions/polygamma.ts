import { Numeric, Polygamma, type Real, type TreeNode } from "../tree/mod.ts";
import {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialLeft,
  when,
} from "../factories/binary.ts";
import { Action, is } from "../factories/factory.ts";
import { $real, real } from "./real.ts";
import { variable } from "./variable.ts";
import { $add } from "./add.ts";
import { $subtract } from "./subtract.ts";
import { $double, $multiply } from "./multiply.ts";
import { $divide } from "./divide.ts";
import { $raise, $reciprocal } from "./raise.ts";
import { $ln } from "./log.ts";
import { $factorial } from "./factorial.ts";
import { $cot } from "./trigonometric.ts";
import { $differentiate } from "./differentiation.ts";
import { $invoke } from "./invocation.ts";
import { isZero } from "../utility/integers.ts";
import { isBelowThreshold } from "../utility/isBelowThreshold.ts";
import { canonicalizeFrom } from "../utility/canonicalization.ts";

const bernoulli = [
  1 / 6,
  -1 / 30,
  1 / 42,
  -1 / 30,
  5 / 66,
  -691 / 2730,
  7 / 6,
  -3617 / 510,
  43867 / 798,
  -174611 / 330,
  854513 / 138,
  -236364091 / 2730,
  8553103 / 6,
  -23749461029 / 870,
  8615841276005 / 14322,
].map((b, i) => [$real(b), $real(2 * (i + 1))]);

const pi = $real(Math.PI);

const sum = (fn: (b: Real, k: Real) => TreeNode) =>
  bernoulli.map(
    ([b, i]) => fn(b, i),
  ).reduce((p, c) => $add(p, c), $real(0));

/**
 * Internal implementation of {@link polygamma}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $polygamma: BinaryFn<Polygamma> = binary(Polygamma)(
  // NB: order matters: Digamma before Polygamma,
  //     Reflection before Recurrence before Calculation
  when( // Digamma Reflection
    [is(Numeric, isZero), is(Numeric, isBelowThreshold(0))],
    (_l, r) => [
      $subtract(
        $digamma($subtract($real(1), r)),
        $multiply(pi, $cot($multiply(pi, r))),
      ),
      Action.Reflection,
    ],
  ),
  when( // Digamma Recurrence
    [is(Numeric, isZero), is(Numeric, isBelowThreshold(10))],
    (_l, r) => [
      $subtract(
        $digamma($add(r, real(1))),
        $reciprocal(r),
      ),
      Action.Recursion,
    ],
  ),
  when( // Digamma
    [is(Numeric, isZero), is(Numeric)],
    (_l, r) => [
      $subtract(
        $subtract($ln(r), $divide($real(0.5), r)),
        sum(
          (b, k) => $divide(b, $multiply(k, $raise(r, k))),
        ),
      ),
      Action.Application,
    ],
  ),
  when( // Polygamma Reflection
    [is(Numeric), is(Numeric, isBelowThreshold(0))],
    (l, r) => [
      $subtract(
        $multiply(
          $raise($real(-1), l),
          $polygamma(l, $subtract($real(1), r)),
        ),
        $multiply(
          pi,
          $invoke()(
            $differentiate(
              $cot($multiply(pi, variable("x"))),
              real(l),
              variable("x"),
            ),
          )(r),
        ),
      ),
      Action.Reflection,
    ],
  ),
  when( // Polygamma Recurrence
    [is(Numeric), is(Numeric, isBelowThreshold(10))],
    (l, r) => [
      $subtract(
        $polygamma(l, $add(r, real(1))),
        $divide(
          $multiply($raise(real(-1), l), $factorial(l)),
          $raise(r, $add(l, real(1))),
        ),
      ),
      Action.Recursion,
    ],
  ),
  when( // Polygamma
    [is(Numeric), is(Numeric)],
    (l, r) => [
      $add(
        $divide(
          $multiply(
            $multiply(
              $raise($real(-1), $add(l, $real(1))),
              $factorial($subtract(l, $real(1))),
            ),
            $add(l, $double(r)),
          ),
          $double($raise(r, $add(l, $real(1)))),
        ),
        $multiply(
          $raise($real(-1), $add(l, $real(1))),
          sum(
            (b, k) =>
              $divide(
                $multiply(b, $factorial($subtract($add(k, l), $real(1)))),
                $multiply(
                  $raise(r, $add(k, l)),
                  $factorial(k),
                ),
              ),
          ),
        ),
      ),
      Action.Application,
    ],
  ),
);

/**
 * Calculates the {@link Polygamma} (ψ) function, which is
 * interrelated to the derivative of the {@link Gamma} function.
 * The first parameter (bound to {@link BinaryNode}'s `left`)
 * describes the order of the polygamma to calculate; when this
 * order is 0, this will calculate the {@link digamma}. Otherwise,
 * higher values calculate what are, at least partially, the
 * derivative of the next successive order polygamma.
 */
export const polygamma: BinaryFn<Polygamma> = canonicalizeFrom($polygamma);

/**
 * Internal implementation of {@link digamma}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $digamma: PartialBinaryFn<
  Polygamma,
  Real
> = partialLeft($polygamma, $real(0));

/**
 * Calculates part of the derivative of the {@link Gamma} function.
 * This function is a special edge case of {@link Polygamma}, and,
 * indeed, is equivalent to `polygamma(real(0), expression)` for
 * any arbitrary {@link Treenode} `expression`.
 */
export const digamma: PartialBinaryFn<
  Polygamma,
  Real
> = canonicalizeFrom($digamma);
