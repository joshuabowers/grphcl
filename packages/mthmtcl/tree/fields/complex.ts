import { Field } from "./field.ts";

/**
 * Represents complex numbers in the AST.
 * NB: stored as a pair of system doubles, a and b, such
 * that z = a + b*i.
 */
export class Complex extends Field<{ a: number; b: number }> {
}
