import type { Day } from './index';

type CourseDirection = 'forward' | 'down' | 'up';
interface CourseSegment {
    direction: CourseDirection,
    units: number
}

interface Location {
  aim: number,
  depth: number,
  horizontal: number
}

function validateDirection(direction: string): direction is CourseDirection {
  return direction === 'forward' || direction === 'down' || direction === 'up';
}

function parseInput(input: string): CourseSegment[] {
    return input.trim().split('\n').map(line => {
      const [direction, units] = line.trim().split(' ');
      if (!validateDirection(direction)) {
        return null;
      }

      return {direction, units: Number(units)};
    }).filter(c => c !== null);
}

function basicProjection({aim, depth, horizontal}: Location, {direction, units}: CourseSegment): Location {
  switch(direction) {
    case 'forward':
      return {aim, depth, horizontal: horizontal + units};
    case 'down':
      return {aim, depth: depth + units, horizontal};
    case 'up':
      return {aim, depth: depth - units, horizontal};
  }
}

function projectionWithAim({aim, depth, horizontal}: Location, {direction, units}: CourseSegment): Location {
  switch(direction) {
    case 'forward':
      return {aim, depth: depth + (units * aim), horizontal: horizontal + units};
    case 'down':
      return {aim: aim + units, depth, horizontal};
    case 'up':
      return {aim: aim - units, depth, horizontal};
  }
}

function projectFinalLocation(course: CourseSegment[], projection: (location: Location, segment: CourseSegment) => Location): Location {
  return course.reduce(projection, {depth: 0, horizontal: 0, aim: 0});
}

function day2(input: string, projection: (location: Location, segment: CourseSegment) => Location): number {
  const course = parseInput(input);
  const finalLocation = projectFinalLocation(course, projection);

  return finalLocation.depth * finalLocation.horizontal;
}

const day: Day = {
    id: 2,
    exec: (input: string) => {
      const part1 = day2(input, basicProjection);
      const part2 = day2(input, projectionWithAim);

      console.log('Part 1:', part1);
      console.log('Part 2:', part2);
    },
    sampleInput: `forward 5
down 5
forward 8
up 3
down 8
forward 2`
  };

  export default day;