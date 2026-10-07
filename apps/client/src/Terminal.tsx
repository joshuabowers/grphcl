import { useAppActions, useAppState } from "./AppProvider.tsx";
import { Highlight } from "./Highlight.tsx";
import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { deepEquals } from "@bowers/mthmtcl";
import styles from "./Terminal.module.css";

export const Terminal = () => {
  const state = useAppState();
  const actions = useAppActions();
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
              <div class={styles.entryControls}>
                <button type="button" disabled>
                  &#9677;
                </button>
                <button type="button" onclick={() => actions.forget(index())}>
                  {"\u{2716}"}
                </button>
              </div>
              <Show
                when={item.input && item.output &&
                  !deepEquals(item.input, item.output)}
              >
                <div class={styles.input}>
                  <Show
                    when={!!item.input}
                    fallback={<span>{item.source}</span>}
                  >
                    <Highlight expression={item.input} />
                  </Show>
                </div>
              </Show>
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
