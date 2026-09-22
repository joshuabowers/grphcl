import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { $add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { negate } from "./negate.ts";
import { multiply } from "./multiply.ts";
import { $divide } from "./divide.ts";
import { raise } from "./raise.ts";
import { ln } from "./log.ts";
import { degree, subDegree } from "./degree.ts";

describe("subdegree", () => {
  it("is the raw value of a real", () => {
    expect(subDegree(real(5))).toEqual(real(5));
  });

  it("is the length of a complex", () => {
    expect(subDegree(complex(1, 2))).toEqual(real(Math.hypot(1, 2)));
  });

  it("is Infinity for variables", () => {
    expect(subDegree(variable("x"))).toEqual(real(Infinity));
  });
});

describe("degree", () => {
  it("is -Infinity for 0 values", () => {
    expect(degree(real(0))).toEqual(real(-Infinity));
    expect(degree(complex(0, 0))).toEqual(real(-Infinity));
    expect(degree(boolean(false))).toEqual(real(-Infinity));
  });

  it("is 0 for a real node", () => {
    expect(degree(real(1))).toEqual(real(0));
  });

  it("is 0 for complex numbers", () => {
    expect(degree(complex(1, 1))).toEqual(real(0));
  });

  it("is 0 for true booleans", () => {
    expect(degree(boolean(true))).toEqual(real(0));
  });

  it("is 1 for a variable", () => {
    expect(degree(variable("x"))).toEqual(real(1));
  });

  it("is the power of an exponentiation", () => {
    expect(
      degree(raise(variable("x"), real(3))),
    ).toEqual(real(3));
  });

  it("is infinity for an exponential function", () => {
    expect(
      degree(raise(real(2), variable("x"))),
    ).toEqual(real(Infinity));
  });

  it("is 0 for logarithms", () => {
    expect(degree(ln(variable("x")))).toEqual(real(0));
  });

  it("is the degree of the child of a negation", () => {
    expect(
      degree(negate(raise(variable("x"), real(4)))),
    ).toEqual(real(4));
  });

  it("is the sum of powers of all multiplicands", () => {
    expect(
      degree(multiply(variable("y"), raise(variable("x"), real(4)))),
    ).toEqual(real(5));
  });

  it("is the max of the two sides of an addition", () => {
    expect(
      degree($add(variable("y"), raise(variable("x"), real(3)))),
    ).toEqual(real(3));
  });

  it("is the max of the two sides of a subtraction", () => {
    expect(
      degree(subtract(variable("y"), raise(variable("x"), real(3)))),
    ).toEqual(real(3));
  });

  it("is the different of powers of a division", () => {
    expect(
      degree($divide(real(1), variable("x"))),
    ).toEqual(real(-1));
    expect(
      degree($divide(variable("x"), raise(variable("y"), real(2)))),
    ).toEqual(real(-1));
  });
});
