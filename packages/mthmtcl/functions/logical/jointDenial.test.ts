import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { JointDenial, Variable } from "../../tree/mod.ts";
import { boolean } from "../boolean.ts";
import { real } from "../real.ts";
import { complex } from "../complex.ts";
import { variable } from "../variable.ts";
import { nor } from "./jointDenial.ts";

describe("nor", () => {
  it("is a JointDenial for unbound input", () => {
    expect(
      nor(variable("x"), variable("y")),
    ).toEqual(
      new JointDenial(new Variable("x"), new Variable("y")),
    );
  });
});
