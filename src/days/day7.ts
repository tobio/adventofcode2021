import type {Day} from './index';

const constantMoveCost = (steps: number) => steps;
const linearMoveCost = (steps: number) => steps * ((steps + 1) / 2);

function calculateMoveCost(to: number, options: number[], costMove: (steps: number) => number): number {
  return options.reduce((totalCost, next) => totalCost + costMove(Math.abs(next - to)), 0);
}

function minimumMoveCost(positions: number[], costMove: (steps: number) => number): number {
  const sortedPositions = positions.sort((a, b) => a - b);
  const minPosition = sortedPositions[0];
  const maxPosition = sortedPositions[sortedPositions.length - 1];

  let minCost = Number.MAX_SAFE_INTEGER;
  for(let target = minPosition; target <= maxPosition; target++) {
    const cost = calculateMoveCost(target, sortedPositions, costMove);
    if (cost < minCost) minCost = cost;
  }

  return minCost;
}

const day: Day = {
  id: 7,
  exec: (input: string) => {
    const positions = input.split(',').map(Number);
    const part1 = minimumMoveCost(positions, constantMoveCost);
    const part2 = minimumMoveCost(positions, linearMoveCost);

    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `16,1,2,0,4,2,7,1,2,14`
};

export default day;
