import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { variable } from "../functions/variable.ts";
import { add } from "../functions/add.ts";
import { subtract } from "../functions/subtract.ts";
import { multiply } from "../functions/multiply.ts";
import { divide } from "../functions/divide.ts";
import { cos, cot, csc, sec, sin, tan } from "../functions/trigonometric.ts";
import { acos, acot, acsc, asec, asin, atan } from "../functions/arcus.ts";
import { cosh, coth, csch, sech, sinh, tanh } from "../functions/hyperbolic.ts";
import {
  acosh,
  acoth,
  acsch,
  asech,
  asinh,
  atanh,
} from "../functions/areaHyperbolic.ts";
import { inverse, sadmep } from "./isolation.ts";

// SADMEP is reversed PEMDAS. Operations need to be evaluated in
// effective reverse order to PEMDAS, splitting precedence
// left-to-right in SADMEP context.
describe("sadmep", () => {
  it("is left for [Subtraction, Addition]", () => {
    const left = subtract(variable("x"), variable("y")),
      right = add(variable("x"), variable("y"));
    expect(sadmep(left, right)).toBe(left);
  });

  it("is left for [Addition, Subtraction]", () => {
    const left = add(variable("x"), variable("y")),
      right = subtract(variable("x"), variable("y"));
    expect(sadmep(left, right)).toBe(left);
  });

  it("is right for [Division, Subtraction]", () => {
    const left = divide(variable("x"), variable("y")),
      right = subtract(variable("x"), variable("y"));
    expect(sadmep(left, right)).toBe(right);
  });
});

describe("inverse", () => {
  it("is subtract for Addition", () => {
    expect(
      inverse(add(variable("x"), variable("y"))),
    ).toBe(subtract);
  });

  it("is add for Subtraction", () => {
    expect(
      inverse(subtract(variable("x"), variable("y"))),
    ).toBe(add);
  });

  it("is divide for Multiplication", () => {
    expect(
      inverse(multiply(variable("x"), variable("y"))),
    ).toBe(divide);
  });

  it("is multiply for Division", () => {
    expect(
      inverse(divide(variable("x"), variable("y"))),
    ).toBe(multiply);
  });

  it("is acos for Trigonometric.Cosine", () => {
    expect(
      inverse(cos(variable("x"))),
    ).toBe(acos);
  });

  it("is asin for Trigonometric.Sine", () => {
    expect(
      inverse(sin(variable("x"))),
    ).toBe(asin);
  });

  it("is atan for Trigonometric.Tangent", () => {
    expect(
      inverse(tan(variable("x"))),
    ).toBe(atan);
  });

  it("is asec for Trigonometric.Secant", () => {
    expect(
      inverse(sec(variable("x"))),
    ).toBe(asec);
  });

  it("is acsc for Trigonometric.Cosecant", () => {
    expect(
      inverse(csc(variable("x"))),
    ).toBe(acsc);
  });

  it("is acot for Trigonometric.Cotangent", () => {
    expect(
      inverse(cot(variable("x"))),
    ).toBe(acot);
  });

  it("is cos for Arcus.Cosine", () => {
    expect(
      inverse(acos(variable("x"))),
    ).toBe(cos);
  });

  it("is sin for Arcus.Sine", () => {
    expect(
      inverse(asin(variable("x"))),
    ).toBe(sin);
  });

  it("is tan for Arcus.Cotangent", () => {
    expect(
      inverse(atan(variable("x"))),
    ).toBe(tan);
  });

  it("is sec for Arcus.Secant", () => {
    expect(
      inverse(asec(variable("x"))),
    ).toBe(sec);
  });

  it("is csc for Arcus.Cosecant", () => {
    expect(
      inverse(acsc(variable("x"))),
    ).toBe(csc);
  });

  it("is cot for Arcus.Cotangent", () => {
    expect(
      inverse(acot(variable("x"))),
    ).toBe(cot);
  });

  it("is acosh for Hyperbolic.Cosine", () => {
    expect(
      inverse(cosh(variable("x"))),
    ).toBe(acosh);
  });

  it("is asinh for Hyperbolic.Sine", () => {
    expect(
      inverse(sinh(variable("x"))),
    ).toBe(asinh);
  });

  it("is atanh for Hyperbolic.Tangent", () => {
    expect(
      inverse(tanh(variable("x"))),
    ).toBe(atanh);
  });

  it("is asech for Hyperbolic.Secant", () => {
    expect(
      inverse(sech(variable("x"))),
    ).toBe(asech);
  });

  it("is acsch for Hyperbolic.Cosecant", () => {
    expect(
      inverse(csch(variable("x"))),
    ).toBe(acsch);
  });

  it("is acoth for Hyperbolic.Cotangent", () => {
    expect(
      inverse(coth(variable("x"))),
    ).toBe(acoth);
  });

  it("is cosh for AreaHyperbolic.Cosine", () => {
    expect(
      inverse(acosh(variable("x"))),
    ).toBe(cosh);
  });

  it("is sinh for AreaHyperbolic.Sine", () => {
    expect(
      inverse(asinh(variable("x"))),
    ).toBe(sinh);
  });

  it("is tanh for AreaHyperbolic.Cotangent", () => {
    expect(
      inverse(atanh(variable("x"))),
    ).toBe(tanh);
  });

  it("is sech for AreaHyperbolic.Secant", () => {
    expect(
      inverse(asech(variable("x"))),
    ).toBe(sech);
  });

  it("is csch for AreaHyperbolic.Cosecant", () => {
    expect(
      inverse(acsch(variable("x"))),
    ).toBe(csch);
  });

  it("is coth for AreaHyperbolic.Cotangent", () => {
    expect(
      inverse(acoth(variable("x"))),
    ).toBe(coth);
  });
});
