import type {Day} from './index';

interface Point {x: number, y: number}
type Direction = 'horizontal' | 'vertical' | 'diagonal';

class VentLine {
  direction: Direction
  constructor(readonly start: Point, readonly end: Point) {
    if(this.start.x === this.end.x) {
      this.direction = 'vertical';
    } else if (this.start.y === this.end.y) {
      this.direction = 'horizontal';
    } else {
      this.direction = 'diagonal';
    }

    if(this.end.x < this.start.x || this.end.y < this.start.y) {
      const end = this.end;
      this.end = this.start;
      this.start = end;
    }
  }

  private makeNextGenerator(): (p: Point) => Point {
    switch(this.direction) {
      case 'horizontal': return ({x, y}) => ({x: x + 1, y});
      case 'vertical': return ({x,y}) => ({x, y: y + 1});
      case 'diagonal':
        const xIncrement = this.start.x > this.end.x ? -1 : 1;
        const yIncrement = this.start.y > this.end.y ? -1 : 1;

        return ({x, y}) => ({x: x + xIncrement, y: y + yIncrement});
    }
  }

  *points(): Generator<Point, void, void> {
    const makeNext = this.makeNextGenerator()
    yield this.start;
    let next = this.start;
    while(next.x !== this.end.x || next.y !== this.end.y) {
      next = makeNext(next);
      yield next;
    }
  }
}

function parsePoint(point: string): Point {
  const [x, y] = point.trim().split(',');
  return {x: Number(x), y: Number(y)};
}

function stringifyPoint(point: Point): string {
  return `${point.x},${point.y}`;
}

function parseLine(line: string): VentLine {
  const [start, end] = line.split('->');

  return new VentLine(parsePoint(start), parsePoint(end));
}

function numberOfIntersections(input: string, filter?: (v: VentLine) => boolean): number {
  const ventLines = input.split('\n').map(parseLine);
  const applicableLines = filter !== undefined ? ventLines.filter(filter) : ventLines;
  const pointsMap = new Map<string, number>();

  applicableLines.forEach(line => {
    Array.from(line.points()).forEach(point => {
      const pointStr = stringifyPoint(point);
      const current = pointsMap.get(pointStr) || 0;
      pointsMap.set(pointStr, current + 1);
    })
  })

  return Array.from(pointsMap.values()).filter(v => v > 1).length;
}

const day: Day = {
  id: 5,
  exec: (input: string) => {
    const part1 = numberOfIntersections(input, l => l.direction !== 'diagonal');
    const part2 = numberOfIntersections(input)


    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`
};

export default day;
