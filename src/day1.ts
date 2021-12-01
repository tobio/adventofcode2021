import { getInput } from './get-input';

function sumWindow(items: number[], from: number, to: number): number {
  const window = items.slice(from, to);
  const sum = window.reduce((sum, next) => sum + next, 0);
  return sum;
}

function day1(input: string, windowSize: number): number {
  const lines = input.split('\n').map(Number)

  const result = lines.reduce((sumHigher, _, index, all) => {
    if (index < windowSize) {
      return sumHigher;
    }

    const previousSum = sumWindow(all, index - windowSize, index);
    const currentSum = sumWindow(all, index - windowSize + 1, index + 1);

    if (currentSum > previousSum) {
      return sumHigher + 1;
    }

    return sumHigher;
  }, 0)

  return result;
}

getInput().then((i) => {
  const part1 = day1(i, 1);
  const part2 = day1(i, 3);

  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
})
