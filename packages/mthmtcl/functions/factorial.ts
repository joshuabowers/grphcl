import { Boolean, Complex, Factorial, Numeric, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { isNegativeInteger, isNonInteger } from "../utility/integers.ts";
import { boolean } from "./boolean.ts";
import { complex, ComplexInfinity } from "./complex.ts";
import { real } from "./real.ts";
import { add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { gamma } from "./gamma.ts";

/**
 * Calculates the factorial function, `x!` for most inputs.
 *
 * This is a {@link unary} function, which operates on a
 * singular TreeNode input with the following possibilities
 *
 * @example For negative integers
 * ```ts
 * const result = factorial(real(-5)) // => ComplexInfinity
 * ```
 *
 * @example For non-negative integers
 * ```ts
 * const result = factorial(real(5)) // => real(120)
 * const r2 = factorial(complex(5, 0)) // => complex(120, 0)
 * ```
 *
 * @example For non-integers, delegates to {@link gamma},
 * increasing the input value by 1
 * ```ts
 * const result = factorial(5.5) // => gamma(6.5)
 * const r2 = factorial(complex(1, 2)) // => gamma(complex(2, 2))
 * ```
 *
 * @example For unbound input, generates {@link Factorial} AST
 * nodes
 * ```ts
 * const result = factorial(variable('x'))
 * // => new Factorial(new Variable('x'))
 * ```
 */
export const factorial: UnaryFn<Factorial> = unary(Factorial)(
  // NB: Edge case order matters! Without, this will blow stack.
  when(is(Numeric, isNegativeInteger), [ComplexInfinity, Action.Singularity]),
  when(
    is(Numeric, isNonInteger),
    (n) => [gamma(add(n, real(1))), Action.Delegation],
  ),
  when(is(Complex, (c) => c.raw.a <= 1), [complex(1, 0), Action.Degeneracy]),
  when(is(Real, (r) => r.raw <= 1), [real(1), Action.Degeneracy]),
  when(is(Boolean), [boolean(true), Action.Application]),
  when(is(Numeric), (n) => [
    multiply(n, factorial(subtract(n, real(1)))),
    Action.Recursion,
  ]),
);
