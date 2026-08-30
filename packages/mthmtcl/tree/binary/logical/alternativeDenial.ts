import { Logical } from "./logical.ts";

/**
 * Represents logical alternative denials within the AST.
 *
 * @example
 * ```ts
 * const anded = new AlternativeDenial(
 *   new Variable('x'),
 *   new Variable('y')
 * ); // == nand(x, y)
 * ```
 */
export class AlternativeDenial extends Logical {
}
