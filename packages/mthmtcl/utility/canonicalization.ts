import {
  Addition,
  Complex,
  Division,
  Exponentiation,
  Multiplication,
  Negation,
  Numeric,
  Real,
  Subtraction,
  type TreeNode,
} from "../tree/mod.ts";
import { method, type Multi, multi } from "@arrows/multimethod";
import {
  Action,
  is,
  type MathFn,
  type Predicate,
  type Rewrite,
} from "../factories/factory.ts";
import { compose } from "./composition.ts";
import { isBelowThreshold } from "./isBelowThreshold.ts";
import { type ConstantPredicate, isNegativeOne } from "./integers.ts";

export interface ExpressionFn extends Multi {
  (expression: TreeNode): TreeNode;
}

type RewriteFn<T extends TreeNode> = (expression: T) => Rewrite<TreeNode>;

const unwrap = <T extends TreeNode>(
  rewrite: Rewrite<TreeNode> | RewriteFn<T>,
) =>
(expression: T) =>
  (typeof rewrite === "function" ? rewrite(expression) : rewrite)[0];

const categorize = <T extends TreeNode>(
  rewrite: TreeNode | ((expression: T) => TreeNode),
): Rewrite<TreeNode> | RewriteFn<T> =>
(expression: T) => [
  typeof rewrite === "function" ? rewrite(expression) : rewrite,
  Action.Conversion,
];

const when = <T extends TreeNode>(
  predicate: Predicate<T>,
  rewrite: TreeNode | ((expression: T) => TreeNode),
) => method(predicate, unwrap(categorize(rewrite)));

const round = (value: number, precision: number) => {
  if (precision === 0) return Math.round(value);
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const flip: ConstantPredicate = multi(
  method(is(Real), (e: Real) => new Real(-e.raw)),
  method(
    is(Complex),
    (e: Complex) => new Complex({ a: -e.raw.a, b: -e.raw.b }),
  ),
  method((e: TreeNode) => e),
);

export const canonicalize: ExpressionFn = multi(
  when(is(Real), (e) => new Real(round(e.raw, 15))),
  when(
    is(Exponentiation, (e) => isNegativeOne(e.right)),
    (e) => new Division(new Real(1), canonicalize(e.left)),
  ),
  when(
    is(Addition, (e) => isBelowThreshold(0)(e.right)),
    (e) =>
      new Subtraction(
        canonicalize(e.left),
        canonicalize(flip(e.right)),
      ),
  ),
  when(
    is(Addition, (e) => is(Negation)(e.left)),
    (e) =>
      new Subtraction(
        canonicalize(e.right),
        canonicalize((e.left as Negation).child),
      ),
  ),
  when(
    is(Addition, (e) => is(Negation)(e.right)),
    (e) =>
      new Subtraction(
        canonicalize(e.left),
        canonicalize((e.right as Negation).child),
      ),
  ),
  when(
    is(Multiplication, (e) =>
      is(Exponentiation)(e.left) &&
      is(Numeric, isNegativeOne)(e.left.right) &&
      !is(Exponentiation, (f) => is(Numeric, isNegativeOne)(f.right))(e.right)),
    (e) =>
      new Division(
        canonicalize(e.right),
        canonicalize((e.left as Exponentiation).left),
      ),
  ),
  when(
    is(Multiplication, (e) =>
      is(Exponentiation)(e.right) &&
      is(Numeric, isNegativeOne)(e.right.right) &&
      !is(Exponentiation, (f) => is(Numeric, isNegativeOne)(f.right))(e.left)),
    (e) =>
      new Division(
        canonicalize(e.left),
        canonicalize((e.right as Exponentiation).left),
      ),
  ),
  when(is(Negation), (e) => new Negation(canonicalize(e.child))),
  method((e: TreeNode) => e),
);

export const canonicalizeFrom = <
  T extends TreeNode,
  Fn extends MathFn<T>,
>(fn: Fn): Fn => compose(fn, canonicalize);
