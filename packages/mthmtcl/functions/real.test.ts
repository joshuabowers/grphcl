import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Boolean, Complex, Real } from "../tree/mod.ts";
import { real } from "./real.ts";

describe("real", () => {
  it("returns a Real for a number input", () => {
    expect(real(5)).toEqual(new Real(5));
  });

  it("returns a Real for Real input", () => {
    expect(real(new Real(10))).toEqual(new Real(10));
  });

  it("returns a Real for Boolean input", () => {
    expect(real(new Boolean(true))).toEqual(new Real(1));
  });

  it("returns a Real for Complex input", () => {
    expect(real(new Complex({ a: 3, b: 4 }))).toEqual(new Real(3));
  });
});
