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

export default { it, assertStrictEqual };
