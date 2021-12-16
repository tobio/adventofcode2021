
abstract class BitsPacket {
  constructor(readonly version: number) {}

  abstract aggregateVersion(): number
  abstract getValue(): number
}

class LiteralPacket extends BitsPacket {
  static typeId = 4
  constructor(version: number, readonly value: number) {
    super(version);
  }

  aggregateVersion(): number { return this.version; }
  getValue(): number { return this.value; }
}

abstract class OperatorPacket extends BitsPacket {
  constructor(version: number, readonly subpackets: BitsPacket[]) {
    super(version);
  }

  aggregateVersion(): number {
    return this.subpackets.reduce((sum, packet) => sum + packet.aggregateVersion(), this.version);
  }
}


class SumPacket extends OperatorPacket {
  static typeId = 0
  constructor(version: number, subpackets: BitsPacket[]) {
    super(version, subpackets);
  }

  getValue(): number {
    return this.subpackets.reduce((sum, packet) => sum + packet.getValue(), 0);
  }
}

class ProductPacket extends OperatorPacket {
  static typeId = 1
  constructor(version: number, subpackets: BitsPacket[]) {
    super(version, subpackets);
  }

  getValue(): number {
    return this.subpackets.reduce((product, packet) => product * packet.getValue(), 1);
  }
}

class MinPacket extends OperatorPacket {
  static typeId = 2
  constructor(version: number, subpackets: BitsPacket[]) {
    super(version, subpackets);
  }

  getValue(): number {
    return this.subpackets.reduce((min, packet) => Math.min(min, packet.getValue()), Number.MAX_SAFE_INTEGER);
  }
}

class MaxPacket extends OperatorPacket {
  static typeId = 3
  constructor(version: number, subpackets: BitsPacket[]) {
    super(version, subpackets);
  }

  getValue(): number {
    return this.subpackets.reduce((min, packet) => Math.max(min, packet.getValue()), Number.MIN_SAFE_INTEGER);
  }
}

class GreaterThanPacket extends OperatorPacket {
  static typeId = 5
  constructor(version: number, subpackets: BitsPacket[]) {
    super(version, subpackets);
  }

  getValue(): number {
    const isGreater = this.subpackets[0].getValue() > this.subpackets[1].getValue();

    return isGreater ? 1 : 0;
  }
}

class LessThanPacket extends OperatorPacket {
  static typeId = 6
  constructor(version: number, subpackets: BitsPacket[]) {
    super(version, subpackets);
  }

  getValue(): number {
    const isLess = this.subpackets[0].getValue() < this.subpackets[1].getValue();

    return isLess ? 1 : 0;
  }
}

class EqualPacket extends OperatorPacket {
  static typeId = 7
  constructor(version: number, subpackets: BitsPacket[]) {
    super(version, subpackets);
  }

  getValue(): number {
    const isEqual = this.subpackets[0].getValue() === this.subpackets[1].getValue();

    return isEqual ? 1 : 0;
  }
}

export type { BitsPacket, OperatorPacket };
export {
  LiteralPacket,
  SumPacket,
  ProductPacket,
  MaxPacket,
  MinPacket,
  LessThanPacket,
  GreaterThanPacket,
  EqualPacket
}
