import { it, assertStrictEqual } from "./testing";
import "./BowlingGame-1.spec";
import BowlingGame from "./BowlingGame-2";

it("should return 16 for a game with a spare", () => {
  const rolls = [5, 5, 3, ...Array(16).fill(0)];
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 16);
});
