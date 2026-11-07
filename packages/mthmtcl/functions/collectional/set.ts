import type { TreeNode } from "../../tree/treeNode.ts";
import { Set } from "../../tree/fields/set.ts";
import { Empty, Rostered } from "../../tree/fields/rostered.ts";
import { Built, type InclusionFn, Universe } from "../../tree/fields/built.ts";
export { Universe };
export { Empty };

export interface SetFn {
  (...roster: TreeNode[]): Set;
  (inclusion: InclusionFn, superset?: Set): Set;
}

export const set: SetFn = (first, ...args) => {
  if (typeof first === "function") {
    return new Built(
      first,
      (args[0] instanceof Set) ? args[0] : undefined,
    );
  } else {
    const elements = [first, ...args].filter((i) => i !== undefined);
    return new Rostered(...elements);
  }
};
