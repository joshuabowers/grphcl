import { BinaryNode, type TreeNode, UnaryNode, Variable } from "../tree/mod.ts";
import { is } from "../factories/factory.ts";

function* findVariables(
  expression: TreeNode,
): IterableIterator<string> {
  if (is(Variable)(expression)) {
    yield expression.name;
  } else if (is(UnaryNode)(expression)) {
    yield* findVariables(expression.child);
  } else if (is(BinaryNode)(expression)) {
    yield* findVariables(expression.left);
    yield* findVariables(expression.right);
  }
}

/**
 * Searches for variables within the supplied {@link expression},
 * returning their names as a Set. The return value is
 * garaunteed to have an insertion order sorted alphabetically.
 *
 * @example
 * ```ts
 * const names = parameterize(add(variable('y'), cos(variable('x'))))
 * // => new Set<string>(['x', 'y'])
 * ```
 * @param expression a node to find variable names within
 * @returns a sorted set of found variable names
 */
export const parameterize = (expression: TreeNode): Set<string> =>
  new Set<string>([...findVariables(expression)].sort());
