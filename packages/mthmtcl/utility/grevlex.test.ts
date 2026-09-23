import { describe, it } from "node:test";
import { expect } from "@std/expect";
import { $real } from "../functions/real.ts";
import { variable } from "../functions/variable.ts";
import { $add } from "../functions/add.ts";
import { $multiply } from "../functions/multiply.ts";
import { $square } from "../functions/raise.ts";
import { $cos } from "../functions/trigonometric.ts";
import { grevlex } from "./grevlex.ts";

describe("grevlex", () => {
  it("is -1 for [x, y]", () => {
    expect(grevlex(variable("x"), variable("y"))).toEqual(-1);
  });

  it("sorts by total order leftward when non-equal", () => {
    expect(
      grevlex(variable("x"), $square(variable("y"))),
    ).toEqual(1);
  });

  it("is 1 for [xy, x ** 2]", () => {
    expect(
      grevlex(
        $multiply(variable("x"), variable("y")),
        $square(variable("x")),
      ),
    ).toEqual(1);
  });

  it("is -1 for [xy, y ** 2]", () => {
    expect(
      grevlex(
        $multiply(variable("x"), variable("y")),
        $square(variable("y")),
      ),
    ).toEqual(-1);
  });

  it("is 1 for [z ** 2, x ** 2]", () => {
    expect(
      grevlex(
        $square(variable("z")),
        $square(variable("x")),
      ),
    ).toEqual(1);
  });

  it("is 0 for [_, addition]", () => {
    expect(
      grevlex(
        variable("x"),
        $add(variable("x"), variable("y")),
      ),
    ).toEqual(0);
  });

  it("is 0 for [addition, _]", () => {
    expect(
      grevlex(
        $add(variable("x"), variable("y")),
        variable("x"),
      ),
    ).toEqual(0);
  });

  it("is 1 for [numeric, variable]", () => {
    expect(grevlex($real(5), variable("x"))).toEqual(1);
  });

  it("is -1 for [variable, numeric]", () => {
    expect(grevlex(variable("x"), $real(5))).toEqual(-1);
  });

  it("is 1 for [cos, variable]", () => {
    expect(grevlex($cos(variable("x")), variable("x"))).toEqual(1);
  });

  it("is -1 for [variable, cos]", () => {
    expect(grevlex(variable("x"), $cos(variable("x")))).toEqual(-1);
  });

  it("is 1 for [numeric, cos]", () => {
    expect(grevlex($real(5), $cos(variable("x")))).toEqual(1);
  });

  it("is -1 for [cos, numeric]", () => {
    expect(grevlex($cos(variable("x")), $real(5))).toEqual(-1);
  });

  it("is usable for sorting an array of nodes", () => {
    expect([
      $square(variable("y")),
      $square(variable("z")),
      $square(variable("x")),
      $multiply(variable("x"), variable("z")),
      $multiply(variable("x"), variable("y")),
      $multiply(variable("y"), variable("z")),
    ].sort(grevlex)).toEqual([
      $square(variable("x")),
      $multiply(variable("x"), variable("y")),
      $square(variable("y")),
      $multiply(variable("x"), variable("z")),
      $multiply(variable("y"), variable("z")),
      $square(variable("z")),
    ]);
  });
});
