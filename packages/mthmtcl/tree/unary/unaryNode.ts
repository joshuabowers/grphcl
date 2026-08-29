import { TreeNode } from "../treeNode.ts";

/**
 * Represents functions and operators which have a single
 * expression they operate upon.
 */
export class UnaryNode extends TreeNode {
  /** The child expression of the UnaryNode */
  readonly child: TreeNode;

  /**
   * Creates a new UnaryNode, setting its child
   * @param child An expression this node operates upon
   */
  constructor(child: TreeNode) {
    super();
    this.child = child;
  }
}
