import { real } from "./functions/real.ts";
import { complex } from "./functions/complex.ts";
import type { Complex, Real } from "@bowers/mthmtcl/tree";

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
/** The mathematical constant i */
export const I: Complex = complex(0, 1);
