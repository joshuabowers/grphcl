// NB: Possibly change this to "asymptotic.ts" during the great
//     1.0 renaming.
import {
  Addition,
  Direction,
  Division,
  Exponentiation,
  Limit,
  Multiplication,
  Numeric,
  Real,
  Subtraction,
  type TreeNode,
  Variable,
} from "../tree/mod.ts";
import { _, method, multi } from "@arrows/multimethod";
import {
  Action,
  is,
  type MathFn,
  type Predicate,
  type Rewrite,
} from "../factories/factory.ts";
import { $real, real } from "./real.ts";
import { scope } from "./variable.ts";
import { $add } from "./add.ts";
import { $subtract } from "./subtract.ts";
import { $invoke } from "./invocation.ts";
import { $multiply } from "./multiply.ts";
import { $divide } from "./divide.ts";
import { $raise } from "./raise.ts";
import { isZero } from "../utility/integers.ts";
import { canonicalizeFrom } from "../utility/canonicalization.ts";

export { Direction };

type Guards<T extends TreeNode, N extends Numeric> = [
  Predicate<T>,
  Predicate<Variable> | typeof _,
  Predicate<N> | typeof _ | N,
  Predicate<Direction> | typeof _ | Direction,
];
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

export interface LimitFn extends
  MathFn<Limit, [
    TreeNode,
    Variable,
    Numeric,
    Direction,
  ]> {}

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
  when([is(Addition), _, _, _], (e, v, n, d) => [
    $add($limit(e.left, v, n, d), $limit(e.right, v, n, d)),
    Action.Delegation,
  ]),
  when([is(Subtraction), _, _, _], (e, v, n, d) => [
    $subtract($limit(e.left, v, n, d), $limit(e.right, v, n, d)),
    Action.Delegation,
  ]),
  when([is(Multiplication), _, _, _], (e, v, n, d) => [
    $multiply($limit(e.left, v, n, d), $limit(e.right, v, n, d)),
    Action.Delegation,
  ]),
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
  when([is(Division), _, _, _], (e, v, n, d) => [
    $divide($limit(e.left, v, n, d), $limit(e.right, v, n, d)),
    Action.Delegation,
  ]),
  when<TreeNode, Numeric>([
    is(Exponentiation, (e) => is(Real, (r) => r.raw % 2 !== 0)(e.right)),
    _,
    real(0),
    Direction.Left,
  ], [
    real(-Infinity),
    Action.Annihilator,
  ]),
  when([is(Exponentiation), _, _, _], (e, v, n, d) => [
    $raise($limit(e.left, v, n, d), $limit(e.right, v, n, d)),
    Action.Delegation,
  ]),
  method((e: TreeNode, v: Variable, n: Numeric, d: Direction) =>
    [
      new Limit(v, n, d, e),
      Action.Creation,
    ][0]
  ), // TODO: Fix this! This should be for logging purporses.
  // I.E., for future me who is BLIND: the unwrap returning [0] above.
);

export const limit: LimitFn = canonicalizeFrom($limit);
