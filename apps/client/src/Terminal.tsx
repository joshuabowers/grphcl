import { createEffect } from "solid-js";
import { interpret } from "@bowers/mthmtcl";

export const Terminal = () => {
  createEffect(() => {
    console.log(interpret("x+x*x+x"));
  });
  return (
    <div>
    </div>
  );
};
