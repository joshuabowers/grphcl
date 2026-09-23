import { Subtraction } from "../tree/mod.ts";
import { Action } from "../factories/factory.ts";
import { binary, type BinaryFn, otherwise } from "../factories/binary.ts";
import { $add } from "./add.ts";
import { $negate } from "./negate.ts";
import { canonicalizeFrom } from "../utility/canonicalization.ts";

/**
 * Internal implementation of {@link subtract}, which does not
 * perform normalization from {@link canonicalizeFrom}
 */
export const $subtract: BinaryFn<Subtraction> = binary(Subtraction)(
  otherwise((l, r) => [$add(l, $negate(r)), Action.Delegation]),
);

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
export const subtract: BinaryFn<Subtraction> = canonicalizeFrom($subtract);
