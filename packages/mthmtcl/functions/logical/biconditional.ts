import { Biconditional, Boolean } from "../../tree/mod.ts";
import { Action, is } from "../../factories/factory.ts";
import { binary, type BinaryFn, when } from "../../factories/binary.ts";
import { not } from "../not.ts";

export const xnor: BinaryFn<
  Biconditional,
  Boolean
> = binary(Biconditional, Boolean)();
