import { it, assertStrictEqual } from "./testing";
import BowlingGame from "./BowlingGame-1";

it("should return 0 for a gutter game", () => {
  const rolls = Array(20).fill(0);
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 0);
});

it("should return 20 for a game with all ones", () => {
  const rolls = Array(20).fill(1);
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 20);
});
