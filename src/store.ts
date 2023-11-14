import create from "zustand";
import { persist } from "zustand/middleware";
import { computeGuess, getRandomWord, LetterState } from "./word-utils";

export const NUMBER_OF_GUESSES = 5;
export const WORD_LENGTH = 5;

interface GuessRow {
  guess: string;
  result?: LetterState[];
}

interface StoreState {
  answer: string;
  rows: GuessRow[];
  gameState: "playing" | "won" | "lost";
  newPlayer: number;
  showHelp: number;
  games: number;
  winned: number;
  keyboardLetterState: { [letter: string]: LetterState };
  addGuess(guess: string): void;
  newGame(initialGuess?: string[]): void;
  initGame(initialGuess?: string[]): void;
  showInstructions(status?: number): void;
  setGameState(status?: "playing" | "won" | "lost"): void;
}

export const useStore = create<StoreState>(
  persist(
    (set, get) => {
      const addGuess = (guess: string) => {
        const result = computeGuess(guess, get().answer);

        const rows = get().rows.concat({
          guess,
          result,
        });

        const didWin = result.every((r) => r === LetterState.Match);

        const keyboardLetterState = get().keyboardLetterState;
        result.forEach((r, index) => {
          const resultGuessLetter = guess[index];

          const currentLetterState = keyboardLetterState[resultGuessLetter];
          switch (currentLetterState) {
            case LetterState.Match:
              break;
            case LetterState.Present:
              if (r === LetterState.Miss) {
                break;
              }
            default:
              keyboardLetterState[resultGuessLetter] = r;
              break;
          }
        });
        const infoGame = {
          winned: didWin ? get().winned + 1 : get().winned,
        };
        set({
          rows,
          keyboardLetterState,
          ...infoGame,
          gameState: didWin
            ? "won"
            : rows.length === NUMBER_OF_GUESSES
            ? "lost"
            : "playing",
        });
      };

      return {
        answer: getRandomWord(),
        rows: [],
        gameState: "playing",
        newPlayer: 0,
        showHelp: 1,
        games: 1,
        winned: 0,
        keyboardLetterState: {},
        addGuess,
        newGame(initialRows = []) {
          set({
            games: get().games + 1,
            gameState: "playing",
            answer: getRandomWord(),
            rows: [],
            keyboardLetterState: {},
          });

          initialRows.forEach(addGuess);
        },
        initGame(initialRows = []) {
          set({
            gameState: "playing",
            answer: getRandomWord(),
            rows: [],
            keyboardLetterState: {},
            newPlayer: 1,
            showHelp: 0,
          });

          initialRows.forEach(addGuess);
        },
        showInstructions(status = 1) {
          set({
            showHelp: status,
          });
        },
        setGameState(status = "lost") {
          set({
            gameState: status,
          });
        },
      };
    },
    {
      name: "Wordle",
      getStorage: () => localStorage,
    }
  )
);

// useStore.persist.clearStorage();

export const answerSelector = (state: StoreState) => state.answer;
