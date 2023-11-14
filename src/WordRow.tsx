import { answerSelector, useStore, WORD_LENGTH } from "./store";
import { LetterState } from "./word-utils";

interface WordRowProps {
  word: string;
  result?: LetterState[];
  className?: string;
  small?: boolean;
}
export default function WordRow({
  word = "",
  result = [],
  className = "",
  small = false,
}: WordRowProps) {
  const lettersRemaining = WORD_LENGTH - word.length;
  const letters = word.split("").concat(Array(lettersRemaining).fill(""));

  return (
    <div className={`grid grid-cols-5 ${className}`}>
      {letters.map((char, index) => (
        <CharacterBox
          small={small}
          key={index}
          value={char}
          state={result[index]}
        />
      ))}
    </div>
  );
}

interface CharacterBoxProps {
  value?: string;
  state?: LetterState;
  small?: boolean;
}
function CharacterBox({ value, state, small }: CharacterBoxProps) {
  const smallBox = small ? "w-16 h-16" : "w-20 h-20";
  const stateStyles =
    state == null
      ? `bg-wo-empty text-black rounded-lg ${smallBox}`
      : `${characterStateStyles[state]} text-white rounded-lg ${smallBox}`;

  return (
    <span
      className={`flex items-center justify-center p-2 uppercase text-center font-extrabold text-4xl before:inline-block before:content-['_'] ${stateStyles} `}
    >
      {value}
    </span>
  );
}

const characterStateStyles = {
  [LetterState.Miss]: "border-wo-miss bg-wo-miss",
  [LetterState.Present]: "border-wo-present bg-wo-present",
  [LetterState.Match]: "border-wo-success bg-wo-success",
  [LetterState.Empty]:
    "bg-wo-empty border-wo-empty dark:bg-wo-black dark:border-white dark:border",
};
