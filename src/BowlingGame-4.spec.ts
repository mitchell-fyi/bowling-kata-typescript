import { it, assertStrictEqual } from "./testing";
import "./BowlingGame-1.spec";
import "./BowlingGame-2.spec";
import "./BowlingGame-3.spec";
import BowlingGame from "./BowlingGame-4";

it("should return 300 for a perfect game", () => {
  const rolls = Array(12).fill(10);
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 300);
});
