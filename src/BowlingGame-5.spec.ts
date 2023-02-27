import { it, assertStrictEqual } from "./testing";
import "./BowlingGame-1.spec";
import "./BowlingGame-2.spec";
import "./BowlingGame-3.spec";
import "./BowlingGame-4.spec";
import BowlingGame from "./BowlingGame-5";

it("should return 13 when a spare is scored in the 10th frame", () => {
  const rolls = [...Array(18).fill(0), 5, 5, 3];
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 13);
});

it("should return 17 when a strike is scored in the 10th frame", () => {
  const rolls = [...Array(18).fill(0), 10, 3, 4];
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 17);
});
