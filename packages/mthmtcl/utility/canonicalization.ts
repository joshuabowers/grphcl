import {
  Addition,
  Division,
  Exponentiation,
  Negation,
  Real,
  Subtraction,
  type TreeNode,
} from "../tree/mod.ts";
import { method, type Multi, multi } from "@arrows/multimethod";
import {
  Action,
  is,
  type Predicate,
  type Rewrite,
} from "../factories/factory.ts";
import { isBelowThreshold } from "./isBelowThreshold.ts";
import { real } from "../functions/real.ts";
import { negate } from "../functions/negate.ts";

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

export const when = <T extends TreeNode>(
  predicate: Predicate<T>,
  rewrite: TreeNode | ((expression: T) => TreeNode),
) => method(predicate, unwrap(categorize(rewrite)));

const round = (value: number, precision: number) => {
  if (precision === 0) return Math.round(value);
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const canonicalize: ExpressionFn = multi(
  method((e: TreeNode) => e),
  when(is(Real), (e) => new Real(round(e.raw, 15))),
  when(
    is(Exponentiation, (e) => isBelowThreshold(0)(e.right)),
    (e) => new Division(real(1), e.left),
  ),
  when(
    is(Addition, (e) => isBelowThreshold(0)(e.right)),
    (e) => new Subtraction(e.left, negate(e.right)),
  ),
  when(
    is(Addition, (e) => is(Negation)(e.left)),
    (e) => new Subtraction(e.right, negate(e.left)),
  ),
  when(
    is(Addition, (e) => is(Negation)(e.right)),
    (e) => new Subtraction(e.left, negate(e.right)),
  ),
);
