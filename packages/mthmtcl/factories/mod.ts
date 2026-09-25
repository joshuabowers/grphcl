/**
 * Provides select access to some of the functions and types
 * which produce most of the math functions in the library.
 *
 * These are mostly internal, but could, in theory, be used by
 * the willing to bootstrap new behavior outside of the context
 * of the library.
 *
 * @module
 */

export { type Action, is, type MathFn } from "./factory.ts";
export { field, type FieldFn } from "./field.ts";
export { unary, type UnaryFn } from "./unary.ts";
export {
  binary,
  type BinaryFn,
  type PartialBinaryFn,
  partialLeft,
  partialRight,
} from "./binary.ts";
