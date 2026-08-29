import { TreeNode } from "../treeNode.ts";

/**
 * Represents data types representable by the library.
 * @template Internal the type used to store the internal representation this wraps
 */
export class Type<Internal> extends TreeNode {
  /** The raw, internal representation of this node. */
  readonly raw: Internal;

  /**
   * Creates a new Type node, setting its raw internal value
   * @param raw The raw data to wrap
   */
  constructor(raw: Internal) {
    super();
    this.raw = raw;
  }
}
