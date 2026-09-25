import { describe, it } from "node:test";
import { expect } from "@std/expect";
import {
  Addition,
  Division,
  Exponentiation,
  Multiplication,
  Negation,
} from "../tree/mod.ts";
import { real, scope, variable } from "../functions/mod.ts";
import { interpret } from "./interpret.ts";

describe("interpret", () => {
  it("produces a Parsing, capturing source, input and output", () => {
    const parsing = interpret("5");
    expect(parsing).toBeDefined();
    expect(parsing.source).toEqual("5");
    expect(parsing.input).toEqual(real(5));
    expect(parsing.output).toEqual(real(5));
  });

  it("performs numerical analysis", () => {
    const parsing = interpret("1 + 5 * 10");
    expect(parsing.input).toEqual(
      new Addition(
        real(1),
        new Multiplication(
          real(5),
          real(10),
        ),
      ),
    );
    expect(parsing.output).toEqual(real(51));
  });

  it("performs algebraic analysis", () => {
    const parsing = interpret("x ** 2 / x");
    expect(parsing.input).toEqual(
      new Division(
        new Exponentiation(
          variable("x"),
          real(2),
        ),
        variable("x"),
      ),
    );
    expect(parsing.output).toEqual(variable("x"));
  });

  it("performs canonicalization", () => {
    const parsing = interpret("x ** -1");
    expect(parsing.input).toEqual(
      new Exponentiation(
        variable("x"),
        new Negation(real(1)),
      ),
    );
    expect(parsing.output).toEqual(
      new Division(real(1), variable("x")),
    );
  });

  it("performs commutative sorting", () => {
    const parsing = interpret("2 + x * 3");
    expect(parsing.input).toEqual(
      new Addition(
        real(2),
        new Multiplication(
          variable("x"),
          real(3),
        ),
      ),
    );
    expect(parsing.output).toEqual(
      new Addition(
        new Multiplication(
          real(3),
          variable("x"),
        ),
        real(2),
      ),
    );
  });

  it("consumes a passed scope", () => {
    const s = scope([["x", real(10)]]);
    const parsing = interpret("x ** 2", s);
    expect(parsing.input).toEqual(
      new Exponentiation(
        variable("x"),
        real(2),
      ),
    );
    expect(parsing.output).toEqual(real(100));
  });
});
