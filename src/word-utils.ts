import wordBank from "./bank-words.json";

export enum LetterState {
  Miss, // Letter doesn't exist at all
  Present, // Letter exists but wrong location
  Match, // Letter exists and is in the right location
  Empty, // Only letter
}

export function computeGuess(
  guess: string,
  answerString: string
): LetterState[] {
  const result: LetterState[] = [];

  if (guess.length !== answerString.length) {
    return result;
  }

  const answer = answerString.split("");

  const guessAsArray = guess.split("");

  const answerLetterCount: Record<string, number> = {};

  guessAsArray.forEach((letter, index) => {
    const currentAnswerLetter = answer[index];

    answerLetterCount[currentAnswerLetter] = answerLetterCount[
      currentAnswerLetter
    ]
      ? answerLetterCount[currentAnswerLetter] + 1
      : 1;

    if (currentAnswerLetter === letter) {
      result.push(LetterState.Match);
    } else if (answer.includes(letter)) {
      result.push(LetterState.Present);
    } else {
      result.push(LetterState.Miss);
    }
  });

  result.forEach((curResult, resultIndex) => {
    if (curResult !== LetterState.Present) {
      return;
    }

    const guessLetter = guessAsArray[resultIndex];

    answer.forEach((currentAnswerLetter, answerIndex) => {
      if (currentAnswerLetter !== guessLetter) {
        return;
      }

      if (result[answerIndex] === LetterState.Match) {
        result[resultIndex] = LetterState.Miss;
      }

      if (answerLetterCount[guessLetter] <= 0) {
        result[resultIndex] = LetterState.Miss;
      }
    });

    answerLetterCount[guessLetter]--;
  });

  return result;
}

export function getRandomWord(): string {
  return wordBank.valid[Math.floor(Math.random() * wordBank.valid.length)];
}

export function isValidWord(word: string): boolean {
  return wordBank.valid.includes(word);
}
