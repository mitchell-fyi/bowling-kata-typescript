import { it, assertStrictEqual } from "./testing";
import "./BowlingGame-1.spec";
import "./BowlingGame-2.spec";
import BowlingGame from "./BowlingGame-3";

it("should return 24 for a game with a strike", () => {
  const rolls = [10, 3, 4, ...Array(16).fill(0)];
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 24);
});
