import { describe, it } from "node:test";
import { expect } from "@std/expect";
import {
  abs,
  boolean,
  combine,
  complex,
  permute,
  real,
  sin,
  variable,
} from "../functions/mod.ts";
import { deepEquals } from "./deepEquals.ts";

describe("deepEquals", () => {
  it("returns true for equivalent real inputs", () => {
    expect(deepEquals(real(5), real(5))).toBeTruthy();
  });

  it("returns false for inequivalent real inputs", () => {
    expect(deepEquals(real(0), real(5))).toBeFalsy();
  });

  it("returns true for equivalent complex inputs", () => {
    expect(deepEquals(complex(5, 5), complex(5, 5))).toBeTruthy();
  });

  it("returns false for inequivalent complex inputs", () => {
    expect(deepEquals(complex(0, 0), complex(5, 5))).toBeFalsy();
  });

  it("returns true for equivalent booleans", () => {
    expect(deepEquals(boolean(true), boolean(true))).toBeTruthy();
  });

  it("returns false for inequivalent booleans", () => {
    expect(deepEquals(boolean(true), boolean(false))).toBeFalsy();
  });

  // TODO: Add these back in when Nil and NaN properly implemented.
  //   it('returns true for equivalent nil inputs', () => {
  //     expect(deepEquals(nil, nil)).toBeTruthy()
  //   })

  //   it('returns false for equivalent NaN inputs', () => {
  //     expect(deepEquals(nan, nan)).toBeFalsy()
  //   })

  it("returns true for equivalent variables", () => {
    expect(deepEquals(variable("x"), variable("x"))).toBeTruthy();
  });

  it("returns false for inequivalent variables", () => {
    expect(deepEquals(variable("x"), variable("y"))).toBeFalsy();
  });

  it("returns true for equivalent unary functions", () => {
    expect(deepEquals(abs(variable("x")), abs(variable("x")))).toBeTruthy();
  });

  it("returns false for equivalent unary functions with inequivalent children", () => {
    expect(deepEquals(abs(variable("x")), abs(variable("y")))).toBeFalsy();
  });

  it("returns false for inequivalent unary functions", () => {
    expect(deepEquals(abs(variable("x")), sin(variable("x")))).toBeFalsy();
  });

  it("returns true for equivalent binary functions", () => {
    expect(deepEquals(
      combine(variable("x"), real(5)),
      combine(variable("x"), real(5)),
    )).toBeTruthy();
  });

  it("returns false for equivalent binary functions with inequivalent children", () => {
    expect(deepEquals(
      combine(variable("x"), real(5)),
      combine(variable("y"), real(10)),
    )).toBeFalsy();
  });

  it("returns false for inequivalent binary functions", () => {
    expect(deepEquals(
      combine(variable("x"), variable("y")),
      permute(variable("x"), variable("y")),
    )).toBeFalsy();
  });
});
