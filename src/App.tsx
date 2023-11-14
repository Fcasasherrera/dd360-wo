import { useEffect, useRef, useState } from "react";
import Keyboard from "./Keyboard";
import { useStore, NUMBER_OF_GUESSES, WORD_LENGTH } from "./store";
import { isValidWord } from "./word-utils";
import WordRow from "./WordRow";
import useTimer from "./Timer";
import { darkIcon, lightIcon } from "./icons/Icons";

export default function App() {
  const state = useStore();
  const [guess, setGuess, addGuessLetter] = useGuess();
  const [timer, resetTimer, setStart] = useTimer();
  useEffect(() => {
    if (timer === "00:00") {
      state.setGameState("lost");
    }
  }, [timer]);
  const [showStadistics, setStadistics] = useState(false);
  const [darkMode, setDarkM] = useState(false);

  const [showInvalidGuess, setInvalidGuess] = useState(false);
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (showInvalidGuess) {
      id = setTimeout(() => setInvalidGuess(false), 1500);
    }

    return () => clearTimeout(id);
  }, [showInvalidGuess]);

  const addGuess = useStore((s) => s.addGuess);
  const previousGuess = usePrevious(guess);
  useEffect(() => {
    if (guess.length === 0 && previousGuess?.length === WORD_LENGTH) {
      console.log(isValidWord(previousGuess));
      if (isValidWord(previousGuess)) {
        setInvalidGuess(false);
        addGuess(previousGuess);
      } else {
        setInvalidGuess(true);
        setGuess(previousGuess);
      }
    }
  }, [guess]);

  const isGameOver = state.gameState !== "playing";
  const isNewGame = state.newPlayer === 0 || state.showHelp === 1;

  let rows = [...state.rows];

  let currentRow = 0;
  if (rows.length < NUMBER_OF_GUESSES) {
    currentRow = rows.push({ guess }) - 1;
  }

  const guessesRemaining = NUMBER_OF_GUESSES - rows.length;

  rows = rows.concat(Array(guessesRemaining).fill(""));

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`w-full  ${
          isNewGame || isGameOver || showStadistics ? "bg-transparent" : ""
        } dark:bg-wo-black`}
      >
        <div className="mx-auto w-128 relative h-screen bg-white dark:bg-wo-black">
          {isNewGame || isGameOver || showStadistics ? (
            <div className="animate-fadeIn absolute bg-transparent w-full h-full"></div>
          ) : null}
          <header className="py-4 bg-wo-gray dark:bg-wo-keyboard rounded-lg flex flex-row items-center">
            <button
              className="rounded p-2"
              onClick={() => {
                state.showInstructions(1);
              }}
            >
              <svg
                viewBox="0 0 91.999 92"
                className="h-6 dark:fill-wo-gray"
                fill="#767676"
              >
                <path d="M45.385,0.004C19.982,0.344-0.334,21.215,0.004,46.619c0.34,25.393,21.209,45.715,46.611,45.377  c25.398-0.342,45.718-21.213,45.38-46.615C91.655,19.986,70.785-0.335,45.385,0.004z M45.249,74l-0.254-0.004  c-3.912-0.116-6.67-2.998-6.559-6.852c0.109-3.788,2.934-6.538,6.717-6.538l0.227,0.004c4.021,0.119,6.748,2.972,6.635,6.937  C51.903,71.346,49.122,74,45.249,74z M61.704,41.341c-0.92,1.307-2.943,2.93-5.492,4.916l-2.807,1.938  c-1.541,1.198-2.471,2.325-2.82,3.434c-0.275,0.873-0.41,1.104-0.434,2.88l-0.004,0.451H39.429l0.031-0.907  c0.131-3.728,0.223-5.921,1.768-7.733c2.424-2.846,7.771-6.289,7.998-6.435c0.766-0.577,1.412-1.234,1.893-1.936  c1.125-1.551,1.623-2.772,1.623-3.972c0-1.665-0.494-3.205-1.471-4.576c-0.939-1.323-2.723-1.993-5.303-1.993  c-2.559,0-4.311,0.812-5.359,2.478c-1.078,1.713-1.623,3.512-1.623,5.35v0.457H27.935l0.02-0.477  c0.285-6.769,2.701-11.643,7.178-14.487C37.946,18.918,41.446,18,45.53,18c5.346,0,9.859,1.299,13.412,3.861  c3.6,2.596,5.426,6.484,5.426,11.556C64.368,36.254,63.472,38.919,61.704,41.341z" />
              </svg>
            </button>
            <h1 className="flex-1 text-3xl dark:text-wo-gray font-bold text-center uppercase ml-20">
              {/* Wordle {state.answer} */}
              Wordle
            </h1>
            <div className="flex flex-row items-center pr-6">
              <button
                className="rounded p-2"
                onClick={() => {
                  setStadistics(!showStadistics);
                  setStart(false);
                }}
              >
                <svg width="40" height="36" viewBox="0 0 40 36">
                  <rect
                    x="4.93549"
                    y="6"
                    width="29.6129"
                    height="24"
                    rx="2"
                    fill="black"
                    className="dark:fill-wo-gray"
                    fillOpacity="0.49"
                  />
                  <path
                    d="M13.1613 15L13.1613 24"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.7419 18V24"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M26.3226 12V24"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => setDarkM(!darkMode)}
                className="ml-2 w-14 h-6 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow"
              >
                <div
                  id="switch-toggle"
                  className={`w-8 h-8 relative rounded-full transition duration-500 transform ${
                    darkMode
                      ? "bg-gray-700 translate-x-full"
                      : "bg-yellow-500 -translate-x-2"
                  } p-1 text-white`}
                >
                  {darkMode ? darkIcon : lightIcon}
                </div>
              </button>
            </div>
          </header>
          <main className="grid grid-rows-5 gap-2 my-4 px-20">
            {rows.map((word, index) => (
              <WordRow
                key={index}
                word={word.guess}
                result={word.result}
                className={
                  showInvalidGuess && index === currentRow
                    ? "animate-bounce"
                    : ""
                }
              />
            ))}
          </main>
          <Keyboard
            onClick={(key) => {
              addGuessLetter(key);
            }}
          />
          {showStadistics && (
            <div
              role="modal"
              className="animate-fadeIn absolute bg-wo-gray dark:bg-wo-black dark:border-white dark:text-white border shadow rounded-lg text-center
            w-11/12 p-6 left-0 right-0 mx-auto top-1/4"
            >
              <h3 className="text-2xl font-bold">Estadísticas</h3>
              <div className="flex flex-row justify-between px-32 py-16">
                <div className="">
                  <span className="text-2xl font-bold">{state.games}</span>
                  <p>Jugadas</p>
                </div>
                <div className="">
                  <span className="text-2xl font-bold">{state.winned}</span>
                  <p>Victorias</p>
                </div>
              </div>
              <h2>{timer}</h2>
              <div className="w-full">
                <button
                  className="border border-green-500 rounded bg-green-500 p-2 px-12 mt-4 text-gray-800 shadow text-xl text-white dark:text-white font-bold w-1/2"
                  onClick={() => {
                    setStadistics(!showStadistics);
                  }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          )}
          {isGameOver && (
            <div
              role="modalGameOver"
              className="animate-fadeIn absolute bg-wo-gray dark:bg-wo-black dark:border-white dark:text-white border shadow rounded-lg text-center
            w-11/12 p-6 left-0 right-0 mx-auto top-1/4"
            >
              {state.gameState === "won" ? (
                <h3 className="text-2xl font-bold">Bien Hecho..! 😊✅ </h3>
              ) : (
                <h3 className="text-2xl font-bold">Intenta de nuevo 😔</h3>
              )}
              {state.gameState !== "won" && (
                <div className="my-4">
                  <WordRow
                    word={state.answer}
                    result={[3, 3, 3, 3, 3]}
                    className="items-center justify-items-center"
                  />
                </div>
              )}
              <div className="w-full">
                <button
                  className="border border-green-500 rounded bg-green-500 p-2 px-12 mt-4 text-gray-800 shadow text-xl text-white dark:text-white font-bold w-1/2"
                  onClick={() => {
                    state.newGame();
                    resetTimer();
                    setGuess("");
                  }}
                >
                  ¡Jugar de nuevo!
                </button>
              </div>
            </div>
          )}
          {isNewGame && (
            <div
              role="modalNewGame"
              className="animate-fadeIn absolute bg-wo-gray dark:bg-wo-black dark:border-white border border-black rounded-lg text-center
            w-11/12 p-6 left-0 right-0 mx-auto top-12"
            >
              <div className="body dark:text-white">
                <h3 className="text-xl font-bold">Cómo jugar</h3>
                <p className="text-justify mt-4">
                  Adivina la palabra oculta en cinco intentos. <br /> Cada
                  intento debe ser una palabra válida de 5 letras. <br />{" "}
                  Después de cada intento el color de las letras cambia <br />{" "}
                  para mostrar qué tan cerca estás de acertar la palabra.
                </p>
                <p className="font-bold text-left mt-4">Ejemplos</p>
                <div className="px-12 mt-4">
                  <WordRow
                    word={"Gatos"}
                    result={[2, 3, 3, 3, 3]}
                    small
                    className="items-center justify-items-center"
                  />
                </div>
                <p className="text-left mt-4">
                  La letra
                  <span className="font-bold"> G </span>
                  está en la palabra y en la posición correcta.
                </p>
                <div className="px-12 mt-4">
                  <WordRow
                    word={"Vocal"}
                    result={[3, 3, 1, 3, 3]}
                    small
                    className="items-center justify-items-center"
                  />
                </div>
                <p className="text-left mt-4">
                  La letra
                  <span className="font-bold"> C </span>
                  está en la palabra pero en la posición incorrecta.
                </p>
                <div className="px-12 mt-4">
                  <WordRow
                    word={"Canto"}
                    result={[3, 3, 3, 3, 0]}
                    small
                    className="items-center justify-items-center"
                  />
                </div>
                <p className="text-left mt-4">
                  La letra
                  <span className="font-bold"> O </span>
                  no está en la palabra.
                </p>
                <p className="text-left mt-4">
                  Puede haber letras repetidas. Las pistas son independientes
                  para cada letra.
                </p>
                <span>¡Una palabra nueva cada 5 minutos!</span>
              </div>
              <br />
              <button
                className="border border-green-500 rounded bg-green-500 p-2 px-12 mt-4 text-gray-800 shadow text-2xl text-white dark:text-white font-bold"
                onClick={() => {
                  if (state.newPlayer === 1 && state.showHelp === 1) {
                    state.showInstructions(0);
                    return;
                  }
                  setStart(true);
                  state.initGame();
                  setGuess("");
                }}
              >
                ¡Jugar!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function useGuess(): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  (letter: string) => void
] {
  const [guess, setGuess] = useState("");

  const addGuessLetter = (letter: string) => {
    setGuess((curGuess) => {
      const newGuess =
        letter.length === 1 && curGuess.length !== WORD_LENGTH
          ? curGuess + letter
          : curGuess;

      switch (letter) {
        case "Backspace":
          return newGuess.slice(0, -1);
        case "Enter":
          if (newGuess.length === WORD_LENGTH) {
            return "";
          }
      }

      if (newGuess.length === WORD_LENGTH) {
        return newGuess;
      }

      return newGuess;
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    let letter = e.key;
    addGuessLetter(letter);
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return [guess, setGuess, addGuessLetter];
}

// source https://usehooks.com/usePrevious/
function usePrevious<T>(value: T): T {
  const ref: any = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
