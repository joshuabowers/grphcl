// import { TreeNode } from "../treeNode.ts";
import { Numeric } from "./numeric.ts";

/**
 * Represents data types representable by the library.
 * @template Internal the type used to store the internal representation this wraps
 */
export class Field<Internal> extends Numeric {
  /**
   * Creates a new Type node, setting its raw internal value
   * @param raw The raw, internal representation of this node.
   */
  constructor(readonly raw: Internal) {
    super();
  }
}
