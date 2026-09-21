import { describe, it } from "node:test";
import { expect } from "@std/expect";
import {} from "../tree/mod.ts";
import { real } from "../functions/real.ts";
import { variable } from "../functions/variable.ts";
import { add } from "../functions/add.ts";
import { subtract } from "../functions/subtract.ts";
import { reciprocal } from "../functions/raise.ts";
import { divide } from "../functions/divide.ts";
import { negate } from "../functions/negate.ts";
import { canonicalize } from "./canonicalization.ts";

describe("canonicalize", () => {
  it("rounds reals", () => {
    expect(canonicalize(real(0.1 + 0.2))).toEqual(real(0.3));
  });

  it("transforms reciprocals into divisions", () => {
    expect(
      canonicalize(reciprocal(variable("x"))),
    ).toEqual(divide(real(1), variable("x")));
  });

  it("transforms an addition of a negative number into a subtraction", () => {
    expect(
      canonicalize(add(variable("x"), real(-5))),
    ).toEqual(subtract(variable("x"), real(5)));
  });

  it("transforms negated left additions into subtractions", () => {
    expect(
      canonicalize(add(negate(variable("x")), real(5))),
    ).toEqual(subtract(real(5), variable("x")));
  });

  it("transforms negated right additions into subtractions", () => {
    expect(
      canonicalize(add(variable("x"), negate(variable("y")))),
    ).toEqual(subtract(variable("x"), variable("y")));
  });

  it("passes through an already canonical TreeNode", () => {
    expect(
      canonicalize(add(variable("x"), real(5))),
    ).toEqual(add(variable("x"), real(5)));
  });
});
