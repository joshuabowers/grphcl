import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Disjunction, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { or } from "./disjunction.ts";

describe("or", () => {
  it("is a Disjunction for unbound input", () => {
    expect(
      or(variable("x"), variable("y")),
    ).toEqual(
      new Disjunction(new Variable("x"), new Variable("y")),
    );
  });
});
