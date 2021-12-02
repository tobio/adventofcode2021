import day1 from './day1';

export interface Day {
    id: number
    exec(input: string): void
    sampleInput: string
}

const daysById = new Map([[day1.id, day1]]);
export default daysById