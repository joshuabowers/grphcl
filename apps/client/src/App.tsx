import { createSignal } from "solid-js";
import { AppProvider } from "./AppProvider.tsx";
import { Header } from "./Header.tsx";
import { Graph } from "./Graph.tsx";
import { Terminal } from "./Terminal.tsx";
import { Keypad } from "./Keypad.tsx";
import "./App.css";

function App() {
  const [_count, _setCount] = createSignal(0);

  return (
    <AppProvider>
      <main class="calculator">
        <Header />
        <Graph />
        <Terminal />
        <Keypad />
      </main>
    </AppProvider>
  );
}

export default App;
