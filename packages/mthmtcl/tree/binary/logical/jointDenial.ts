import { Logical } from "./logical.ts";

/**
 * Represents logical joint denials within the AST.
 *
 * @example
 * ```ts
 * const anded = new JointDenial(
 *   new Variable('x'),
 *   new Variable('y')
 * ); // == nor(x, y)
 * ```
 */
export class JointDenial extends Logical {
}
