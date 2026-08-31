import { TreeNode } from "./treeNode.ts";
import type { Variable } from "./variable.ts";
import type { Real } from "./types/real.ts";

/**
 * Represents the direction {@link Limit.target} is
 * approached from.
 */
export enum Direction {
  /** From the left */
  Left = 0,
  /** From the right */
  Right,
}

/**
 * Represents limit expressions within the AST.
 *
 * Limits, from calculus, define the value an {@link expression}
 * trends towards as its {@link variable} approaches a
 * {@link target} point from a given {@link direction}.
 *
 * NB: Currently, limits are only defined on {@link Real}-valued
 * single variable expressions; if other variables are present,
 * they will remain unbound, yielding an unbound expression
 * which likely is not meaningful.
 *
 * @example
 * ```ts
 * const value = new Limit(
 *   new Variable('x'),
 *   new Real(Math.PI/2),
 *   Direction.Left,
 *   new Trigonometric.Tangent(new Variable('x'))
 * ); // == Number.POSITIVE_INFINITY
 * ```
 */
export class Limit extends TreeNode {
  /** The variable within {@link expression} to evalute wrt */
  readonly variable: Variable;
  /** The value {@link variable} is approaching */
  readonly target: Real;
  /**
   * The direction {@link variable} is approaching
   * {@link target} from
   */
  readonly direction: Direction;
  /** The expression to evaluate */
  readonly expression: TreeNode;

  /**
   * Creates a Limit node within the AST.
   * @param variable the variable which is approaching a value
   * @param target the value the variable is approaching
   * @param direction the direction of approach
   * @param expression the expression to evaluate
   */
  constructor(
    variable: Variable,
    target: Real,
    direction: Direction,
    expression: TreeNode,
  ) {
    super();
    this.variable = variable;
    this.target = target;
    this.direction = direction;
    this.expression = expression;
  }
}
