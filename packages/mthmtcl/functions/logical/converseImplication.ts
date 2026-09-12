import { Boolean, ConverseImplication, Numeric } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { _ } from "@arrows/multimethod";
import { isValue } from "../../utility/deepEquals.ts";
import { not } from "../not.ts";
import { or } from "./disjunction.ts";

export const converse: BinaryFn<
  ConverseImplication,
  Boolean
> = binary(ConverseImplication, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    or(l, not(r)),
    Action.Application,
  ]),
  when(
    [isValue(boolean(true)), _],
    [boolean(true), Action.Annihilator],
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
    [boolean(true), Action.Annihilator],
  ),
);
