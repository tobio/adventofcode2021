import type {Day} from './index';

class Octopus {
  private energyLevel: number

  constructor(initialEnergy: number) {
    this.energyLevel = initialEnergy;
  }

  energise(): boolean {
    this.energyLevel++;

    return this.energyLevel > 9;
  }

  flash(): void {
    if(this.energyLevel <= 9) throw new Error("No no capn I cannae give her any more");

    this.energyLevel = 0;
  }
}

interface OctopusEntry {
  octo: Octopus,
  x: number,
  y: number
}

function propagateFlashes(octopi: OctopusEntry[][], flashing: Map<string, OctopusEntry>, hasFlashed: Set<string>): Map<string, OctopusEntry> {
  const newFlashing = new Map<string, OctopusEntry>();

  const row = (y: number) => octopi[y] || [];
  const getAdjacent = ({x, y}: OctopusEntry) => [
    row(y)[x - 1],
    row(y)[x + 1],
    row(y - 1)[x - 1],
    row(y - 1)[x],
    row(y - 1)[x + 1],
    row(y + 1)[x - 1],
    row(y + 1)[x],
    row(y + 1)[x + 1],
  ].filter(entry => !!entry);

  flashing.forEach((entry) => {
    getAdjacent(entry).
      filter(({x, y, octo}) => octo.energise() && !hasFlashed.has(`${x},${y}`)).
      forEach(({x, y, octo}) => newFlashing.set(`${x},${y}`, {x, y, octo}))
  });

  Array.from(newFlashing.keys()).forEach(k => hasFlashed.add(k));
  return newFlashing;
}

function step(octopi: OctopusEntry[][]): number {
  let flashingOctos = new Map<string, OctopusEntry>();
  octopi.forEach(row => row.forEach(({x, y, octo}) => {
    if(octo.energise()) {
      flashingOctos.set(`${x},${y}`, {x, y, octo});
    }
  }));

  const hasFlashed = new Set<string>(flashingOctos.keys());

  while(flashingOctos.size) {
    flashingOctos = propagateFlashes(octopi, flashingOctos, hasFlashed);
  }

  hasFlashed.forEach((key) => {
    const [x, y] = key.split(',').map(Number);
    octopi[y][x].octo.flash();
  })

  return hasFlashed.size;
}

const day: Day = {
  id: 11,
  exec: (input: string) => {
    const octopi = input.
      split('\n').
      map((line, y) =>
        line.
          split('').
          map((e, x) => ({
            x, y,
            octo: new Octopus(Number(e))
          }))
        );

    const part1FlashesPerStep = new Array(100).fill(0).map(_ => step(octopi));
    const part1 = part1FlashesPerStep.reduce((sum, next) => sum + next, 0);

    let flashesLastStep = part1FlashesPerStep[part1FlashesPerStep.length - 1];
    let part2 = 100;
    for(; flashesLastStep !== octopi.length * octopi[0].length; part2++) {
      flashesLastStep = step(octopi);
    }

    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`
};

export default day;
