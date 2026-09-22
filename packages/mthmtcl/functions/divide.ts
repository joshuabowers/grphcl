import { Boolean, Division } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, otherwise, when } from "../factories/binary.ts";
import { reciprocal } from "./raise.ts";
import { $multiply } from "./multiply.ts";
import { canonicalizeFrom } from "../utility/canonicalization.ts";

/**
 * Internal implementation of {@link divide}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $divide: BinaryFn<Division> = binary(Division)(
  when(
    [is(Boolean), is(Boolean)],
    (l, _r) => [l, Action.Application],
  ),
  otherwise((l, r) => [$multiply(l, reciprocal(r)), Action.Delegation]),
);

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
export const divide: BinaryFn<Division> = canonicalizeFrom($divide);
