import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Complement, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { complex } from "../complex.ts";
import { real } from "../real.ts";
import { variable } from "../variable.ts";
import { not } from "./complement.ts";
import { and } from "./conjunction.ts";
import { or } from "./disjunction.ts";
import { xor } from "./exclusiveDisjunction.ts";
import { implies } from "./implication.ts";
import { nand } from "./alternativeDenial.ts";
import { nor } from "./jointDenial.ts";
import { xnor } from "./biconditional.ts";
import { converse } from "./converseImplication.ts";

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

  it("rewrites double negations as the inner expression", () => {
    expect(
      not(not(variable("x"))),
    ).toEqual(
      variable("x"),
    );
  });

  it("returns an alternative denial when given a conjunction", () => {
    expect(
      not(and(variable("x"), variable("y"))),
    ).toEqual(
      nand(variable("x"), variable("y")),
    );
  });

  it("returns a conjunction if given an alternative denial", () => {
    expect(
      not(nand(variable("x"), variable("y"))),
    ).toEqual(
      and(variable("x"), variable("y")),
    );
  });

  it("returns a joint denial if given a disjunction", () => {
    expect(
      not(or(variable("x"), variable("y"))),
    ).toEqual(
      nor(variable("x"), variable("y")),
    );
  });

  it("returns a disjunction if given a joint denial", () => {
    expect(
      not(nor(variable("x"), variable("y"))),
    ).toEqual(
      or(variable("x"), variable("y")),
    );
  });

  it("returns a biconditional if given an exclusive disjunction", () => {
    expect(
      not(xor(variable("x"), variable("y"))),
    ).toEqual(
      xnor(variable("x"), variable("y")),
    );
  });

  it("returns a conjunction if given an implication", () => {
    expect(
      not(implies(variable("x"), variable("y"))),
    ).toEqual(
      and(variable("x"), not(variable("y"))),
    );
  });

  it("returns an exclusive disjunction if given a biconditional", () => {
    expect(
      not(xnor(variable("x"), variable("y"))),
    ).toEqual(
      xor(variable("x"), variable("y")),
    );
  });

  it("returns a conjunction if given a converse implication", () => {
    expect(
      not(converse(variable("x"), variable("y"))),
    ).toEqual(
      and(not(variable("x")), variable("y")),
    );
  });

  it("is a Complement for unbound input", () => {
    expect(not(variable("x"))).toEqual(
      new Complement(new Variable("x")),
    );
  });
});
