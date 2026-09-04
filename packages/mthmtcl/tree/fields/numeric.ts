import { TreeNode } from "../treeNode.ts";

/**
 * A utility class for representing numeric values; this
 * is primarily used internally to act as a non-generic base
 * class for concrete numeric types.
 */
export class Numeric extends TreeNode {
  constructor() {
    super();
  }
}
