// NB: Possibly change this to "asymptotic.ts" during the great
//     1.0 renaming.
import {
  Addition,
  type BinaryNode,
  Direction,
  Division,
  Exponentiation,
  Limit,
  Logarithm,
  Multiplication,
  Numeric,
  Real,
  Subtraction,
  type TreeNode,
  Trigonometric,
  type UnaryNode,
  Variable,
} from "../tree/mod.ts";
import { _, method, multi } from "@arrows/multimethod";
import {
  Action,
  type Constructor,
  is,
  type MathFn,
  type Predicate,
  type Rewrite,
} from "../factories/factory.ts";
import type { BinaryFn } from "../factories/binary.ts";
import type { UnaryFn } from "../factories/unary.ts";
import { $real, real } from "./real.ts";
import { isInteger, isNegative, isOne, isZero } from "../utility/integers.ts";
import { scope } from "./variable.ts";
import { $add, add } from "./add.ts";
import { $subtract, subtract } from "./subtract.ts";
import { $invoke } from "./invocation.ts";
import { $multiply } from "./multiply.ts";
import { $divide, divide } from "./divide.ts";
import { $raise, $reciprocal, $square, reciprocal, square } from "./raise.ts";
import { $ln, $log, ln } from "./log.ts";
import { $cos, $sin, $tan, cos } from "./trigonometric.ts";
import { parameterize } from "../utility/parameterization.ts";
import { deepEquals } from "../utility/deepEquals.ts";
import { canonicalizeFrom } from "../utility/canonicalization.ts";

export { Direction };

type Guards<T extends TreeNode, N extends Numeric> = [
  Predicate<T>,
  Predicate<Variable> | typeof _,
  Predicate<N> | typeof _ | N,
  Predicate<Direction> | typeof _ | Direction,
] | ((e: T, v: Variable, n: N, d: Direction) => boolean);

type RewriteFn<T extends TreeNode, N extends Numeric> = (
  expression: T,
  variable: Variable,
  value: N,
  direction: Direction,
) => Rewrite<TreeNode>;

const unwrap = <T extends TreeNode, N extends Numeric>(
  rewrite: Rewrite<T> | RewriteFn<T, N>,
) =>
(t: T, v: Variable, n: N, d: Direction) =>
  (typeof rewrite === "function" ? rewrite(t, v, n, d) : rewrite)[0];

const when = <T extends TreeNode, N extends Numeric>(
  predicate: Guards<T, N>,
  rewrite: Rewrite<T> | RewriteFn<T, N>,
) => method(predicate, unwrap(rewrite));

const any = <T extends TreeNode, N extends Numeric>(
  ctor: Constructor<T>,
): Guards<T, N> => [is(ctor), _, _, _];

const binary = <B extends BinaryNode, N extends Numeric>(
  fn: BinaryFn<B>,
): RewriteFn<B, N> =>
(e, v, n, d): Rewrite<TreeNode> => [
  fn($limit(e.left, v, n, d), $limit(e.right, v, n, d)),
  Action.Delegation,
];

const unary = <U extends UnaryNode, N extends Numeric>(
  fn: UnaryFn<U>,
): RewriteFn<U, N> =>
(e, v, n, d): Rewrite<TreeNode> => [
  fn($limit(e.child, v, n, d)),
  Action.Delegation,
];

const pattern = <T extends TreeNode, N extends Numeric>(
  expected: (v: Variable) => T,
  value: N | ((n: N) => boolean) | typeof _ = _,
  direction: Direction = Direction.Both,
) =>
(e: T, v: Variable, n: N, d: Direction) => {
  // console.log("pattern:");
  // console.log({ e, v, n, d });
  // console.log("expected(v)", expected(v));
  return (
    parameterize(e).has(v.name) &&
    (
      typeof value === "symbol" ||
      (typeof value === "function" ? value(n) : deepEquals(value, n))
    ) &&
    (direction === Direction.Both || direction === d) &&
    deepEquals(expected(v), e)
  );
};

export interface LimitFn extends
  MathFn<Limit, [
    TreeNode,
    Variable,
    Numeric,
    Direction,
  ]> {}

/**
 * Internal implementation of {@link limit}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $limit: LimitFn = multi(
  //   (e: TreeNode, v: Variable, n: Numeric, d: Direction) => {
  //     console.log({ e, v, n, d });
  //     return [e, v, n, d];
  //   },
  when([is(Numeric), _, _, _], (e) => [e, Action.Degeneracy]),
  when([is(Variable), _, _, _], (e, v, n) => [
    $invoke(scope([[v.name, n]]))(e)(),
    Action.Identity,
  ]),
  when(any(Addition), binary($add)),
  when(any(Subtraction), binary($subtract)),
  when(
    pattern((v) => $multiply(v, $ln(v)), real(0)),
    [real(0), Action.Annihilator],
  ),
  when( // This is for uncanonicalized inputs
    pattern(
      (v) => $multiply($ln(v), $raise($subtract(v, real(1)), real(-1))),
      real(1),
    ),
    [real(1), Action.Annihilator],
  ),
  when( // Not-canonicalized (i.e. v ** -1)
    pattern((v) => $multiply(v, $sin($reciprocal(v))), real(Infinity)),
    [real(1), Action.Annihilator],
  ),
  when( // Canonicalized (i.e. 1 / v)
    pattern((v) => $multiply(v, $sin(reciprocal(v))), real(Infinity)),
    [real(1), Action.Annihilator],
  ),
  when(any(Multiplication), binary($multiply)),
  // NB: This edge case might never actually trip, due to the
  //     order in which subtrees are evaluated wrt their parents.
  when<TreeNode, Numeric>([
    is(Division, (d) => is(Numeric, isZero)(d.right)),
    _,
    real(Infinity),
    _,
  ], [
    $real(NaN),
    Action.Annihilator,
  ]),
  when(
    pattern((v) => $divide($ln(v), v), real(Infinity)),
    [real(0), Action.Annihilator],
  ),
  when( // This is for canonicalized inputs
    pattern((v) => divide(ln(v), subtract(v, real(1))), real(1)),
    [real(1), Action.Annihilator],
  ),
  when(
    pattern((v) => divide(ln(add(v, real(1))), v), real(0)),
    [real(1), Action.Annihilator],
  ),
  when(
    pattern((v) => $divide($sin(v), v), real(0)),
    [real(1), Action.Annihilator],
  ),
  when(
    pattern((v) => $divide($subtract($cos(v), real(1)), v), real(0)),
    [real(0), Action.Annihilator],
  ),
  when(
    pattern((v) => divide(subtract(cos(v), real(1)), v), real(0)),
    [real(0), Action.Annihilator],
  ),
  when(
    pattern((v) => $divide($subtract(real(1), $cos(v)), v), real(0)),
    [real(0), Action.Annihilator],
  ),
  when(
    pattern((v) => divide(subtract(real(1), cos(v)), v), real(0)),
    [real(0), Action.Annihilator],
  ),
  when(
    pattern((v) => $divide($subtract(real(1), $cos(v)), $square(v)), real(0)),
    [real(0.5), Action.Annihilator],
  ),
  when(
    pattern((v) => divide(subtract(real(1), cos(v)), square(v)), real(0)),
    [real(0.5), Action.Annihilator],
  ),
  when(
    pattern((v) => $divide($tan(v), v), real(0)),
    [real(1), Action.Annihilator],
  ),
  when(any(Division), binary($divide)),
  when<TreeNode, Numeric>([
    is(Exponentiation, (e) => is(Real, (r) => r.raw % 2 !== 0)(e.right)),
    _,
    real(0),
    Direction.Left,
  ], [
    real(-Infinity),
    Action.Annihilator,
  ]),
  // NB: Not sure this passes the smell test. Also, it definitely
  //     is not verifying the d.right variable is the variable being
  //     asymptotically evaluated.
  // NB: This *could* probably be rewritten with `pattern`, but
  //     would require being able to represent *any* negative number
  //     in a way which (a) is composable within a TreeNode structure
  //     and (b) compatible with deepEquals.
  //     Utility subclass of Numeric, perhaps?
  //     Other potential edge cases would likely need *any* numeric,
  //     *any positive* numeric, etc.
  when<TreeNode, Numeric>([
    is(Exponentiation, (e) => (
      is(Real, isNegative)(e.left) &&
      is(Division, (d) => (
        isOne(d.left), is(Variable)(d.right)
      ))(e.right)
    )),
    _,
    real(Infinity),
    Direction.Both,
  ], [real(NaN), Action.Annihilator]),
  when(any(Exponentiation), binary($raise)),
  when(any(Logarithm), binary($log)),
  when(any(Trigonometric.Cosine), unary($cos)),
  when(any(Trigonometric.Sine), unary($sin)),
  when( // This, and its mirror, are interesting, but probably not useful.
    pattern<TreeNode, Numeric>(
      (v) =>
        $tan(
          $add(
            $multiply(real(Math.PI), v),
            real(Math.PI / 2),
          ),
        ),
      isInteger(),
      Direction.Left,
    ),
    [real(Infinity), Action.Annihilator],
  ),
  when(
    pattern<TreeNode, Numeric>(
      (v) =>
        $tan(
          $add(
            $multiply(real(Math.PI), v),
            real(Math.PI / 2),
          ),
        ),
      isInteger(),
      Direction.Right,
    ),
    [real(-Infinity), Action.Annihilator],
  ),
  when(any(Trigonometric.Tangent), unary($tan)),
  method((e: TreeNode, v: Variable, n: Numeric, d: Direction) =>
    [
      new Limit(v, n, d, e),
      Action.Creation,
    ][0]
  ), // TODO: Fix this! This should be for logging purporses.
  // I.E., for future me who is BLIND: the unwrap returning [0] above.
);

/**
 * Calculates the limit of a provided expression as a variable
 * defined within it approaches a supplied value from a given
 * direction.
 *
 * This is a function which takes four separate parameters, some
 * of which might be irrelevant depending upon the expression
 * being evaluated:
 *
 * @param expression a {@link TreeNode} to find the limit of
 * @param variable the variable within {@link expression} which is trending towards {@link target}
 * @param target the value {@link variable} is trending towards
 * @param direction the side of {@link target} towards which {@link variable} is trending.
 *
 * NB: Unless otherwise specified within the source, most of the
 * limits provided by this function are adapted from the
 * {@link https://en.wikipedia.org/w/index.php?title=List_of_limits&oldid=1381165095 | list of limits} maintained
 * on Wikipedia. The list maintained by wikipedia is non-exhaustive,
 * so there might very well be aberrant behavior in this function.
 *
 * As a further note, limits are mostly found utilizing a very
 * minimal set of structural rules combined with an effective table
 * of known patterns; this differs, perhaps, from a more brute-forced
 * approach of calculating the value of the expression as it moves
 * closer to the target. This approach works, but suffers from paucity:
 * if a rule isn't defined within its table of known patterns, it
 * obviously cannot be matched. Please submit either an issue for
 * missing limits or a PR if you have a better methodology.
 */
export const limit: LimitFn = canonicalizeFrom($limit);
