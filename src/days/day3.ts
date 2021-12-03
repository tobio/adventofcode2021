import type {Day} from './index';

class Bit {
  private ones = 0
  private zeros = 0

  countDigit(digit: number) {
    if(digit) this.ones++;
    else this.zeros++;
  }

  mostSignificantDigit(): 0 | 1 {
    return this.ones >= this.zeros ? 1 : 0;
  }

  lestSignificantDigit(): 0 | 1 {
    return this.mostSignificantDigit() === 0 ? 1 : 0;
  }

  calculateGamma(bitPosition: number): number {
    if (this.mostSignificantDigit() === 0) return 0;

    return Math.pow(2, bitPosition);
  }

  calculateEpsilon(bitPosition: number): number {
    if (this.lestSignificantDigit() === 0) return 0;

    return Math.pow(2, bitPosition);
  }
}

function parseDiagnosticLine(line: string, digits: Map<number, Bit>): void {
  Array.from(line).reverse().forEach((digit, index) => {
    if(!digits.has(index)) {
      digits.set(index, new Bit());
    }
    digits.get(index).countDigit(Number(digit));
  });
}

function part1(lines: string[]): number {
  const digits = new Map<number, Bit>();
  lines.map(line => parseDiagnosticLine(line, digits));

  const digitsAsArray = Array.from(digits.entries());

  const gamma = digitsAsArray.reduce((sum, [bitPosition, currentBit]) => sum + currentBit.calculateGamma(bitPosition), 0);
  const epsilon = digitsAsArray.reduce((sum, [bitPosition, currentBit]) => sum + currentBit.calculateEpsilon(bitPosition), 0);

  return gamma * epsilon;
}

function findLifeSupportValue(lines: string[], bitFilter: (value: number, bit: Bit) => boolean): number {
  let possibleValues = lines;

  Array.from(lines[0]).map((_, index) => index).some((index) => {
    const bit = new Bit();

    possibleValues.forEach(line => {
      const digit = Number(line.charAt(index));
      bit.countDigit(digit);
    });

    possibleValues = possibleValues.filter(line => bitFilter(Number(line.charAt(index)), bit));

    return possibleValues.length == 1;
  });

  return possibleValues.map(v => parseInt(v, 2))[0] || 0;
}

function part2(lines: string[]): number {
  const o2Value = findLifeSupportValue(lines, (value: number, bit: Bit) => value === bit.mostSignificantDigit());
  const co2Value = findLifeSupportValue(lines, (value: number, bit: Bit) => value === bit.lestSignificantDigit());

  return o2Value * co2Value;
}

const day: Day = {
  id: 3,
  exec: (input: string) => {
    const lines = input.split('\n');

    const p1 = part1(lines);
    const p2 = part2(lines);

    console.log('Part 1:', p1);
    console.log('Part 2:', p2);
  },
  sampleInput: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`
};

export default day;
