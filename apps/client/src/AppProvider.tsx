import { createContext, type ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { interpret, type Parsing, type Scope, scope } from "@bowers/mthmtcl";

export interface AppState {
  scope: Scope;
  history: Parsing[];
  currentLine: string[];
  focus?: number;
}

export interface AppActions {
  execute(): void;
  deleteLast(): void;
  keyPress(value: string): void;
  forget(index: number): void;
}

const AppStateContext = createContext<AppState>();
const AppActionsContext = createContext<AppActions>();

export const AppProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<AppState>({
    scope: scope(),
    history: [],
    currentLine: [],
    focus: undefined,
  });

  const actions: AppActions = {
    execute() {
      try {
        const parsing = interpret(state.currentLine.join(""), state.scope);
        console.log(parsing);
        setState("currentLine", []);
        setState("focus", state.history.length);
        setState("history", state.history.length, parsing);
        console.log("focus:", state.focus);
      } catch (error) {
        console.error(error);
      }
    },
    deleteLast() {
      setState(
        "currentLine",
        produce((previous) => {
          const removed = previous.pop();
          console.log("removed:", removed);
        }),
      );
      setState("focus", undefined);
      console.log("focus:", state.focus);
    },
    keyPress(value: string) {
      setState("currentLine", state.currentLine.length, value);
      setState("focus", undefined);
      console.log("focus:", state.focus);
    },
    forget(index: number) {
      console.log("forget:", index);
      setState(
        "history",
        (history) => history.filter((_p, i) => i !== index),
      );
    },
  };

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {props.children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
};

export const useAppActions = () => {
  const context = useContext(AppActionsContext);
  if (!context) {
    throw new Error("useAppActions must be used within AppProvider");
  }
  return context;
};
