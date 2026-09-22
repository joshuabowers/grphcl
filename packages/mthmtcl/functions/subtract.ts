import {
  Addition,
  Negation,
  Numeric,
  Subtraction,
  type TreeNode,
} from "../tree/mod.ts";
import { Action, is, type Rewrite } from "../factories/factory.ts";
import { binary, type BinaryFn, otherwise } from "../factories/binary.ts";
import { isBelowThreshold } from "../utility/isBelowThreshold.ts";
import { $add } from "./add.ts";
import { $negate } from "./negate.ts";

/**
 * Creates {@link Subtraction} AST nodes.
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
 * subtract will coerce mixed types (@see {@link BinaryFn}).
 *
 * @example Default algebraic analysis
 * ```ts
 * const added = subtract(variable('x'), variable('y'));
 * // => new Subtraction(new Variable('x'), new Variable('y'))
 * ```
 *
 * @example Real subtraction
 * ```ts
 * const result = subtract(real(5), real(10)) // => real(-5)
 * ```
 *
 * @example Complex subtraction
 * ```ts
 * const result = subtract(complex(0, 1), complex(1, 0))
 * // => complex(-1, 1)
 * ```
 *
 * @example Complex-coercion
 * ```ts
 * const result = subtract(real(5), complex(1, 2))
 * // => complex(4, -2)
 * ```
 */
export const subtract: BinaryFn<Subtraction> = binary(Subtraction)(
  otherwise((l, r) => {
    const rewritten = $add(l, $negate(r));
    let response: Rewrite<TreeNode> | undefined = undefined;
    if (is(Addition)(rewritten)) {
      if (
        is(Numeric)(rewritten.right) && isBelowThreshold(0)(rewritten.right)
      ) {
        response = [
          new Subtraction(rewritten.left, $negate(rewritten.right)),
          Action.Creation,
        ];
      } else if (
        is(Negation)(rewritten.left) && !is(Negation)(rewritten.right)
      ) {
        response = [
          new Subtraction(rewritten.right, rewritten.left.child),
          Action.Creation,
        ];
      } else if (
        !is(Negation)(rewritten.left) && is(Negation)(rewritten.right)
      ) {
        response = [
          new Subtraction(rewritten.left, rewritten.right.child),
          Action.Creation,
        ];
      }
    }
    return response ?? [rewritten, Action.Delegation];
  }),
);
