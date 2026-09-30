import styles from "./Header.module.css";

export const Header = () => (
  <header class={styles.siteHeader}>
    <h1>grphcl</h1>
    <nav>
      <button type="button">Light</button>
      <button type="button">Settings</button>
    </nav>
  </header>
);
