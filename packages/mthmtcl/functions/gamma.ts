import { Boolean, Gamma, Numeric } from "../tree/mod.ts";
import { Action, is } from "../factories/factory.ts";
import { unary, type UnaryFn, when } from "../factories/unary.ts";
import { isNegativeInteger, isPositiveInteger } from "../utility/integers.ts";
import { isBelowThreshold } from "../utility/isBelowThreshold.ts";
import { boolean } from "./boolean.ts";
import { real } from "./real.ts";
import { add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { multiply } from "./multiply.ts";
import { divide } from "./divide.ts";
import { raise } from "./raise.ts";
import { negate } from "./negate.ts";
import { sqrt } from "./raise.ts";
import { sin } from "./trigonometric.ts";
import { factorial } from "./factorial.ts";
import { ComplexInfinity } from "./complex.ts";

const lanczos = {
  p: <Numeric[]> [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ].map(real),
};

const pi = real(Math.PI), sqrtTwicePi = sqrt(real(2 * Math.PI));

/**
 * Calculates the gamma function, `Γ(x)` for most inputs.
 *
 * The gamma function, among other uses, is an extrapolation
 * of {@link factorial} to non-integer inputs. It also
 * approximates the integer values factorial does, when
 * accounting for the relation between them: `Γ(x) === (x - 1)!`
 *
 * This is a {@link unary} function, which operates on a
 * singular TreeNode input with the following possibilities
 *
 * @example For positive integers, delegates to factorial
 * ```ts
 * const r1 = gamma(real(5)) // => factorial(real(4))
 * const r2 = gamma(complex(5, 0)) // => factorial(complex(4, 0))
 * ```
 *
 * @example For negative integers, is ComplexInfinity
 * ```ts
 * const result = gamma(real(-5)) // => ComplexInfinity
 * ```
 *
 * @example For non-intgers, calculates using the
 * {@link https://en.wikipedia.org/wiki/Lanczos_approximation | Lanczos approximation}.
 * ```ts
 * const result = gamma(real(5.5)) // ~=> 52.34
 * ```
 *
 * @example For unbound input, generates {@link Gamma} AST nodes
 * ```ts
 * const result = gamma(variable('x'))
 * // => new Gamma(new Variable('x'))
 * ```
 */
export const gamma: UnaryFn<Gamma> = unary(Gamma)(
  when(is(Boolean), [boolean(true), Action.Application]),
  when(is(Numeric, isNegativeInteger), [ComplexInfinity, Action.Singularity]),
  when(
    is(Numeric, isPositiveInteger),
    (n) => [factorial(subtract(n, real(1))), Action.Delegation],
  ),
  when(
    is(Numeric, isBelowThreshold(0.5)),
    (n) => [
      divide(
        pi,
        multiply(
          sin(multiply(n, pi)),
          gamma(subtract(real(1), n)),
        ),
      ),
      Action.Reflection,
    ],
  ),
  when(
    is(Numeric),
    (n) => {
      const one = real(1);
      const z = subtract(n, one);
      const x = lanczos.p.reduce(
        (s, v, i) => add(s, divide(v, add(z, real(i)))),
      );
      const t = subtract(add(z, real(lanczos.p.length - 1)), real(0.5));
      return [
        multiply(
          sqrtTwicePi,
          multiply(
            raise(t, add(z, real(0.5))),
            multiply(raise(real(Math.E), negate(t)), x),
          ),
        ),
        Action.Application,
      ];
    },
  ),
);
