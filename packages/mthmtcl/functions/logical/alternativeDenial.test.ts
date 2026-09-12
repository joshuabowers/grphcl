import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { AlternativeDenial, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { nand } from "./alternativeDenial.ts";

describe("nand", () => {
  it("is an AlternativeDenial for unbound input", () => {
    expect(
      nand(variable("x"), variable("y")),
    ).toEqual(
      new AlternativeDenial(new Variable("x"), new Variable("y")),
    );
  });
});
