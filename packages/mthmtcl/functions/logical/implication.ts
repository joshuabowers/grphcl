import { Boolean, Implication, Numeric } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { _ } from "@arrows/multimethod";
import { boolean } from "../boolean.ts";
import { isValue } from "../../utility/deepEquals.ts";
import { not } from "./complement.ts";
import { or } from "./disjunction.ts";

export const implies: BinaryFn<
  Implication,
  Boolean
> = binary(Implication, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    or(not(l), r),
    Action.Application,
  ]),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    [_, isValue(boolean(true))],
    [boolean(true), Action.Annihilator],
  ),
  when(
    [isValue(boolean(false)), _],
    [boolean(true), Action.Annihilator],
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [
      not(l),
      Action.Conversion,
    ],
  ),
);
