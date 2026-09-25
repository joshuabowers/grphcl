/**
 * Provides functions for converting string input into
 * TreeNode-based Abstract Syntax Trees.
 *
 * {@link parser} provides a direct translation of the
 * string input into an AST; that is, its output exactly
 * mirrors the syntactical strcture of its input.
 *
 * {@link interpret}, on the otherhand, provides both the
 * tree built by parser (as it wraps it), and a semantically
 * analyzed tree which has been numerically and algebraically
 * reduced, and further canonicalized.
 *
 * Unless you have good reason to avoid the semantic analyses,
 * the latter function is likely the more immediately useful.
 *
 * @example Loading and using interpret
 * ```ts
 * import { interpret, Parsing } from "@bowers/mthmtcl/parsing"
 * import { TreeNode } from "@bowers/mthmtcl/tree"
 *
 * const {input, output}: Parsing = interpret("5 + 2 * 3");
 * // input => add(real(5), multiply(real(2), real(3)))
 * // output => real(11)
 * ```
 *
 * @module
 */

export { Unicode } from "./Unicode.ts";
export { parser } from "./parser.ts";
export { interpret, type Parsing } from "./interpret.ts";
