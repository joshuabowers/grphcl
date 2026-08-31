import { TreeNode } from "./treeNode.ts";
import type { Variable } from "./variable.ts";
import type { Real } from "./types/real.ts";

/**
 * Represents derivative expressions within the AST.
 *
 * Derivatives, from calculus, describe a function which,
 * when evaluated, expresses the tangent of the function they
 * are calculated off of at the same point. They are
 * meta-functional.
 *
 * @example
 * ```ts
 * const derivative = new Differentiation(
 *   new Exponentiation(
 *     new Variable('x'),
 *     new Real(2)
 *   ),
 *   new Real(1),
 *   new Variable('x')
 * ); // == [d/dx(x ** 2)] == [2 * x]
 * ```
 */
export class Differentiation extends TreeNode {
  /** The expression to find a derivative of */
  readonly expression: TreeNode;
  /**
   * The order of the derivative to return
   *
   * NB: this currently should be restricted to the
   * positive integers; it represents performing repeated
   * differentiation.
   *
   * 1 is the first derivative; 2 the second derivative, etc.
   */
  readonly order: Real;
  /**
   * The variable within {@link expression} to differentiate
   * with respect to.
   *
   * Should this be undefined/null, the differentiation will
   * be total in a multi-variate context.
   */
  readonly wrt?: Variable;

  /**
   * Creates a new Differentiation node within the AST
   * @param expression the expression to find a derivative of
   * @param order the order of the derivative;
   * @param wrt the variable to differentiate with respect to
   */
  constructor(expression: TreeNode, order: Real, wrt?: Variable) {
    super();
    this.expression = expression;
    this.order = order;
    this.wrt = wrt;
  }
}
