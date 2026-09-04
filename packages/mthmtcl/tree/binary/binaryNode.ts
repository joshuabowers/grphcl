import { TreeNode } from "../treeNode.ts";

/**
 * Represents functions and operators which operate on
 * two children.
 */
export class BinaryNode extends TreeNode {
  /**
   * Creates a new BinaryNode, setting its children
   * @param left The left expression this node operates on
   * @param right The right expression this node operates on
   */
  constructor(readonly left: TreeNode, readonly right: TreeNode) {
    super();
  }
}
