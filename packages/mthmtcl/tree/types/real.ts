import { Type } from "./type.ts";

/**
 * Represents (quite a few) real numbers in the AST.
 * NB: stored in a Javascript "number", so precision and
 * accuracy follows IEEE 754 doubles.
 */
export class Real extends Type<number> {
}
