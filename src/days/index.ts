import day1 from './day1';
import day2 from './day2';
import day3 from './day3';

export interface Day {
  id: number
  exec(input: string): void
  sampleInput: string
}

const days = [day1, day2, day3];
const daysById = new Map(days.map(d => [d.id, d]));
export default daysById;
