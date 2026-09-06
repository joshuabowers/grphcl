import { Boolean, Complex, Real } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { field, when } from "../factories/field.ts";

/**
 * Creates instances of {@link Boolean} field types.
 *
 * Can take:
 * 1. a system boolean: true or false
 * 2. a {@link Boolean}, copying its raw
 * 3. a {@link Complex}, asserting if it is non-zero
 * 4. a {@link Real}, assertinng if it is non-zero
 *
 * @example
 * ```ts
 * const b = boolean(true) // => new Boolean(true)
 * ```
 *
 * @example
 * ```ts
 * const b = boolean(complex(0, 0)) // => new Boolean(false)
 * ```
 */
export const boolean = field(Boolean, ([b]: [boolean]) => b)(
  when(is(Boolean), (b) => [[b.raw], Action.Identity]),
  when(
    is(Complex),
    (c) => [[c.raw.a !== 0 && c.raw.b !== 0], Action.Conversion],
  ),
  when(is(Real), (r) => [[r.raw !== 0], Action.Conversion]),
);
