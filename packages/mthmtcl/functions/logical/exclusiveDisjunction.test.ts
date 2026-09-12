import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { ExclusiveDisjunction, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { xor } from "./exclusiveDisjunction.ts";

describe("xor", () => {
  it("is a ExclusiveDisjunction for unbound input", () => {
    expect(
      xor(variable("x"), variable("y")),
    ).toEqual(
      new ExclusiveDisjunction(new Variable("x"), new Variable("y")),
    );
  });
});
