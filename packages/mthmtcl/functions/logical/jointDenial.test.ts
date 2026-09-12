import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { JointDenial, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { variable } from "../variable.ts";
import { not } from "../not.ts";
import { and } from "./conjunction.ts";
import { nor } from "./jointDenial.ts";

describe("nor", () => {
  it("returns false when given two true things", () => {
    expect(
      nor(boolean(true), boolean(true)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false if the left argument is false", () => {
    expect(
      nor(boolean(false), boolean(true)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false if the right argument is false", () => {
    expect(
      nor(boolean(true), boolean(false)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns true if both arguments are false", () => {
    expect(
      nor(boolean(false), boolean(false)),
    ).toEqual(
      boolean(true),
    );
  });

  it("returns the complement of the left operand if the right is false", () => {
    expect(
      nor(variable("x"), boolean(false)),
    ).toEqual(
      not(variable("x")),
    );
  });

  it("returns the complement of the right operand if the left is false", () => {
    expect(
      nor(boolean(false), variable("x")),
    ).toEqual(
      not(variable("x")),
    );
  });

  it("returns false if the right operand is true", () => {
    expect(
      nor(variable("x"), boolean(true)),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false if the left operand is true", () => {
    expect(
      nor(boolean(true), variable("x")),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns the complement of the left operand if left is equivalent to right", () => {
    expect(
      nor(variable("x"), variable("x")),
    ).toEqual(
      not(variable("x")),
    );
  });

  it("returns a conjunction of mutually complemented operands", () => {
    expect(
      nor(not(variable("x")), not(variable("y"))),
    ).toEqual(
      and(variable("x"), variable("y")),
    );
  });

  it("returns false if the right operand is the complement of the left", () => {
    expect(
      nor(variable("x"), not(variable("x"))),
    ).toEqual(
      boolean(false),
    );
  });

  it("returns false if the left operand is the complement of the right", () => {
    expect(
      nor(not(variable("x")), variable("x")),
    ).toEqual(
      boolean(false),
    );
  });

  it("is a JointDenial for unbound input", () => {
    expect(
      nor(variable("x"), variable("y")),
    ).toEqual(
      new JointDenial(new Variable("x"), new Variable("y")),
    );
  });
});
