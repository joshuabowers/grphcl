import type { MathFn } from "../../factories/factory.ts";

import { type BinaryNode, Set, Union } from "../../tree/mod.ts";
import { binary } from "../../factories/binary.ts";

export interface BinarySetFn<T extends BinaryNode>
  extends MathFn<T, [Set, Set]> {
}

export const union: BinarySetFn<Union> = binary(Union, Set)();
