import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { real } from "../functions/real.ts";
import { variable } from "../functions/variable.ts";
import { raise } from "../functions/raise.ts";
import { cos } from "../functions/trigonometric.ts";
import { monolex } from "./monolex.ts";

describe("monolex", () => {
  it("is 0 for [numeric, numeric]", () => {
    expect(monolex(real(5), real(1))).toEqual(0);
  });

  it("is -1 for [numeric, variable]", () => {
    expect(monolex(real(5), variable("x"))).toEqual(-1);
  });

  it("is 1 for [variable, numeric]", () => {
    expect(monolex(variable("x"), real(5))).toEqual(1);
  });

  it("is a lexographic comparison of [variable, variable] on name", () => {
    expect(
      monolex(variable("x"), variable("y")),
    ).toEqual("x".localeCompare("y"));
    expect(
      monolex(variable("y"), variable("x")),
    ).toEqual("y".localeCompare("x"));
    expect(monolex(variable("x"), variable("x"))).toEqual(0);
  });

  it("is a lexographic sort of [variable, exponential(variable)] on name", () => {
    expect(
      monolex(variable("x"), raise(variable("y"), real(2))),
    ).toEqual("x".localeCompare("y"));
  });

  it("is a lexographic sort of [exponential(variable), variable] on name", () => {
    expect(
      monolex(raise(variable("y"), real(2)), variable("x")),
    ).toEqual("y".localeCompare("x"));
  });

  it("is 1 for [variable, exponential(numeric)]", () => {
    expect(
      monolex(variable("x"), raise(real(2), variable("x"))),
    ).toEqual(1);
  });

  it("is -1 for [exponential(numeric), variable]", () => {
    expect(
      monolex(raise(real(2), variable("x")), variable("x")),
    ).toEqual(-1);
  });

  it("is [variable, variable] for [exponential(variable), exponential(variable)]", () => {
    expect(
      monolex(raise(variable("x"), real(2)), raise(variable("y"), real(3))),
    ).toEqual("x".localeCompare("y"));
  });

  it("is -1 for [variable, cos]", () => {
    expect(
      monolex(variable("x"), cos(variable("x"))),
    ).toEqual(-1);
  });

  it("is 1 for [cos, variable]", () => {
    expect(
      monolex(cos(variable("x")), variable("x")),
    ).toEqual(1);
  });

  it("is usable for sorting an array of nodes", () => {
    expect([
      raise(variable("x"), real(2)),
      variable("z"),
      cos(variable("x")),
      variable("y"),
      real(5),
    ].sort(monolex)).toEqual([
      real(5),
      raise(variable("x"), real(2)),
      variable("y"),
      variable("z"),
      cos(variable("x")),
    ]);
  });
});
