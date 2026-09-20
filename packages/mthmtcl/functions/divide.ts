import {
  Boolean,
  Division,
  Exponentiation,
  Multiplication,
  Numeric,
  type TreeNode,
} from "../tree/mod.ts";
import { Action, is, type Rewrite } from "../factories/factory.ts";
import { binary, type BinaryFn, otherwise, when } from "../factories/binary.ts";
import { real } from "./real.ts";
import { isNegativeOne } from "../utility/integers.ts";
import { reciprocal } from "./raise.ts";
import { multiply } from "./multiply.ts";
import { preserve } from "./preserve.ts";

/**
 * Creates {@link Division} AST nodes.
 *
 * Derived from {@link binary}: takes two {@link TreeNode}
 * inputs, returning some flavor of {@link TreeNode} output.
 *
 * This function performs numerous numerical and algebraic
 * analyses, yielding different types of TreeNode for
 * different edge casees. Some of these are documented by
 * the examples.
 *
 * Note that, like all {@link binary}-derived functions,
 * divide will coerce mixed types (@see {@link BinaryFn}).
 *
 * @example Default algebraic analysis
 * ```ts
 * const divided = divide(variable('x'), variable('y'));
 * // => new Division(new Variable('x'), new Variable('y'))
 * ```
 *
 * @example Real divison
 * ```ts
 * const result = divide(real(10), real(5)) // => real(2)
 * ```
 *
 * @example Complex division
 * ```ts
 * const result = divide(complex(1, 0), complex(1, 2))
 * // => ~= complex(0.2, -0.4)
 * ```
 *
 * @example Complex-coercion
 * ```ts
 * const result = divide(real(1), complex(1, 2))
 * // => ~= complex(0.2, -0.4)
 * ```
 */
export const divide: BinaryFn<Division> = binary(Division)(
  when(
    [is(Boolean), is(Boolean)],
    (l, _r) => [l, Action.Application],
  ),
  otherwise((l, r) => {
    const rewritten = multiply(l, reciprocal(r));
    let response: Rewrite<TreeNode> | undefined = undefined;
    if (is(Exponentiation)(rewritten) && isNegativeOne(rewritten.right)) {
      response = [
        new Division(preserve(rewritten.right, real(1)), rewritten.left),
        Action.Creation,
      ];
    } else if (is(Multiplication)(rewritten)) {
      if (
        is(Exponentiation)(rewritten.left) &&
        is(Numeric, isNegativeOne)(rewritten.left.right)
      ) {
        response = [
          new Division(rewritten.right, rewritten.left.left),
          Action.Creation,
        ];
      } else if (
        is(Exponentiation)(rewritten.right) &&
        is(Numeric, isNegativeOne)(rewritten.right.right)
      ) {
        response = [
          new Division(rewritten.left, rewritten.right.left),
          Action.Creation,
        ];
      }
    }
    return response ?? [rewritten, Action.Delegation];
  }),
);
