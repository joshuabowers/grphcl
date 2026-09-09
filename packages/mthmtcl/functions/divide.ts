import { Boolean, Complex, Division, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, when } from "../factories/binary.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

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
  when(
    [is(Complex), is(Complex)],
    (l, r) => {
      const denominator = r.raw.a ** 2 + r.raw.b ** 2;
      const a = l.raw.a * r.raw.a + l.raw.b * r.raw.b;
      const b = l.raw.b * r.raw.a - l.raw.a * r.raw.b;
      return [
        complex(a / denominator, b / denominator),
        Action.Application,
      ];
    },
  ),
  when(
    [is(Real), is(Real)],
    (l, r) => [real(l.raw / r.raw), Action.Application],
  ),
);
