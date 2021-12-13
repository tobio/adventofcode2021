import type {Day} from './index';

type Fold = {axis: 'x' | 'y', index: number}
type Points = boolean[][]

interface Page1 {
  points: Points
  folds: Fold[]
}

function parseInput(input: string): Page1 {
  const [dotRows, foldRows] = input.split('\n\n').map(i => i.split('\n'));

  const dots = dotRows.map(line => line.split(',').map(Number));
  const maxX = dots.reduce((max, [x]) => Math.max(max, x), 0) + 1;
  const maxY = dots.reduce((max, [x, y]) => Math.max(max, y), 0) + 1;

  const points = new Array(maxY).fill(new Array(maxX).fill(false)).map(a => [...a]);
  dots.forEach(([x, y]) => {
    points[y][x] = true
  });

  const folds = foldRows.map(r => r.split(' ')[2].split('=')).map(([axis, index]) => ({axis: axis as 'x' | 'y', index: Number(index)}));

  return {
    points,
    folds
  };
}

interface FoldedParts {
  first: Points
  second: Points
  secondToFirstIndices: (x: number, y: number) => [number, number]
}

function horizontalFolder(points: Points, splitAt: number) {
  const top = points.slice(0, splitAt).map(row => [...row]);
  const bottom = points.slice(splitAt + 1).map(row => [...row]);
  const maxY = top.length - 1;
  const translateY = (x: number, y: number): [number, number] => [x, maxY - y];

  return {
    first: top,
    second: bottom,
    secondToFirstIndices: translateY
  };
}

function verticalFolder(points: Points, splitAt: number) {
  const split = points.map((row) => [row.slice(0, splitAt), row.slice(splitAt + 1)]);
  const {left, right} = split.reduce(({left, right}, next) => {
    left.push(next[0]);
    right.push(next[1]);
    return {left, right}
  }, {left: [] as boolean[][], right: [] as boolean[][]});

  const maxX = left[0].length - 1;
  const translateX = (x: number, y: number): [number, number] => [maxX - x, y];

  return {
    first: left,
    second: right,
    secondToFirstIndices: translateX
  };
}

const splitters: Record<'x' | 'y', (points: Points, splitAt: number) => FoldedParts> = {
  x: verticalFolder,
  y: horizontalFolder,
}

function foldPoints(points: Points, fold: Fold): Points {
  const {first, second, secondToFirstIndices} = splitters[fold.axis](points, fold.index);

  second.forEach((row, y) => {
    row.forEach((item, x) => {
      const [firstX, firstY] = secondToFirstIndices(x, y);
      first[firstY][firstX] = item || first[firstY][firstX]
    });
  });

  return first;
}

function printPoints(points: Points) {
  points.forEach((row) => {
    console.log(row.map(i => i ? '#' : '.').join(' '));
  });
}

const day: Day = {
  id: 13,
  exec: (input: string) => {
    const page1 = parseInput(input);

    const part1Points = foldPoints(page1.points, page1.folds[0]);
    const part1 = part1Points.reduce((sum, column) => sum + column.filter(c => c).length, 0);
    console.log('Part 1:', part1);

    const fullyFolded = page1.folds.reduce((points, fold) => foldPoints(points, fold), page1.points);

    printPoints(fullyFolded);
  },
  sampleInput: `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`
};

export default day;
