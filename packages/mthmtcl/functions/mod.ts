/**
 * Provides coalesced access to all mathematical functions.
 *
 * Most of these are the artifacts of a small set of
 * factory functions, which are responsible for abstracting
 * common behavior.
 *
 * These functions are primarily associated with TreeNode
 * concrete classes; each has a series of edge cases for
 * providing different results for various numeric and
 * algebraic analyses. These edge cases are, generally,
 * documented for each function.
 *
 * @module
 */

export { boolean } from "./boolean.ts";
export { complex } from "./complex.ts";
export { real } from "./real.ts";

export { variable } from "./variable.ts";

export { abs } from "./absolute.ts";
export { negate } from "./negate.ts";

export { cos, cot, csc, sec, sin, tan } from "./trigonometric.ts";

export { add } from "./add.ts";
export { subtract } from "./subtract.ts";
export { multiply } from "./multiply.ts";
export { divide } from "./divide.ts";
export { raise, reciprocal, sqrt, square } from "./raise.ts";
