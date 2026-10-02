import { useAppState } from "./AppProvider.tsx";
import { Highlight } from "./Highlight.tsx";
import { For } from "solid-js";
import styles from "./Terminal.module.css";

export const Terminal = () => {
  const state = useAppState();
  return (
    <div class={styles.terminal}>
      <For each={state.history}>
        {(item) => (
          <div class={styles.entry}>
            <div class={styles.input}>
              <Highlight expression={item.input} />
            </div>
            <div class={styles.output}>
              <Highlight expression={item.output} />
            </div>
          </div>
        )}
      </For>
      <div class={styles.currentLine}>
        {state.currentLine.join("")}
        <span class={styles.caret}>|</span>
      </div>
    </div>
  );
};
