import { UnaryNode } from "./unaryNode.ts";

/**
 * Represents factorial expressions within the AST.
 *
 * NB: A factorial _is_ defined on all types, delegating
 * to {@link Gamma} for non-integer inputs. For the integers,
 * it is defined by a recurrence:
 * `x! == x * (x-1)!, x > 0; 0! == 1.`
 * @example
 * ```ts
 * const f = new Factorial(new Real(5)); // == 120
 * ```
 */
export class Factorial extends UnaryNode {
}
