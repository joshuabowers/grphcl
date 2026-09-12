import {
  Boolean,
  Complement,
  Complex,
  Conjunction,
  Disjunction,
  Real,
  TreeNode,
} from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { converse } from "./converseImplication.ts";
import { implies } from "./implication.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";

export const or: BinaryFn<
  Disjunction,
  Boolean
> = binary(Disjunction, Boolean)(
  when(
    [is(Boolean), is(Boolean)],
    (l, r) => [boolean(l.raw || r.raw), Action.Application],
  ),
  when([is(Complex), is(Complex)], (l, r) => [
    boolean(
      l.raw.a !== 0 || l.raw.b !== 0 ||
        r.raw.a !== 0 || r.raw.b !== 0,
    ),
    Action.Application,
  ]),
  when(
    [is(Real), is(Real)],
    (l, r) => [boolean(l.raw !== 0 || r.raw !== 0), Action.Application],
  ),
  when(
    [_, isValue(boolean(false))],
    (l, _r) => [l, Action.Identity],
  ),
  when(
    [isValue(boolean(false)), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    [_, isValue(boolean(true))],
    [boolean(true), Action.Annihilator],
  ),
  when(
    [isValue(boolean(true)), _],
    [boolean(true), Action.Annihilator],
  ),
  when(
    deepEquals,
    (l, _r) => [l, Action.Idempotency],
  ),
  when(
    (l, r) => is(Conjunction)(r) && deepEquals(l, r.left),
    (l, _r) => [l, Action.Absorption],
  ),
  when(
    (l, r) => is(Conjunction)(r) && deepEquals(l, r.right),
    (l, _r) => [l, Action.Absorption],
  ),
  when(
    (l, r) => is(Conjunction)(l) && deepEquals(l.left, r),
    (_l, r) => [r, Action.Absorption],
  ),
  when(
    (l, r) => is(Conjunction)(l) && deepEquals(l.right, r),
    (_l, r) => [r, Action.Absorption],
  ),
  when(
    (l, r) => is(Complement)(r) && deepEquals(l, r.child),
    [boolean(true), Action.Tautology],
  ),
  when(
    (l, r) => is(Complement)(l) && deepEquals(l.child, r),
    [boolean(true), Action.Tautology],
  ),
  when(
    [is(Complement), _],
    (l, r) => [
      implies(l.child, r),
      Action.Conversion,
    ],
  ),
  when(
    [_, is(Complement)],
    (l, r) => [
      converse(l, r.child),
      Action.Conversion,
    ],
  ),
);
