import { useAppState } from "./AppProvider.tsx";
import { Highlight } from "./Highlight.tsx";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import styles from "./Terminal.module.css";

export const Terminal = () => {
  const state = useAppState();
  const [currentRef, setCurrentRef] = createSignal<HTMLSpanElement>();
  const handleRef = (node: HTMLSpanElement) => setCurrentRef(node);

  createEffect(() => {
    console.log("currentRef:", currentRef());
    currentRef()?.scrollIntoView({ "behavior": "smooth" });
  });

  return (
    <div class={styles.terminal}>
      <For each={state.history}>
        {(item, index) => (
          <>
            {state.focus === index() &&
              <span ref={handleRef} class={styles.reference} />}
            <header class={styles.markerTrack}>
              <h2 class={styles.marker} />
            </header>
            <div class={styles.entry}>
              <div class={styles.input}>
                <Show when={!!item.input} fallback={<span>{item.source}</span>}>
                  <Highlight expression={item.input} />
                </Show>
              </div>
              <Switch>
                <Match when={!!item.output}>
                  <div class={styles.output}>
                    <Highlight expression={item.output} />
                  </div>
                </Match>
                <Match when={!!item.error}>
                  <div class={styles.error}>
                    {item.error}
                  </div>
                </Match>
              </Switch>
            </div>
          </>
        )}
      </For>
      {state.focus === undefined && (
        <span ref={handleRef} class={styles.reference} />
      )}
      <h2 class={styles.currentMarker} />
      <div class={styles.currentLine}>
        {state.currentLine.join("")}
        <span class={styles.caret}>|</span>
      </div>
    </div>
  );
};
