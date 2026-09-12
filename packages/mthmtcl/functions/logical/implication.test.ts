import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Implication, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { implies } from "./implication.ts";

describe("implies", () => {
  it("is a Implication for unbound input", () => {
    expect(
      implies(variable("x"), variable("y")),
    ).toEqual(
      new Implication(new Variable("x"), new Variable("y")),
    );
  });
});
