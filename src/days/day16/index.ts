import type {Day} from '../index';
import {BitStream} from './bitstream';
import {
  LiteralPacket,
  SumPacket,
  ProductPacket,
  MaxPacket,
  MinPacket,
  LessThanPacket,
  GreaterThanPacket,
  EqualPacket
} from './packets';
import type {OperatorPacket, BitsPacket} from './packets';

type PacketParser = (input: BitStream) => BitsPacket;

const operators = [
  SumPacket,
  ProductPacket,
  MinPacket,
  MaxPacket,
  GreaterThanPacket,
  LessThanPacket,
  EqualPacket
];

const operatorsByTypeId = new Map<number, new (version: number, subpackets: BitsPacket[]) => OperatorPacket>(
  operators.map((Type) => [Type.typeId, Type])
);

function parseInput(input: BitStream): BitsPacket {
  const version = parseInt(input.read(3), 2);
  const typeId = parseInt(input.read(3), 2);

  return getPacketParser(version, typeId)(input);
}

function makeLiteralParser(version: number): PacketParser {
  return (input: BitStream) => {
    let finalValueBits = '';

    while(true) {
      const leading = input.read(1);
      const bits = input.read(4);

      finalValueBits += bits;
      if(leading === '0') break;
    }

    const value = parseInt(finalValueBits, 2);
    return new LiteralPacket(version, value);
  };
}

function parseSubpacketBits(input: BitStream, numberOfBits: number): BitsPacket[] {
  const readUntil = input.index + numberOfBits;
  const packets: BitsPacket[] = [];

  while(input.index < readUntil) {
    packets.push(parseInput(input));
  }

  return packets;
}

function makeOperatorParser(version: number, typeId: number): PacketParser {
  const Operator = operatorsByTypeId.get(typeId);
  return (input: BitStream) => {
    const lengthBit = input.read(1);
    let subpackets: BitsPacket[];

    if(lengthBit === '0') {
      const numberOfPacketBits = parseInt(input.read(15), 2);
      subpackets = parseSubpacketBits(input, numberOfPacketBits);
    } else {
      const numberOfPackets = parseInt(input.read(11), 2);
      subpackets = new Array(numberOfPackets).fill(true).map(_ => parseInput(input));
    }

    return new Operator(version, subpackets);
  };
}

function getPacketParser(version: number, typeId: number): PacketParser {
  return typeId === LiteralPacket.typeId ?
    makeLiteralParser(version) :
    makeOperatorParser(version, typeId);
}

const day: Day = {
  id: 16,
  exec: (input: string) => {
    const packets = input.
      split('\n').
      map(line => ({line, bitstream: BitStream.fromHex(line)})).
      map(({line, bitstream}) => ({line, packet: parseInput(bitstream)}));

    packets.forEach(({line, packet}) => {
      console.log(line);
      console.log('Part 1', packet.aggregateVersion());
      console.log('Part 2', packet.getValue());
      console.log();
    });
  },
  sampleInput: `C200B40A82
04005AC33890
880086C3E88112
CE00C43D881120
D8005AC2A8F0
8A004A801A8002F478
620080001611562C8802118E34
C0015000016115A2E0802F182340
A0016C880162017C3686B18A3D4780`
};

export default day;
