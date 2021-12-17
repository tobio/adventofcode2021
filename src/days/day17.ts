import type {Day} from './index';

interface Target {
  x: [number, number]
  y: [number, number]
}

function parseInput(input: string): Target {
  const match = input.match(/x=(?<xStart>-?\d+)\.{2}(?<xEnd>-?\d+),\s+y=(?<yStart>-?\d+)\.{2}(?<yEnd>-?\d+)$/);

  return {
    x: [
      parseInt(match.groups['xStart'], 10),
      parseInt(match.groups['xEnd'], 10)
    ],
    y: [
      parseInt(match.groups['yStart'], 10),
      parseInt(match.groups['yEnd'], 10)
    ]
  }
}

interface VelocityParams {
  initialX: number,
  initialY: number,
  peakY: number
}

function *positions(initialX: number, initialY: number): Generator<{x: number, y: number}, void, void> {
  let x = 0;
  let y = 0;

  let xVelocity = initialX;
  let yVelocity = initialY;

  while(true) {
    yield {x, y}
    x += xVelocity;
    y += yVelocity;

    yVelocity--;
    if(xVelocity > 0) {
      xVelocity--;
    }
  }
}

function *findOnTargetVelocities(target: Target): Generator<VelocityParams, void, void> {
  const startX = target.x[0] >= 0 ? 0 : target.x[0];
  const endX = target.x[1] >= 0 ? target.x[1] : 0;

  for(let initialX = startX; initialX <= endX; initialX++) {
    for(let initialY = target.y[0]; initialY < 1000; initialY++) {
      let peakY = 0;
      for (const position of positions(initialX, initialY)) {
        if(position.y > peakY) peakY = position.y;
        if(position.x >= target.x[0] && position.x <= target.x[1] &&
          position.y >= target.y[0] && position.y <= target.y[1]) {
            yield {initialX, initialY, peakY};
            break;
          }

        if(
          (initialX > 0 && position.x > target.x[1]) ||
          (initialX < 0 && position.x < target.x[0]) ||
          (position.y < target.y[0])
        ) {
          break;
        }
      }
    }
  }
}

const day: Day = {
  id: 17,
  exec: (input: string) => {
    const target = parseInput(input);
    const onTargetVelocities = Array.from(findOnTargetVelocities(target));

    const part1 = onTargetVelocities.reduce((totalPeakY, {peakY}) => Math.max(totalPeakY, peakY), 0);

    console.log('Part 1', part1);
    console.log('Part 2', onTargetVelocities.length);
  },
  sampleInput: `target area: x=20..30, y=-10..-5`
};

export default day;
