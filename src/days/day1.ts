import { getInput } from '../get-input';

import type {Day} from './index'

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

const day: Day = {
  id: 1,
  exec: (input: string) => {
    const part1 = day1(input, 1);
    const part2 = day1(input, 3);

    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `199
  200
  208
  210
  200
  207
  240
  269
  260
  263`
};

export default day;
