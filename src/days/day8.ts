import type {Day} from './index';

interface DigitClassifier {
  digit: number,
  classifier: (segments: Set<string>, knownDigits: Map<number, Set<string>>) => boolean
}

const simpleDigitClassifiers: DigitClassifier[] = [
  {digit: 1, classifier: (segments: Set<string>) => segments.size === 2},
  {digit: 4, classifier: (segments: Set<string>) => segments.size === 4},
  {digit: 7, classifier: (segments: Set<string>) => segments.size === 3},
  {digit: 8, classifier: (segments: Set<string>) => segments.size === 7},
];

const allDigitClassifiers: DigitClassifier[] = [
  ...simpleDigitClassifiers,
  {
    digit: 9,
    classifier: (segments: Set<string>, knownDigits: Map<number, Set<string>>) => {
      if (segments.size !== 6) return false;
      const four = knownDigits.get(4);
      const diff = new Set(segments);
      four.forEach(i => diff.delete(i));
      return diff.size === 2;
    }
  },
  {
    digit: 0,
    classifier: (segments: Set<string>, knownDigits: Map<number, Set<string>>) => {
      if (segments.size !== 6) return false;
      const one = knownDigits.get(1);
      const diff = new Set(segments);
      one.forEach(i => diff.delete(i));
      return diff.size === 4;
    }
  },
  {
    digit: 6,
    classifier: (segments: Set<string>, knownDigits: Map<number, Set<string>>) => {
      return segments.size === 6;
    }
  },
  {
    digit: 3,
    classifier: (segments: Set<string>, knownDigits: Map<number, Set<string>>) => {
      if(segments.size !== 5) return false;
      const one = knownDigits.get(1);
      const diff = new Set(segments);
      one.forEach(i => diff.delete(i));
      return diff.size === 3;
    }
  },
  {
    digit: 5,
    classifier: (segments: Set<string>, knownDigits: Map<number, Set<string>>) => {
      if(segments.size !== 5) return false;
      const diff = new Set(knownDigits.get(6));
      segments.forEach(i => diff.delete(i));
      return diff.size === 1;
    }
  },
  {
    digit: 2,
    classifier: (segments: Set<string>, knownDigits: Map<number, Set<string>>) => {
      return segments.size === 5;
    }
  },
]

interface SegmentDiagnostic {
  inputs: Array<Set<string>>,
  outputs: string[]
}

function parseInput(input: string): SegmentDiagnostic[] {
  return input.split('\n').map(line => {
    const [inputs, outputs] = line.split(' | ');

    return {
      inputs: inputs.split(' ').map(i => new Set(i.split(''))),
      outputs: outputs.split(' ').map(i => i.split('').sort().join('')),
    };
  })
}

function decodeKnownDigits(diagnostic: SegmentDiagnostic, classifiers: DigitClassifier[]): number[] {
  const knownDigits = new Map<number, Set<string>>();
  let remainingInputs = diagnostic.inputs.map((input, index) => ({input, index}));
  classifiers.forEach(c => {
    const matchingInput = remainingInputs.filter(i => c.classifier(i.input, knownDigits))[0];
    remainingInputs = remainingInputs.filter(i => i.index !== matchingInput.index);
    knownDigits.set(c.digit, matchingInput.input);
  });

  const segments = new Map(
    Array.from(knownDigits.entries()).map(([key, value]) => [Array.from(value).sort().join(''), key])
  );

  return diagnostic.outputs.filter(o => segments.has(o)).map(o => segments.get(o));
}

const day: Day = {
  id: 8,
  exec: (input: string) => {
    const diagnostics = parseInput(input);

    const part1Digits = diagnostics.map(d => decodeKnownDigits(d, simpleDigitClassifiers));
    const part1 = part1Digits.reduce((sum, next) => sum + next.length, 0);

    const part2Digits = diagnostics.map(d => decodeKnownDigits(d, allDigitClassifiers));
    const part2 = part2Digits.map(d => Number(d.join(''))).reduce((sum, next) => sum + next, 0);


    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`
};

export default day;
