import { createSignal } from "solid-js";
// import { add, real } from "@bowers/mthmtcl/functions";
// import solidLogo from "./assets/solid.svg";
// import viteLogo from "./assets/vite.svg";
// import heroImg from "./assets/hero.png";
import { Header } from "./Header.tsx";
import { Graph } from "./Graph.tsx";
import { Terminal } from "./Terminal.tsx";
import { Keypad } from "./Keypad.tsx";
import "./App.css";

function App() {
  const [_count, _setCount] = createSignal(0);

  return (
    <main>
      <Header />
      <Graph />
      <Terminal />
      <Keypad />
    </main>
  );
}

export default App;
