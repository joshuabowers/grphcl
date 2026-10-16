import { Field } from "./field.ts";

/**
 * Represents (quite a few) real numbers in the AST.
 * NB: stored in a Javascript "number", so precision and
 * accuracy follows IEEE 754 doubles.
 */
export class Real extends Field<number> {
  get fnName(): string {
    return "real";
  }
}
