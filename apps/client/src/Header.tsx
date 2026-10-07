import { useAppActions, useAppState } from "./AppProvider";
import { createEffect } from "solid-js";
import styles from "./Header.module.css";

export const Header = () => {
  const actions = useAppActions();
  const state = useAppState();

  createEffect(() => {
    if (state.scheme) {
      document.body.className = styles[state.scheme];
    }
  });

  return (
    <header class={styles.siteHeader}>
      <h1>grphcl</h1>
      <nav>
        <button
          type="button"
          class={styles.schemeToggle}
          onclick={actions.toggleScheme}
        >
        </button>
        <button type="button">Settings</button>
      </nav>
    </header>
  );
};
