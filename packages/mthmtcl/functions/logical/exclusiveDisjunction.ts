import {
  Boolean,
  ExclusiveDisjunction,
  Numeric,
  TreeNode,
} from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { not } from "../not.ts";
import { and } from "./conjunction.ts";
import { or } from "./disjunction.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";

export const xor: BinaryFn<
  ExclusiveDisjunction,
  Boolean
> = binary(ExclusiveDisjunction, Boolean)(
  when([is(Numeric), is(Numeric)], (l, r) => [
    and(or(l, r), not(and(l, r))),
    Action.Application,
  ]),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [l, Action.Identity],
  ),
  when(
    [isValue(boolean(true)), is(TreeNode)],
    (_l, r) => [not(r), Action.Conversion],
  ),
  when(
    [is(TreeNode), isValue(boolean(true))],
    (l, _r) => [not(l), Action.Conversion],
  ),
  when(
    deepEquals,
    [boolean(false), Action.Annihilator],
  ),
);
