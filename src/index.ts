import allDays from "./days";
import { getInput } from "./get-input";

if(process.argv.length !== 3) {
  console.error('Incorrect number of arguments specified.');
  console.error('Usage:', process.argv[0], process.argv[1], '<day>');
  process.exit(1);
}

const dayId = Number(process.argv[2]);
const day = allDays.get(dayId);

if (!day) {
  console.error('Unknown day id, possible options are:', Array.from(allDays.keys()));
  process.exit(1);
}

console.log('With sample input:')
const start = Date.now();
day.exec(day.sampleInput);
const sampleEnd = Date.now();
console.log();
getInput(dayId).then(input => {
  const actualStart = Date.now();
  console.log('With actual input');
  day.exec(input);
  const end = Date.now();

  console.log('Execution times (in ms)', {
    sample: sampleEnd - start,
    getInput: actualStart - sampleEnd,
    actual: end - actualStart
  });
}).catch(err => {
  console.error('Failed to get input', err);
  process.exit(1);
})
