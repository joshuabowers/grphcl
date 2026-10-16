/**
 * Provides a uniform access point to (relatively) common
 * constants used throughout the library, many of which are
 * likely of interest to consumers of it.
 *
 * Note, in many cases, these values can be regenerated on
 * the fly, as the classes are, themselves, very thin wrappers
 * around their underlying data.
 *
 * @module
 */

import type { Complex, Real } from "./tree/mod.ts";
import { real } from "./functions/real.ts";
import { complex } from "./functions/complex.ts";

export { EulerMascheroni } from "./functions/real.ts";
export { ComplexInfinity } from "./functions/complex.ts";

/** The mathematical constant pi */
export const Pi: Real = real(Math.PI),
  /** The mathematical constant e */
  E: Real = real(Math.E),
  /** The mathematical constant 1 */
  One: Real = real(1),
  /** The mathematical constant 0 */
  Zero: Real = real(0),
  /** The mathematical constant Infinity */
  RealPosInfinity: Real = real(Infinity),
  /** The mathematical constant -Infinity */
  RealNegInfinity: Real = real(-Infinity);
/** The mathematical constant i, representing the sqrt(-1) */
export const I: Complex = complex(0, 1);
