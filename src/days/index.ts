import day1 from './day1';
import day2 from './day2';
import day3 from './day3';
import day4 from './day4';
import day5 from './day5';
import day6 from './day6';
import day7 from './day7';

export interface Day {
  id: number
  exec(input: string): void
  sampleInput: string
}

const days = [
  day1,
  day2,
  day3,
  day4,
  day5,
  day6,
  day7,
];
const daysById = new Map(days.map(d => [d.id, d]));
export default daysById;
