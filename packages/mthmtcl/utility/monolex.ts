import {
  Addition,
  Division,
  Exponentiation,
  Numeric,
  Subtraction,
  type TreeNode,
  UnaryNode,
  Variable,
} from "../tree/mod.ts";
import { is } from "../factories/factory.ts";
import type { Guards } from "../factories/binary.ts";
import { _, method, type Multi, multi } from "@arrows/multimethod";

const when = <Left extends TreeNode, Right extends TreeNode>(
  predicate: Guards<Left, Right>,
  rewrite: ((left: Left, right: Right) => number) | number,
): typeof method =>
  method(
    predicate,
    rewrite,
  );

export interface MonolexFn extends Multi {
  (left: TreeNode, right: TreeNode): number;
}

/**
 * Defines a lexicographic sort for terms within a monomial.
 *
 * This will cause numeric values to sort left (as a coefficient),
 * variables to be sorted lexicographically by their names,
 * unary functions to sort right, and exponentials to compare
 * their base against the other parameter.
 *
 * @example
 * ```ts
 * const nodes = [variable('y'), variable('x'), real(10)];
 * const sorted = nodes.sort(monolex);
 * // => [real(10), variable('x'), variable('y')]
 * ```
 */
export const monolex: MonolexFn = multi(
  when([is(Numeric), is(Variable)], -1),
  when([is(Variable), is(Numeric)], 1),
  when(
    [is(Variable), is(Variable)],
    (l, r) => l.name.localeCompare(r.name),
  ),
  when(
    [_, is(Exponentiation)],
    (l, r) => monolex(l, r.left),
  ),
  when(
    [is(Exponentiation), _],
    (l, r) => monolex(l.left, r),
  ),
  when(
    [is(Exponentiation), is(Exponentiation)],
    (l, r) => monolex(l.left, r.left),
  ),
  when([_, is(Addition)], -1),
  when([is(Addition), _], 1),
  when([_, is(Subtraction)], -1),
  when([is(Subtraction), _], 1),
  when([_, is(Division)], -1),
  when([is(Division), _], 1),
  when([_, is(UnaryNode)], -1),
  when([is(UnaryNode), _], 1),
  method(0),
);
