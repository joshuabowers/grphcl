import { createMemo, createSignal, Index } from "solid-js";
import styles from "./Keypad.module.css";
import { Unicode } from "@bowers/mthmtcl";

type DistinctMode =
  | "main"
  | "alphaMega"
  | "alphaMinor"
  | "trig"
  | "shift"
  | "logic"
  | "alt"
  | "constant";

type PadMode =
  | DistinctMode
  | "all"
  | DistinctMode[];

interface KeyProp {
  cell: string;
  mode: PadMode;
  display: string;
  isToggle: boolean;
  isEnabled: boolean;
  replaceWith?: string;
  command?: () => void;
}

const key = (
  cell: string,
  mode: PadMode,
  display: string,
  isToggle: boolean = false,
  isEnabled: boolean = true,
  replaceWith?: string,
  command?: () => void,
): KeyProp => ({
  cell,
  mode,
  display,
  isToggle,
  isEnabled,
  replaceWith,
  command,
});

// NB: order matters: commands, toggles, everything else.
//     alphas auto layout, so _ needs to be after.
const allKeys: KeyProp[] = [
  key("delete", "all", Unicode.delete, false, true, undefined, () => {
    console.log("Baleeted!");
  }),
  key("execute", "all", "EXE", false, true, undefined, () => {
    console.log("EXE'd!");
  }),

  key("trig", "all", Unicode.angle, true),
  key("logic", "all", Unicode.logic, true),
  key("shift", "all", Unicode.shift, true),
  key("alt", "all", Unicode.alt, true),
  key("constant", "all", Unicode.constant, true),
  key("alphaMega", "all", Unicode.alphaMega, true),
  key("alphaMinor", "all", Unicode.alphaMicron, true),

  key("decimal", "main", "."),
  key("assign", ["main", "alphaMega", "alphaMinor"], ":="),
  key("n0", "main", "0"),
  key("n1", "main", "1"),
  key("n2", "main", "2"),
  key("n3", "main", "3"),
  key("n4", "main", "4"),
  key("n5", "main", "5"),
  key("n6", "main", "6"),
  key("n7", "main", "7"),
  key("n8", "main", "8"),
  key("n9", "main", "9"),
  key("raise", "main", "**"),
  key("divide", "main", "/"),
  key("multiply", "main", "*"),
  key("subtract", "main", "-"),
  key("add", "main", "+"),
  key("var", "main", Unicode.x, false, true, "x"),
  key("diff", "main", Unicode.derivative),
  key("ans", "main", "Ans"),
  key("open", "main", "("),
  key("close", "main", ")"),
  key("fact", "main", "!"),
  key("var", "trig", Unicode.theta),
  key("n0", "logic", "false"),
  key("n1", "logic", "true"),
  key("", "logic", "=="),
  key("", "logic", "!="),
  key("", "logic", "<"),
  key("", "logic", ">"),
  key("", "logic", "<="),
  key("", "logic", ">="),
  key("", "logic", Unicode.and),
  key("", "logic", Unicode.or),
  key("", "logic", Unicode.xor),
  key("", "logic", Unicode.implies),
  key("", "logic", Unicode.nand),
  key("", "logic", Unicode.nor),
  key("", "logic", Unicode.xnor),
  key("", "logic", Unicode.converse),
  key("diff", "shift", Unicode.integral),
  key("fact", "shift", Unicode.gamma),
  key("open", "shift", "{"),
  key("close", "shift", "}"),
  key("fact", "alt", Unicode.digamma),
  key("open", "alt", "["),
  key("close", "alt", "]"),
  key("n1", "constant", Unicode.i),
  key("n2", "constant", Unicode.e),
  key("n3", "constant", Unicode.pi),
  key("n0", "constant", Unicode.infinity),
  key("decimal", "constant", Unicode.euler),
  key("assign", "constant", "nil"),
  key("", "alphaMega", "A"),
  key("", "alphaMega", "B"),
  key("", "alphaMega", "C"),
  key("", "alphaMega", "D"),
  key("", "alphaMega", "E"),
  key("", "alphaMega", "F"),
  key("", "alphaMega", "G"),
  key("", "alphaMega", "H"),
  key("", "alphaMega", "I"),
  key("", "alphaMega", "J"),
  key("", "alphaMega", "K"),
  key("", "alphaMega", "L"),
  key("", "alphaMega", "M"),
  key("", "alphaMega", "N"),
  key("", "alphaMega", "O"),
  key("", "alphaMega", "P"),
  key("", "alphaMega", "Q"),
  key("", "alphaMega", "R"),
  key("", "alphaMega", "S"),
  key("", "alphaMega", "T"),
  key("", "alphaMega", "U"),
  key("", "alphaMega", "V"),
  key("", "alphaMega", "W"),
  key("", "alphaMega", "X"),
  key("", "alphaMega", "Y"),
  key("", "alphaMega", "Z"),
  key("", "alphaMinor", "a"),
  key("", "alphaMinor", "b"),
  key("", "alphaMinor", "c"),
  key("", "alphaMinor", "d"),
  key("", "alphaMinor", "e"),
  key("", "alphaMinor", "f"),
  key("", "alphaMinor", "g"),
  key("", "alphaMinor", "h"),
  key("", "alphaMinor", "i"),
  key("", "alphaMinor", "j"),
  key("", "alphaMinor", "k"),
  key("", "alphaMinor", "l"),
  key("", "alphaMinor", "m"),
  key("", "alphaMinor", "n"),
  key("", "alphaMinor", "o"),
  key("", "alphaMinor", "p"),
  key("", "alphaMinor", "q"),
  key("", "alphaMinor", "r"),
  key("", "alphaMinor", "s"),
  key("", "alphaMinor", "t"),
  key("", "alphaMinor", "u"),
  key("", "alphaMinor", "v"),
  key("", "alphaMinor", "w"),
  key("", "alphaMinor", "x"),
  key("", "alphaMinor", "y"),
  key("", "alphaMinor", "z"),
  key("", ["alphaMega", "alphaMinor"], "_"),
  key("", ["alphaMega", "alphaMinor"], Unicode.space, false, true, " "),
  key("", ["alphaMega", "alphaMinor"], ":"),
];

export const Keypad = () => {
  const [mode, setMode] = createSignal<PadMode>("main");
  const selectMode = (m: PadMode): PadMode => mode() === m ? "main" : m;

  const keys = createMemo(() => {
    const processed = allKeys
      .filter((k) =>
        k.mode === "all" || k.mode === mode() ||
        (Array.isArray(k.mode) && k.mode.some((j) => j === mode()))
      )
      .map((k) =>
        k.isToggle
          ? { ...k, command: () => setMode(selectMode(k.cell as PadMode)) }
          : k
      );
    return processed.concat(
      Array(40 - processed.length).fill(
        key("", "all", "", false, false, undefined, undefined),
      ),
    );
  });

  return (
    <div
      classList={{
        [styles.keypad]: true,
      }}
    >
      <Index each={keys()}>
        {(item, _index) => (
          <button
            type="button"
            disabled={!item().isEnabled}
            classList={{
              [styles.currentMode]: mode() === item().cell,
            }}
            style={{ "--cell": item().cell }}
            onclick={item().command ??
              (() => console.log(item().replaceWith ?? item().display))}
          >
            {item().display}
          </button>
        )}
      </Index>
    </div>
  );
};
