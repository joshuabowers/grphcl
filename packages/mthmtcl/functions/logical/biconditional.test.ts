import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Biconditional, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { xnor } from "./biconditional.ts";

describe("xnor", () => {
  it("is a Biconditional for unbound input", () => {
    expect(
      xnor(variable("x"), variable("y")),
    ).toEqual(
      new Biconditional(new Variable("x"), new Variable("y")),
    );
  });
});
