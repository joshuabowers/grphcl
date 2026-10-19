import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { changeRate, ChangeRates } from "./changeRate.ts";
import { variable } from "../functions/variable.ts";

describe("changeRate", () => {
  it("is constant for a variable", () => {
    expect(changeRate(variable("x"))).toBe(ChangeRates.Constant);
  });

  it("is linear for ");
});
