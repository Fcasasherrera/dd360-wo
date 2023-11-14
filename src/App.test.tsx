import { describe, expect, test } from "vitest";
import App from "./App";
import { useStore } from "./store";
import { render, screen, userEvent, within } from "./test/test-utils";

describe("App", () => {
  test("the title is visible", () => {
    render(<App />);
    // @ts-expect-error
    expect(screen.getByText(/Wordle/i)).toBeInTheDocument();
  });

  test("shows empty state", () => {
    useStore.getState().newGame([]);
    render(<App />);
    expect(screen.queryByText("Intenta de nuevo")).toBeNull();
    expect(document.querySelectorAll("main div")).toHaveLength(5);
    expect(document.querySelector("main")?.textContent).toEqual("");
  });

  test("shows one row of guesses", () => {
    useStore.getState().newGame(["hotel"]);
    render(<App />);
    expect(document.querySelector("main")?.textContent).toEqual("hotel");
  });

  test("shows lost game state", () => {
    useStore.getState().newGame(Array(5).fill("hotel"));
    render(<App />);
    // @ts-expect-error
    expect(screen.getByText("Intenta de nuevo 😔")).toBeInTheDocument();
  });

  test("show won game state", () => {
    const initialState = Array(2).fill("hotel");
    useStore.getState().newGame(initialState);
    const answer = useStore.getState().answer;
    useStore.getState().addGuess(answer);

    render(<App />);

    // shows all guesses in the DOM
    expect(document.querySelector("main")?.textContent).toEqual(
      initialState.join("") + answer
    );
    // @ts-expect-error
    expect(screen.getByText("Bien Hecho..! 😊✅")).toBeInTheDocument();
  });

  test("can start new game", () => {
    useStore.getState().newGame(Array(5).fill("hotel"));
    render(<App />);
    // @ts-expect-error
    expect(screen.getByText("Intenta de nuevo 😔")).toBeInTheDocument();

    userEvent.click(
      within(screen.getByRole("modalGameOver")).getByText(
        "¡Jugar de nuevo!",
        {}
      )
    );
    expect(document.querySelector("main")?.textContent).toEqual("");
    expect(screen.queryByText("Intenta de nuevo 😔")).toBeNull();
  });
});
