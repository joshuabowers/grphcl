// import { Field } from "./field.ts";
import { Numeric } from "./numeric.ts";

/** Represents the concept of nothingness in the AST */
export class Nil extends Numeric {
  constructor() {
    super();
  }
}
