import { Numeric } from "./numeric.ts";

/** Represents the concept of a Quiet NaN, or a
 * propagating "Not a Number" within the AST.
 */
export class QNaN extends Numeric {
  /** The raw value of a QNaN is hardcoded to the system NaN */
  readonly raw = NaN;

  override get fnName(): string {
    return "qNaN";
  }
}
