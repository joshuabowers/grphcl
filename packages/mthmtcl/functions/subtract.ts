import { Boolean, Complex, Real, Subtraction } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { binary, type BinaryFn, when } from "../factories/binary.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";

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
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [
      boolean((l.raw || r.raw) && !(l.raw && r.raw)),
      Action.Application,
    ],
  ),
  when(
    [is(Complex), is(Complex)],
    (l, r) => [
      complex(l.raw.a - r.raw.a, l.raw.b - r.raw.b),
      Action.Application,
    ],
  ),
  when(
    [is(Real), is(Real)],
    (l, r) => [real(l.raw - r.raw), Action.Application],
  ),
);
