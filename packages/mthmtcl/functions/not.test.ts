import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Complement, Variable } from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { not } from "./not.ts";

describe("not", () => {
  it("is Boolean for boolean input", () => {
    expect(not(boolean(true))).toEqual(boolean(false));
  });

  it("is Boolean for complex input", () => {
    expect(not(complex(1, 5))).toEqual(boolean(false));
  });

  it("is Boolean for real input", () => {
    expect(not(real(0))).toEqual(boolean(true));
  });

  it("is a Complement for unbound input", () => {
    expect(not(variable("x"))).toEqual(
      new Complement(new Variable("x")),
    );
  });
});
