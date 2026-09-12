import {
  AlternativeDenial,
  Boolean,
  Complement,
  Numeric,
  type TreeNode,
} from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";
import { boolean } from "../boolean.ts";
import { not } from "./complement.ts";
import { and } from "./conjunction.ts";
import { or } from "./disjunction.ts";
import { implies } from "./implication.ts";

export const nand: BinaryFn<
  AlternativeDenial,
  Boolean
> = binary(AlternativeDenial, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    not(and(l, r)),
    Action.Application,
  ]),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [not(l), Action.Conversion],
  ),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [not(r), Action.Conversion],
  ),
  when(
    [_, isValue(boolean(false))],
    [boolean(true), Action.Annihilator],
  ),
  when(
    [isValue(boolean(false)), _],
    [boolean(true), Action.Annihilator],
  ),
  when(
    deepEquals,
    (l, _r) => [not(l), Action.Conversion],
  ),
  when<TreeNode, AlternativeDenial>(
    (l, r) => is(AlternativeDenial)(r) && deepEquals(l, r.left),
    (l, r) => [implies(l, r.right), Action.Conversion],
  ),
  when<TreeNode, AlternativeDenial>(
    (l, r) => is(AlternativeDenial)(r) && deepEquals(l, r.right),
    (l, r) => [implies(l, r.left), Action.Conversion],
  ),
  when(
    [is(Complement), is(Complement)],
    (l, r) => [or(l.child, r.child), Action.DeMorgan],
  ),
  when(
    (l, r) => is(Complement)(r) && deepEquals(l, r.child),
    [boolean(true), Action.Annihilator],
  ),
  when(
    (l, r) => is(Complement)(l) && deepEquals(l.child, r),
    [boolean(true), Action.Annihilator],
  ),
);
