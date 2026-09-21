import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { real } from "../functions/real.ts";
import { $$$add, $$$negate, $$add, $$negate, reshape } from "./reshape.ts";
import { reciprocal } from "../functions/raise.ts";
import { variable } from "../functions/variable.ts";
import { divide } from "../functions/divide.ts";
import { add } from "../functions/add.ts";
import { negate } from "../functions/negate.ts";
import { subtract } from "../functions/subtract.ts";

describe("$$add", () => {
  it("sums two reals", () => {
    expect($$add(real(5), real(10))).toEqual(real(15));
  });
});

describe("$$negate", () => {
  it("flips the sign of a real", () => {
    expect($$negate(real(10))).toEqual(real(-10));
  });
});

describe("$$$add", () => {
  it("sums two reals", () => {
    expect($$$add(real(5), real(10))).toEqual(real(15));
  });
});

describe("$$$negate", () => {
  it("flips the sign of a real", () => {
    expect($$$negate(real(10))).toEqual(real(-10));
  });
});

describe("reshape", () => {
  it("rounds reals", () => {
    expect(reshape(real(0.1 + 0.2))).toEqual(real(0.3));
  });

  it("transforms reciprocals into divisions", () => {
    expect(
      reshape(reciprocal(variable("x"))),
    ).toEqual(divide(real(1), variable("x")));
  });

  it("transforms an addition of a negative number into a subtraction", () => {
    expect(
      reshape(add(variable("x"), real(-5))),
    ).toEqual(subtract(variable("x"), real(5)));
  });

  it("transforms negated left additions into subtractions", () => {
    expect(
      reshape(add(negate(variable("x")), real(5))),
    ).toEqual(subtract(real(5), variable("x")));
  });

  it("transforms negated right additions into subtractions", () => {
    expect(
      reshape(add(variable("x"), negate(variable("y")))),
    ).toEqual(subtract(variable("x"), variable("y")));
  });
});
