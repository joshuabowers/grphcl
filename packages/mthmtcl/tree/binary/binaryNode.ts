import { TreeNode } from "../treeNode.ts";

/**
 * Represents functions and operators which operator on
 * two children.
 */
export class BinaryNode extends TreeNode {
  /** The left child of the operation */
  readonly left: TreeNode;
  /** The right child of the operation */
  readonly right: TreeNode;

  /**
   * Creates a new BinaryNode, setting its children
   * @param left The left expression this node operates on
   * @param right The right expression this node operates on
   */
  constructor(left: TreeNode, right: TreeNode) {
    super();
    this.left = left;
    this.right = right;
  }
}
