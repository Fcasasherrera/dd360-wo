import { describe, expect, test } from "vitest";
import { computeGuess, isValidWord, LetterState } from "./word-utils";

describe("computeGuess", () => {
  test("works with match and presents", () => {
    expect(computeGuess("pinol", "pilar")).toEqual([
      LetterState.Match,
      LetterState.Match,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Present,
    ]);
  });

  test("full match", () => {
    expect(computeGuess("hotel", "hotel")).toEqual([
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
      LetterState.Match,
    ]);
  });

  test("full miss", () => {
    expect(computeGuess("guard", "hotel")).toEqual([
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
    ]);
  });

  test("only does one match when two letters exist", () => {
    expect(computeGuess("toros", "hotel")).toEqual([
      LetterState.Present,
      LetterState.Match,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
    ]);
  });

  test("returns empty array when given incomplete guess", () => {
    expect(computeGuess("so", "hotel")).toEqual([]);
  });

  test("when 2 letters are present but answer has only 1 of those letters", () => {
    expect(computeGuess("ullol", "perla")).toEqual([
      LetterState.Miss,
      LetterState.Present,
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Miss,
    ]);
  });

  test("when 1 letter matches but guess has more of the same letter", () => {
    expect(computeGuess("ullol", "colon")).toEqual([
      LetterState.Miss,
      LetterState.Miss,
      LetterState.Match,
      LetterState.Match,
      LetterState.Miss,
    ]);
  });
});

describe("isValidWord", () => {
  test("with valid word", () => {
    expect(isValidWord("hotel")).toBe(true);
  });

  test("with invalid word", () => {
    expect(isValidWord("lulze")).toBe(false);
  });
});
