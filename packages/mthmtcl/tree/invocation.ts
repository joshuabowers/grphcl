import { TreeNode } from "./treeNode.ts";

/**
 * Represents invocations within the AST.
 *
 * An invocation is an expression evaluated within the
 * context of a temporary scope; this scope is contains both
 * the data currently within the global scope, and any values
 * assigned temporarily to variables which shadown global.
 * These values are provided by {@link args}, and are mapped
 * to variables within {@link expression} alphabetically.
 *
 * @example
 * ```ts
 * const invoked = new Invocation(
 *   new Addition(
 *     new Variable('y'),
 *     new Multiplication(
 *       new Real(2),
 *       new Variable('x')
 *     )
 *   ),
 *   Real(10),
 *   Real(3)
 * ); // == 23; 10 gets mapped to 'x', 3 to 'y'
 * ```
 *
 * TODO: This likely needs to capture scope, which requires
 * a scope construct.
 */
export class Invocation extends TreeNode {
  /**
   * The expression to invoke
   *
   * NB: does not need to have unbound variables. The
   * internal evaluation logic will syntactically reduce
   * this expression, replacing any variables found in it
   * which have bindings in scope.
   */
  readonly expression: TreeNode;

  /**
   * Arguments supplied to the invocation to bind, temporarily
   * to variables potentially within {@link expression}
   *
   * Can be empty. Values are assigned to variables in the
   * following manner: variables within `expression` are
   * first discovered, then sorted alphabetically; args[0]
   * is assigned to the first variable, args[1] to the second,
   * etc.
   */
  readonly args: TreeNode[];

  /**
   * Creates a new Invocation node
   * @param expression The expression to invoke and evaluate
   * @param args The values to bind to variables within `expression`
   */
  constructor(expression: TreeNode, ...args: TreeNode[]) {
    super();
    this.expression = expression;
    this.args = args;
  }
}
