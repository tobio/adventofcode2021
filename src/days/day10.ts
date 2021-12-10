import type {Day} from './index';

const openingToClosing = new Map<string, string>([
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
]);

const closingToCorruptionScore = new Map<string, number>([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137],
]);

const closingToIncompleteScore = new Map<string, number>([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4],
]);

interface ValidationResult {
  corruptionScore: number
  completionScore: number
}

function validateLine(line: string): ValidationResult {
  const stack: string[] = [];

  const firstCorruptedChar = line.split('').find(char => {
    if(openingToClosing.has(char)) stack.push(char);
    else {
      const lastOpening = stack.pop();
      return openingToClosing.get(lastOpening) !== char;
    }
  });

  if(firstCorruptedChar) return {
    completionScore: 0,
    corruptionScore: closingToCorruptionScore.get(firstCorruptedChar)
  };

  const completionChars = stack.map(c => openingToClosing.get(c));
  const completionScore = completionChars.
    map(c => closingToIncompleteScore.get(c)).
    reduceRight(
      (sum, next) => (sum * 5) + next,
      0
    )

  return {
    corruptionScore: 0,
    completionScore,
  };
}

const day: Day = {
  id: 10,
  exec: (input: string) => {
    const lines = input.split('\n');

    const validatedLines = lines.map(validateLine);
    const part1 = validatedLines.reduce((sum, {corruptionScore}) => sum + corruptionScore, 0);

    const incompleteLines = validatedLines.filter(({completionScore}) => completionScore !== 0);
    incompleteLines.sort((a, b) => a.completionScore - b.completionScore);
    const part2 = incompleteLines[Math.floor(incompleteLines.length / 2)].completionScore;

    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`
};

export default day;
