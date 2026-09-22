import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { variable } from "../functions/variable.ts";
import { $add } from "../functions/add.ts";
import { $raise } from "../functions/raise.ts";
import { cos } from "../functions/trigonometric.ts";
import { parameterize } from "./parameterization.ts";

describe("parameterize", () => {
  it("returns a variable name", () => {
    expect(parameterize(variable("x"))).toEqual(new Set("x"));
  });

  it("returns variables within binaries", () => {
    expect(parameterize($raise(variable("x"), variable("y")))).toEqual(
      new Set(["x", "y"]),
    );
  });

  it("returns variables within unary functions", () => {
    expect(parameterize(cos(variable("x")))).toEqual(new Set("x"));
  });

  it("returns a single name for a variable encountered twice", () => {
    expect(
      parameterize($add(variable("x"), cos(variable("x")))),
    ).toEqual(new Set("x"));
  });

  it("returns multiple variables in alphabetical order", () => {
    expect(
      parameterize(
        $add($add(variable("x"), variable("y")), cos(variable("x"))),
      ),
    ).toEqual(new Set(["x", "y"]));
    expect(
      parameterize(
        $add($add(variable("y"), variable("x")), cos(variable("x"))),
      ),
    ).toEqual(new Set(["x", "y"]));
  });
});
