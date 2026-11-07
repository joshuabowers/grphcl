import { BinaryNode } from "../binaryNode.ts";
import type { Set } from "../../fields/set.ts";

export class Union extends BinaryNode {
  constructor(left: Set, right: Set) {
    super(left, right);
  }

  override get fnName(): string {
    return "union";
  }
}
