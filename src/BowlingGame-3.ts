export default class BowlingGame {
  private rolls: number[] = [];

  constructor(rolls: number[]) {
    this.rolls = rolls;
  }

  public score(): number {
    let score = 0;

    for (let rollIndex = 0; rollIndex < this.rolls.length; rollIndex++) {
      if (this.rolls[rollIndex] === 10) {
        // strike
        score += 10 + this.rolls[rollIndex + 1] + this.rolls[rollIndex + 2];
      } else if (this.rolls[rollIndex] + this.rolls[rollIndex + 1] === 10) {
        // spare
        score += 10 + this.rolls[rollIndex + 2];
        rollIndex += 1;
      } else {
        score += this.rolls[rollIndex];
      }
    }

    return score;
  }
}
