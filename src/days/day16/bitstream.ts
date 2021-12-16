export class BitStream {
  index: number
  constructor(readonly bits: string) {
    this.index = 0;
  }

  read(numberOfBits: number): string {
    const bits = this.bits.slice(this.index, this.index + numberOfBits);
    this.index += numberOfBits;

    return bits;
  }

  static fromHex(hex: string): BitStream {
    const bits = hex.
      split('').
      map(char => parseInt(char, 16).toString(2).padStart(4, '0'))
      .join('');
    return new BitStream(bits);
  }
}
