import type {Day} from './index';

const fishPerDay = (input: string, totalDays: number): number => {
  const spawnCounts = Array(9).fill(0);
  const initialFish = input.split(',').map(Number);

  initialFish.forEach(f => spawnCounts[f]++);

  for (let day = 0; day < totalDays; day++) {
    const spawnsToday = spawnCounts.shift();
    spawnCounts[6] += spawnsToday;
    spawnCounts[8] = spawnsToday;
  }

  return spawnCounts.reduce((sum, next) => sum + next);
};

const day: Day = {
  id: 6,
  exec: (input: string) => {
    const part1 = fishPerDay(input, 80);
    const part2 = fishPerDay(input, 256);

    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `3,4,3,1,2`
};

export default day;
