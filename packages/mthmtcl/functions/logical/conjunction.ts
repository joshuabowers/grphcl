import {
  Boolean,
  Complement,
  Complex,
  Conjunction,
  Disjunction,
  Real,
} from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { boolean } from "../boolean.ts";
import { _ } from "@arrows/multimethod";
import { deepEquals, isValue } from "../../utility/deepEquals.ts";

export const and: BinaryFn<
  Conjunction,
  Boolean
> = binary(Conjunction, Boolean)(
  when([is(Boolean), is(Boolean)], (l, r) => [
    boolean(l.raw && r.raw),
    Action.Application,
  ]),
  when([is(Complex), is(Complex)], (l, r) => [
    boolean(
      (l.raw.a !== 0 || l.raw.b !== 0) &&
        (r.raw.a !== 0 || r.raw.b !== 0),
    ),
    Action.Application,
  ]),
  when([is(Real), is(Real)], (l, r) => [
    boolean(l.raw !== 0 && r.raw !== 0),
    Action.Application,
  ]),
  when(
    [_, isValue(boolean(true))],
    (l, _r) => [l, Action.Identity],
  ),
  when(
    [isValue(boolean(true)), _],
    (_l, r) => [r, Action.Identity],
  ),
  when(
    [_, isValue(boolean(false))],
    [boolean(false), Action.Annihilator],
  ),
  when(
    [isValue(boolean(false)), _],
    [boolean(false), Action.Annihilator],
  ),
  when(
    deepEquals,
    (l, _r) => [l, Action.Idempotency],
  ),
  when(
    (l, r) => is(Disjunction)(r) && deepEquals(l, r.left),
    (l, _r) => [l, Action.Absorption],
  ),
  when(
    (l, r) => is(Disjunction)(r) && deepEquals(l, r.right),
    (l, _r) => [l, Action.Absorption],
  ),
  when(
    (l, r) => is(Disjunction)(l) && deepEquals(l.left, r),
    (_l, r) => [r, Action.Absorption],
  ),
  when(
    (l, r) => is(Disjunction)(l) && deepEquals(l.right, r),
    (_l, r) => [r, Action.Absorption],
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
