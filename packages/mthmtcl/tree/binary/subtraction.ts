import { BinaryNode } from "./binaryNode.ts";

/**
 * Represents subtractions within the AST.
 *
 * NB: Unlike {@link Addition}, subtraction is neither
 * commutative nor associative: `x - (y - z) != y - (z - x)`
 *
 * @example
 * ```ts
 * const subtracted = new Subtraction(
 *   new Variable('x'),
 *   new Real(2)
 * ); // == x - 2
 * ```
 */
export class Subtraction extends BinaryNode {
}
