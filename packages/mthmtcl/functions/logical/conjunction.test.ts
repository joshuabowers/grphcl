import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { Conjunction, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { and } from "./conjunction.ts";

describe("and", () => {
  it("is a Conjunction for unbound input", () => {
    expect(
      and(variable("x"), variable("y")),
    ).toEqual(
      new Conjunction(new Variable("x"), new Variable("y")),
    );
  });
});
