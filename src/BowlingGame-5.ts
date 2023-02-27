export default class BowlingGame {
  private rolls: number[] = [];

  constructor(rolls: number[]) {
    this.rolls = rolls;
  }

  public score(): number {
    let score = 0;
    let rollIndex = 0;

    for (let frameIndex = 0; frameIndex < 10; frameIndex++) {
      if (this.isStrike(rollIndex)) {
        score += 10 + this.strikeBonus(rollIndex);
        rollIndex++;
      } else if (this.isSpare(rollIndex)) {
        score += 10 + this.spareBonus(rollIndex);
        rollIndex += 2;
      } else {
        score += this.sumOfBallsInFrame(rollIndex);
        rollIndex += 2;
      }
    }

    return score;
  }

  private isStrike(rollIndex: number): boolean {
    return this.rolls[rollIndex] === 10;
  }

  private strikeBonus(rollIndex: number): number {
    return this.rolls[rollIndex + 1] + this.rolls[rollIndex + 2] || 0;
  }

  private isSpare(rollIndex: number): boolean {
    return (
      this.rolls[rollIndex] < 10 &&
      this.rolls[rollIndex] + this.rolls[rollIndex + 1] === 10
    );
  }

  private spareBonus(rollIndex: number): number {
    return this.rolls[rollIndex + 2] || 0;
  }

  private sumOfBallsInFrame(rollIndex: number): number {
    return this.rolls[rollIndex] + this.rolls[rollIndex + 1] || 0;
  }
}
