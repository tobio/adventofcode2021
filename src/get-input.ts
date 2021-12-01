
import request from 'request-promise';

const sessionId = process.env['SESSION'];

async function getInput(): Promise<string> {
  const response = await request(`https://adventofcode.com/2021/day/1/input`, {
    headers: {
      cookie: `session=${sessionId};`,
    },
  });
  return response;
}

export { getInput };