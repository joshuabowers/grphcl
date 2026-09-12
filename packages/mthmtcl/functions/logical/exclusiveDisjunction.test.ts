import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { ExclusiveDisjunction, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { variable } from "../variable.ts";
import { not } from "../not.ts";
import { xor } from "./exclusiveDisjunction.ts";

describe("xor", () => {
  it("returns false when given two true things", () => {
    expect(
      xor(boolean(true), boolean(true)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true if the left argument is false", () => {
    expect(
      xor(boolean(false), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if the right argument is false", () => {
    expect(
      xor(boolean(true), boolean(false)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false if both arguments are false", () => {
    expect(
      xor(boolean(false), boolean(false)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns the right operand if the left is false", () => {
    expect(
      xor(boolean(false), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the left operand if the right is false", () => {
    expect(
      xor(variable("x"), boolean(false)),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the complement of the right if the left is true", () => {
    expect(
      xor(boolean(true), variable("x")),
    ).toEqual(
      not(variable("x")),
    );
  });

  it("returns the complement of the left if the right is true", () => {
    expect(
      xor(variable("x"), boolean(true)),
    ).toEqual(
      not(variable("x")),
    );
  });

  it("returns false if the left and right operands are equal", () => {
    expect(
      xor(variable("x"), variable("x")),
    ).toEqual(
      boolean(false),
    );
  });

  it("is a ExclusiveDisjunction for unbound input", () => {
    expect(
      xor(variable("x"), variable("y")),
    ).toEqual(
      new ExclusiveDisjunction(new Variable("x"), new Variable("y")),
    );
  });
});
