import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Implication, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { variable } from "../variable.ts";
import { not } from "../not.ts";
import { implies } from "./implication.ts";

describe("implies", () => {
  it("returns true when given two true things", () => {
    expect(
      implies(boolean(true), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if the left argument is false", () => {
    expect(
      implies(boolean(false), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false if the right argument is false", () => {
    expect(
      implies(boolean(true), boolean(false)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true if both arguments are false", () => {
    expect(
      implies(boolean(false), boolean(false)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns the right operand if the left is true", () => {
    expect(
      implies(boolean(true), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns true if the right operand is true", () => {
    expect(
      implies(variable("x"), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if the left operand is false", () => {
    expect(
      implies(boolean(false), variable("x")),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns the complement of the left if the right is false", () => {
    expect(
      implies(variable("x"), boolean(false)),
    ).toEqual(
      not(variable("x")),
    );
  });

  it("is a Implication for unbound input", () => {
    expect(
      implies(variable("x"), variable("y")),
    ).toEqual(
      new Implication(new Variable("x"), new Variable("y")),
    );
  });
});
