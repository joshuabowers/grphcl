import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Disjunction, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { not } from "../not.ts";
import { and } from "./conjunction.ts";
import { implies } from "./implication.ts";
import { converse } from "./converseImplication.ts";
import { or } from "./disjunction.ts";

describe("or", () => {
  it("returns true when given two true things", () => {
    expect(
      or(boolean(true), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if the left argument is true", () => {
    expect(
      or(boolean(true), boolean(false)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if the right argument is true", () => {
    expect(
      or(boolean(false), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false if both arguments are false", () => {
    expect(
      or(boolean(false), boolean(false)),
    ).toEqual(
      boolean(false),
    );
  });

  it("casts reals to booleans, where 0 is false, non-zero is true", () => {
    expect(
      or(real(5), real(0)),
    ).toEqual(
      boolean(true),
    );
  });

  it("casts complexes to booleans, 0 => false, non-zero => true", () => {
    expect(
      or(complex(5, 0), complex(0, 0)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns the left operand if the right is false", () => {
    expect(
      or(variable("x"), boolean(false)),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the right operand if the left is false", () => {
    expect(
      or(boolean(false), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns true if the right operand is true", () => {
    expect(
      or(variable("x"), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if the left operand is true", () => {
    expect(
      or(boolean(true), variable("x")),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns the left operand if left is equivalent to right", () => {
    expect(
      or(variable("x"), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the left operand if the right is a left-child Conjunction of the left", () => {
    expect(
      or(variable("x"), and(variable("x"), variable("y"))),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the left operand if the right is a right-child Conjunction of the left", () => {
    expect(
      or(variable("x"), and(variable("y"), variable("x"))),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the right operand if the left is a left-child Conjunction of the right", () => {
    expect(
      or(and(variable("x"), variable("y")), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the right operand if the left is a right-child Conjunction of the right", () => {
    expect(
      or(and(variable("y"), variable("x")), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns true if the right operand is the negation of the left", () => {
    expect(
      or(variable("x"), not(variable("x"))),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns true if the left operand is the negation of the right", () => {
    expect(
      or(not(variable("x")), variable("x")),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns an implication if the left operand is a complement", () => {
    expect(
      or(not(variable("x")), variable("y")),
    ).toEqual(
      implies(variable("x"), variable("y")),
    );
  });

  it("returns a converse if the right operand is a complement", () => {
    expect(
      or(variable("x"), not(variable("y"))),
    ).toEqual(
      converse(variable("x"), variable("y")),
    );
  });

  it("is a Disjunction for unbound input", () => {
    expect(
      or(variable("x"), variable("y")),
    ).toEqual(
      new Disjunction(new Variable("x"), new Variable("y")),
    );
  });
});
