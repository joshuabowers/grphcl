import { Biconditional, Boolean, Numeric } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";
import { not } from "../not.ts";
import { and } from "./conjunction.ts";
import { implies } from "./implication.ts";

export const xnor: BinaryFn<
  Biconditional,
  Boolean
> = binary(Biconditional, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    and(implies(l, r), implies(r, l)),
    Action.Application,
  ]),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [l, Action.Identity],
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [not(r), Action.Conversion],
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [not(l), Action.Conversion],
  ),
  when(deepEquals, [boolean(true), Action.Annihilator]),
);
