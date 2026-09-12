import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { ConverseImplication, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { variable } from "../variable.ts";
import { not } from "../not.ts";
import { converse } from "./converseImplication.ts";

describe("converse", () => {
  it("returns true when given two true things", () => {
    expect(
      converse(boolean(true), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false if the left argument is false", () => {
    expect(
      converse(boolean(false), boolean(true)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true if the right argument is false", () => {
    expect(
      converse(boolean(true), boolean(false)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if both arguments are false", () => {
    expect(
      converse(boolean(false), boolean(false)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if the left operand is true", () => {
    expect(
      converse(boolean(true), variable("x")),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns the left operand if the right is true", () => {
    expect(
      converse(variable("x"), boolean(true)),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the complement of the right if the left is false", () => {
    expect(
      converse(boolean(false), variable("x")),
    ).toEqual(
      not(variable("x")),
    );
  });

  it("returns true if the right operand is false", () => {
    expect(
      converse(variable("x"), boolean(false)),
    ).toEqual(
      boolean(true),
    );
  });

  it("is a ConverseImplication for unbound input", () => {
    expect(
      converse(variable("x"), variable("y")),
    ).toEqual(
      new ConverseImplication(new Variable("x"), new Variable("y")),
    );
  });
});
