import { Boolean, Complement, JointDenial, Numeric } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";
import { not } from "../not.ts";
import { and } from "./conjunction.ts";
import { or } from "./disjunction.ts";

export const nor: BinaryFn<
  JointDenial,
  Boolean
> = binary(JointDenial, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    not(or(l, r)),
    Action.Application,
  ]),
  when(
    [_, isValue(boolean(true))],
    [boolean(false), Action.Annihilator],
  ),
  when(
    [isValue(boolean(true)), _],
    [boolean(false), Action.Annihilator],
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [not(l), Action.Conversion],
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [not(r), Action.Conversion],
  ),
  when(
    deepEquals,
    (l, _r) => [not(l), Action.Conversion],
  ),
  when(
    [is(Complement), is(Complement)],
    (l, r) => [
      and(l.child, r.child),
      Action.DeMorgan,
    ],
  ),
  when(
    (l, r) => is(Complement)(r) && deepEquals(l, r.child),
    [boolean(false), Action.Contradiction],
  ),
  when(
    (l, r) => is(Complement)(l) && deepEquals(l.child, r),
    [boolean(false), Action.Contradiction],
  ),
);
