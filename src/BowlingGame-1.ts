export default class BowlingGame {
  private rolls: number[] = [];

  constructor(rolls: number[]) {
    this.rolls = rolls;
  }

  public score(): number {
    return this.rolls.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
  }
}
