import {
  Addition,
  Exponentiation,
  Multiplication,
  type TreeNode,
  UnaryNode,
  Variable,
} from "../tree/mod.ts";
import { is } from "../factories/factory.ts";
import type { Guards } from "../factories/binary.ts";
import { _, method, type Multi, multi } from "@arrows/multimethod";
import { degree } from "../functions/degree.ts";

const when = <Left extends TreeNode, Right extends TreeNode>(
  predicate: Guards<Left, Right>,
  rewrite: ((left: Left, right: Right) => number) | number,
): typeof method =>
  method(
    predicate,
    rewrite,
  );

export interface GrevlexFn extends Multi {
  (left: TreeNode, right: TreeNode): number;
}

const deglex: GrevlexFn = multi(
  when([is(Variable), is(Variable)], (l, r) => l.name.localeCompare(r.name)),
  when([is(Variable), is(Exponentiation)], (l, r) => {
    const c = deglex(l, r.left);
    return c !== 0 ? c : (1 - degree(r).raw);
  }),
  when([is(Exponentiation), is(Variable)], (l, r) => {
    const c = deglex(l.left, r);
    return c !== 0 ? c : (degree(l).raw - 1);
  }),
  when([is(Exponentiation), is(Exponentiation)], (l, r) => {
    const c = deglex(l.left, r.left);
    return c !== 0 ? c : (degree(l).raw - degree(r).raw);
  }),
  when([_, is(Addition)], NaN),
  when([is(Addition), _], NaN),
  when([_, is(UnaryNode)], -1),
  when([is(UnaryNode), _], 1),
);

export function* terms(monomial: TreeNode): Generator<TreeNode> {
  if (is(Variable)(monomial)) {
    yield monomial;
  } else if (is(Multiplication)(monomial)) {
    yield* terms(monomial.left);
    yield* terms(monomial.right);
  } else if (is(Exponentiation, (e) => is(Variable)(e.left))(monomial)) {
    yield monomial;
  } else if (is(Addition)(monomial)) {
    yield monomial;
  } else if (is(UnaryNode)(monomial)) {
    yield monomial;
  }
}

/**
 * A comparator which (hopefully) implements a graded reverse
 * lexicographic ordering of two {@link TreeNode}s.
 *
 * While this will evaluate non-monomials, (e.g. a unary
 * function), anything that is non-standard for a polynomial
 * will compare positive, indicated a rightward sort.
 *
 * This should, generally, resort in a total ordering,
 * with tie-breakers evaluating lexicograhically on a reversal
 * of the variable names, then by order on individual terms.
 *
 * Thus:
 *
 * @example Given: [xy, x ** 2] => 1
 * ```ts
 * const result = grevlex(
 *   multiply(variable('x'), variable('y')),
 *   square(variable('x'))
 * ) // => 1
 * ```
 *
 * @example Given [xy, y ** 2] => -1
 * @param left the left tree to compare
 * @param right the right tree to compare
 * @returns a comparison value indicated the ordering
 */
export const grevlex = (left: TreeNode, right: TreeNode): number => {
  const lDegree = degree(left).raw;
  const rDegree = degree(right).raw;
  const degreeComp = rDegree - lDegree;

  if (degreeComp !== 0) return degreeComp;
  const lTerms = [...terms(left)];
  const rTerms = [...terms(right)];

  for (let i = -1; i >= -lTerms.length; i--) {
    const l = lTerms.at(i), r = rTerms.at(i);
    const c = !l ? 1 : !r ? -1 : deglex(l, r);
    if (Number.isNaN(c)) return 0;
    else if (c !== 0) return c;
  }

  return 0;
};
