import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Boolean, Complex, Real } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";

describe("boolean", () => {
  it("returns a Boolean for system boolean input", () => {
    expect(boolean(true)).toEqual(new Boolean(true));
  });

  it("returns a Boolean for Boolean input", () => {
    expect(boolean(new Boolean(false))).toEqual(new Boolean(false));
  });

  it("returns a Boolean for Complex input", () => {
    expect(boolean(new Complex({ a: 3, b: 4 }))).toEqual(new Boolean(true));
  });

  it("returns a Boolean for Real input", () => {
    expect(boolean(new Real(0))).toEqual(new Boolean(false));
  });
});
