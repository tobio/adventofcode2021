import type {Day} from './index';

interface Point { x: number, y: number, value: number }

function findLowPoints(input: number[][]): Point[] {
  const lowPoints = input.map((row, rowIndex) =>
    row.
      map((value, columnIndex) => ({x: columnIndex, y: rowIndex, value})).
      filter((point, columnIndex) => {
        const adjacentPoints = [
          (input[rowIndex - 1] || [])[columnIndex], // up
          (input[rowIndex + 1] || [])[columnIndex], // down
          row[columnIndex - 1], // left
          row[columnIndex + 1], //right
        ];

        return adjacentPoints.every(p => p === undefined || p > point.value);
      })
    );

  return lowPoints.reduce((all, next) => [...all, ...next], []);
}

function findBasinSizes(input: number[][], lowPoints: Point[]): number[] {
  const maxColumns = input[0].length;
  const maxRows = input.length;

  return lowPoints.map(lowPoint => {
    const pointsInBasin = new Set<string>();

    const checkPoint = (x: number, y: number): void => {
      if(x < 0 || y < 0 || x >= maxColumns || y >= maxRows) return;
      if(pointsInBasin.has(`${x},${y}`)) return;
      if(input[y][x] === 9) return;

      pointsInBasin.add(`${x},${y}`);
      expandPoint(x, y);
    }

    const expandPoint = (x: number, y: number) => {
      checkPoint(x, y - 1);
      checkPoint(x, y + 1);
      checkPoint(x - 1, y);
      checkPoint(x + 1, y);
    }

    checkPoint(lowPoint.x, lowPoint.y);

    return pointsInBasin.size;
  });
}

const day: Day = {
  id: 9,
  exec: (input: string) => {
    const parsedInput = input.split('\n').map(line => line.split('').map(Number));

    const lowPoints = findLowPoints(parsedInput);
    const basins = findBasinSizes(parsedInput, lowPoints);
    basins.sort((a, b) => a - b);

    const part1 = lowPoints.reduce((sum, next) => sum + 1 + next.value, 0);
    const part2 = basins.pop() * basins.pop() * basins.pop();

    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `2199943210
3987894921
9856789892
8767896789
9899965678`
};

export default day;
