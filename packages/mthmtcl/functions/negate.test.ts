import { describe, it } from "node:test";
import { expect } from "@std/expect";
import {
  Multiplication,
  Negation,
  Subtraction,
  Variable,
} from "../tree/mod.ts";
import { boolean } from "./boolean.ts";
import { $complex } from "./complex.ts";
import { real } from "./real.ts";
import { variable } from "./variable.ts";
import { multiply } from "./multiply.ts";
import { add } from "./add.ts";
import { subtract } from "./subtract.ts";
import { negate } from "./negate.ts";

describe("negate", () => {
  it("does not alter a boolean input", () => {
    expect(negate(boolean(true))).toEqual(boolean(true));
    expect(negate(boolean(false))).toEqual(boolean(false));
  });

  it("flips the sign of both components of a complex number", () => {
    expect(negate($complex(3, -4))).toEqual($complex(-3, 4));
  });

  it("flips the sign of a Real input", () => {
    expect(negate(real(5))).toEqual(real(-5));
  });

  it("returns the grandchild of a double negation", () => {
    expect(negate(negate(variable("x")))).toEqual(variable("x"));
  });

  it("coalesces with the coefficient of a multiplication", () => {
    expect(
      negate(
        multiply(real(5), variable("x")),
      ),
    ).toEqual(
      new Multiplication(real(-5), variable("x")),
    );
  });

  it("distributes across an addition", () => {
    expect(
      negate(
        add(variable("x"), real(5)),
      ),
    ).toEqual(
      new Subtraction(negate(variable("x")), real(5)),
    );
  });

  it("distributes across a subtraction", () => {
    expect(
      negate(
        subtract(variable("x"), real(5)),
      ),
    ).toEqual(
      new Subtraction(real(5), variable("x")),
    );
  });

  it("returns a Negation for unbound input", () => {
    expect(negate(variable("x"))).toEqual(new Negation(new Variable("x")));
  });
});
