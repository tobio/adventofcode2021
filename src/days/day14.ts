import type {Day} from './index';

type Polymer = Map<string, number>;

const START_END_TOKEN = '0';

function parseInput(input: string): [Polymer, Map<string, string>] {
  const [template, insertionRules] = input.split('\n\n');

  const insertionMapEntries: [string, string][] = insertionRules.split('\n').map(rule => rule.split(' -> ') as [string, string]);
  const polymer = new Map<string, number>();
  for(let i = 1; i < template.length; i++) {
    const pair = template.slice(i - 1, i + 1);
    polymer.set(pair, 1 + (polymer.get(pair) || 0));
  }

  const start = `${START_END_TOKEN}${template.charAt(0)}`;
  const end = `${template.charAt(template.length - 1)}${START_END_TOKEN}`;
  polymer.set(start, 1);
  polymer.set(end, 1);

  return [polymer, new Map<string, string>(insertionMapEntries)]
}

function step(polymer: Polymer, rules: Map<string, string>): Polymer {
  const applicablePairs = Array.from(polymer.entries());
  const nextPolymer = new Map<string, number>();
  for (const [pair, count] of applicablePairs) {
    if(!rules.has(pair)) {
      nextPolymer.set(pair, count);
      continue;
    }

    const insert = rules.get(pair);
    const first = `${pair.charAt(0)}${insert}`;
    const second = `${insert}${pair.charAt(1)}`;

    incrementMapCount(nextPolymer, first, count);
    incrementMapCount(nextPolymer, second, count);
  }

  return nextPolymer;
}

function steps(n: number, initialPolymer: Polymer, rules: Map<string, string>): Polymer {
  return new Array(n).fill(true).reduce((polymer) => step(polymer, rules), initialPolymer);
}

function incrementMapCount(map: Map<string, number>, key: string, by: number) {
  map.set(key, by + (map.get(key) || 0));
}

function scorePolymer(polymer: Polymer): number {
  const items = new Map<string, number>();
  Array.from(polymer.entries()).forEach(([pair, count]) => {
    incrementMapCount(items, pair.charAt(0), count / 2);
    incrementMapCount(items, pair.charAt(1), count / 2);
  });

  items.delete(START_END_TOKEN);

  const sortedCounts = Array.from(items.entries());
  sortedCounts.sort((a, b) => a[1] - b[1]);

  return sortedCounts[sortedCounts.length - 1][1] - sortedCounts[0][1];
}

const day: Day = {
  id: 14,
  exec: (input: string) => {
    const [template, insertionRules] = parseInput(input);

    const part1Polymer = steps(10, template, insertionRules);
    const part1 = scorePolymer(part1Polymer);

    const part2Polymer = steps(30, part1Polymer, insertionRules);
    const part2 = scorePolymer(part2Polymer);

    console.log('Part 1', part1);
    console.log('Part 2', part2);
  },
  sampleInput: `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`
};

export default day;
