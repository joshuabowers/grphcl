import { QNaN } from "../tree/fields/qnan.ts";

/** A signleton instance of the propagating, quite NaN,
 * used to signal a value is not a representable value or is
 * otherwise undefined.
 */
export const qNaN: QNaN = new QNaN();
