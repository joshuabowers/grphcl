import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { ConverseImplication, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { converse } from "./converseImplication.ts";

describe("converse", () => {
  it("is a ConverseImplication for unbound input", () => {
    expect(
      converse(variable("x"), variable("y")),
    ).toEqual(
      new ConverseImplication(new Variable("x"), new Variable("y")),
    );
  });
});
