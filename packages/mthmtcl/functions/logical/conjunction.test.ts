import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Conjunction, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { or } from "./disjunction.ts";
import { not } from "../not.ts";
import { and } from "./conjunction.ts";

describe("and", () => {
  it("returns true when given two true things", () => {
    expect(
      and(boolean(true), boolean(true)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns false if the left argument is false", () => {
    expect(
      and(boolean(false), boolean(true)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false if the right argument is false", () => {
    expect(
      and(boolean(true), boolean(false)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false if both arguments are false", () => {
    expect(
      and(boolean(false), boolean(false)),
    ).toEqual(
      boolean(false),
    );
  });

  it("casts reals to booleans, where 0 is false, non-zero is true", () => {
    expect(
      and(real(5), real(0)),
    ).toEqual(
      boolean(false),
    );
  });

  it("casts complexes to booleans, 0 => false, non-0 => true", () => {
    expect(
      and(complex(5, 0), complex(0, 0)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns the left operand if the right is true", () => {
    expect(
      and(variable("x"), boolean(true)),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the right operand if the left is true", () => {
    expect(
      and(boolean(true), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the false if the right operand is false", () => {
    expect(
      and(variable("x"), boolean(false)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false if the left operand is false", () => {
    expect(
      and(boolean(false), variable("x")),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns the left operand if left equivalent to right", () => {
    expect(
      and(variable("x"), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  // See (e.g.): https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws
  // x | y | x or y | x and (x or y) | x and x | x and y | (x and x) or (x and y)
  // ----------------------------------------------------------------------------
  // F | F | F      | F              | F       | F       | F
  // F | T | T      | F              | F       | F       | F
  // T | F | T      | T              | T       | F       | T
  // T | T | T      | T              | T       | T       | T
  it("returns the left operand if the right is a Disjunction of the left", () => {
    expect(
      and(variable("x"), or(variable("x"), variable("y"))),
    ).toEqual(
      variable("x"),
    );
    expect(
      and(variable("x"), or(variable("y"), variable("x"))),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns the right operand if the left is a Disjunction of the right", () => {
    expect(
      and(or(variable("x"), variable("y")), variable("x")),
    ).toEqual(
      variable("x"),
    );
    expect(
      and(or(variable("y"), variable("x")), variable("x")),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns false if the right operand is the negation of the left", () => {
    expect(
      and(variable("x"), not(variable("x"))),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false if the left operand is the negation of the right", () => {
    expect(
      and(not(variable("x")), variable("x")),
    ).toEqual(
      boolean(false),
    );
  });

  it("is a Conjunction for unbound input", () => {
    expect(
      and(variable("x"), variable("y")),
    ).toEqual(
      new Conjunction(new Variable("x"), new Variable("y")),
    );
  });
});
