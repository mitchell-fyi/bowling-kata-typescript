# TDD Exercise: Bowling Game Kata

By Mitchell Bryson.

# Introduction

The bowling game kata is an exercise in TDD. I like to use this in pair programming interviews because I get to see how the other person makes decisions and deals with unexpected challenges. What makes this exercise interesting is the increase in complexity as you move through it, and the requirement for refactoring to deal with changing design decisions whilst keeping the implementation relatively simple.

You can run it using the following CLI commands:

```
npm run test:1
npm run test:2
npm run test:3
npm run test:4
npm run test:5
```

With test 5 being the full implementation.

# Problem

(Taken from [https://codingdojo.org/kata/Bowling/](https://codingdojo.org/kata/Bowling/))

Create a program, which, given a valid sequence of rolls for one line of American Ten-Pin Bowling, produces the total score for the game. Here are some things that the program will not do:

- We will not check for valid rolls.
- We will not check for correct number of rolls and frames.
- We will not provide scores for intermediate frames.

Depending on the application, this might or might not be a valid way to define a complete story, but we do it here for purposes of keeping the kata light. I think you’ll see that improvements like those above would go in readily if they were needed for real.

We can briefly summarise the scoring for this form of bowling:

- Each game, or “line” of bowling, includes ten turns, or “frames” for the bowler.
- In each frame, the bowler gets up to two tries to knock down all the pins.
- If in two tries, he fails to knock them all down, his score for that frame is the total number of pins knocked down in his two tries.
- If in two tries he knocks them all down, this is called a “spare” and his score for the frame is ten plus the number of pins knocked down on his next throw (in his next turn).
- If on his first try in the frame he knocks down all the pins, this is called a “strike”. His turn is over, and his score for the frame is ten plus the simple total of the pins knocked down in his next two rolls.
- If he gets a spare or strike in the last (tenth) frame, the bowler gets to throw one or two more bonus balls, respectively. These bonus throws are taken as part of the same turn. If the bonus throws knock down all the pins, the process does not repeat: the bonus throws are only used to calculate the score of the final frame.
- The game score is the total of all frame scores.

More info on the rules at: [How to Score for Bowling](http://www.topendsports.com/sport/tenpin/scoring.htm)

# Walk-through

I’ve split this exercise into 5 distinct steps, each with their own tests. I don’t usually use a test framework for this, and instead just use these 2 methods for writing my tests (See [./src/testing.ts](./src/testing.ts)): 

```jsx
export function it(desc: string, fn: Function) {
  try {
    fn();
    console.log("\x1b[32m%s\x1b[0m", `\u2714 ${desc}`);
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", `\u2718 ${desc}`);
    console.error(error);
  }
}

export function assertStrictEqual(a: any, b: any) {
  if (a !== b) {
    throw new Error(`${a} is not equal to ${b}`);
  }
}
```

## [Step 1](./src/BowlingGame-1.spec.ts)

Here we cover the basics. Creating a Game class that can take input (rolls) and return a calculated output (score) by summing all the values for each roll. 

```jsx
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
```

## [Step 2](./src/BowlingGame-2.spec.ts)

Now I can add functionality to calculate the Spare condition. I’ve had to **switch from a reduce** **method** to iterating over each roll to be able to do the look ahead required for calculating the spare bonus. I also need to advance the rollIndex past the next roll, since I’ve already calculated it.

```jsx
export default class BowlingGame {
  private rolls: number[] = [];

  constructor(rolls: number[]) {
    this.rolls = rolls;
  }

  public score(): number {
    let score = 0;

    for (let rollIndex = 0; rollIndex < this.rolls.length; rollIndex++) {
      if (this.rolls[rollIndex] + this.rolls[rollIndex + 1] === 10) {
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

it("should return 16 for a game with a spare", () => {
  const rolls = [5, 5, 3, ...Array(17).fill(0)];
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 16);
});
```

## [Step 3](./src/BowlingGame-3.spec.ts)

Adding the Strike bonus condition is pretty similar to the spare. Except I don’t need to advance the rollIndex, since the game has moved onto the next frame already (there are no more pins to roll at!).

```jsx
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

it("should return 24 for a game with a strike", () => {
  const rolls = [10, 3, 4, ...Array(16).fill(0)];
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 24);
});
```

## [Step 4](./src/BowlingGame-4.spec.ts)

Now it gets trickier. I have to calculate the end of the game conditions, starting with a perfect game. I also take the opportunity to **refactor** some of the conditional logic into class methods to make things a bit easier to read. I calculate the end game by only iterating over the rolls that are not part of the bonus rolls at the end of the game.

```jsx
export default class BowlingGame {
  private rolls: number[] = [];

  constructor(rolls: number[]) {
    this.rolls = rolls;
  }

  public score(): number {
    let score = 0;

    for (let rollIndex = 0; rollIndex < this.rolls.length - 2; rollIndex++) {
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
    return this.rolls[rollIndex + 1] + this.rolls[rollIndex + 2] || 0;
  }

  private isSpare(rollIndex: number): boolean {
    return this.rolls[rollIndex] + this.rolls[rollIndex + 1] === 10;
  }

  private spareBonus(rollIndex: number): number {
    return this.rolls[rollIndex + 2];
  }
}

it("should return 300 for a perfect game", () => {
  const rolls = Array(12).fill(10);
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 300);
});
```

## [Step 5](./src/BowlingGame-5.spec.ts)

Although the last test passed, it would **not accurately calculate** the score for when there were no bonus throws, or a Spare was thrown in the 10th frame. I find this out by adding some outlier tests. The only way I thought to fix this issue is to track the frame as well as the rolls, so I can limit my calculations to 10 frames (with any number of rolls between 10 and 23). This requires a refactor to iterate over frames rather than rolls.

```jsx
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

it("should return 7 when there are no bonus throws", () => {
  const rolls = [...Array(18).fill(0), 3, 4];
  const game = new BowlingGame(rolls);

  assertStrictEqual(game.score(), 7);
});

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
```

Now the tests are passing for the different types of end game.

The whole exercise takes about an hour on my own, but in an interview I have rarely seen someone get past Step 4 in the same amount of time - usually because we’re chatting about the different design options.

Example test output of Step 5:

```jsx
✔ should return 0 for a gutter game
✔ should return 20 for a game with all ones
✔ should return 16 for a game with a spare
✔ should return 24 for a game with a strike
✔ should return 300 for a perfect game
✔ should return 7 when there are no bonus throws
✔ should return 13 when a spare is scored in the 10th frame
✔ should return 17 when a strike is scored in the 10th frame
```
