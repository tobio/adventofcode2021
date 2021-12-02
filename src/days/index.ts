import day1 from './day1';
import day2 from './day2';

export interface Day {
    id: number
    exec(input: string): void
    sampleInput: string
}

const daysById = new Map([[day1.id, day1], [day2.id, day2]]);
export default daysById;
