export default class BowlingGame {
  private rolls: number[] = [];

  constructor(rolls: number[]) {
    this.rolls = rolls;
  }

  public score(): number {
    let score = 0;

    for (let rollIndex = 0; rollIndex < this.rolls.length; rollIndex++) {
      if (this.isStrike(rollIndex)) {
        score += 10 + this.strikeBonus(rollIndex);
      } else if (this.isSpare(rollIndex)) {
        score += 10 + this.spareBonus(rollIndex);
        // skip next roll
        rollIndex += 1;
      } else {
        score += this.rolls[rollIndex];
      }
    }

    return score;
  }

  private isStrike(rollIndex: number): boolean {
    return this.rolls[rollIndex] === 10;
  }

  private strikeBonus(rollIndex: number): number {
    return this.rolls[rollIndex + 1] + this.rolls[rollIndex + 2];
  }

  private isSpare(rollIndex: number): boolean {
    return this.rolls[rollIndex] + this.rolls[rollIndex + 1] === 10;
  }

  private spareBonus(rollIndex: number): number {
    return this.rolls[rollIndex + 2];
  }
}
