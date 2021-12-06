import type {Day} from './index';

class Board {
  unmatchedRows: Array<Set<number>>
  unmatchedColumns: Array<Set<number>>
  isComplete: boolean
  score: number

  constructor(input: string, readonly id: number) {
    const inputRows = input.trim().split('\n');

    const rowItems = inputRows.map(row => row.trim().split(/\s+/).map(Number));
    this.unmatchedRows = rowItems.map(r => new Set(r));
    this.unmatchedColumns = rowItems[0].map(_ => new Set<number>());
    rowItems.forEach(row => {
      row.forEach((item, column) => this.unmatchedColumns[column].add(item));
    });
  }

  private checkNumberSet(i: number, set: Array<Set<number>>): [boolean, boolean] {
    let didWin = false
    let didExist = false
    set.forEach(item => {
      if(item.delete(i)) {
        didExist = true;
        if(item.size === 0) didWin = true;
      }
    });

    return [didExist, didWin];
  }

  private calculateScore(lastNumberCalled: number): number {
    const unmatchedSum = this.unmatchedColumns.reduce((sum, column) =>
      sum + Array.from(column.values()).reduce((sum, current) => sum + current, 0),
      0
    );

    return unmatchedSum * lastNumberCalled;
  }

  numberCalled(i: number): boolean {
    if(this.isComplete) return false;

    const [exists, columnsWinning] = this.checkNumberSet(i, this.unmatchedColumns);
    const rowsWinning = exists && this.checkNumberSet(i, this.unmatchedRows)[1];

    if(!columnsWinning && !rowsWinning) return false;

    this.isComplete = true;
    this.score = this.calculateScore(i);

    return this.isComplete;
  }
}

interface ParsedInput {
  numbers: number[]
  boards: Board[]
}

function parseInput(input: string): ParsedInput {
  const [numbersAsString, ...boardStrings] = input.split('\n\n');

  const boards = boardStrings.map((b, index) => new Board(b, index));
  const numbers = numbersAsString.split(',').map(Number);

  return {
    numbers,
    boards
  }
}

function scoreBoards({numbers, boards}: ParsedInput): Board[] {
  const boardsByWinOrder: Board[] = [];
  let incompleteBoards = boards;
  numbers.every(i => {
    const winningBoards = incompleteBoards.filter(board => board.numberCalled(i));
    incompleteBoards = incompleteBoards.filter(b => !b.isComplete);

    winningBoards.forEach(board => boardsByWinOrder.push(board));
    return !!incompleteBoards.length;
  });

  return boardsByWinOrder;
}

const day: Day = {
  id: 4,
  exec: (input: string) => {
    const parsedInput = parseInput(input);
    const boardsByWinOrder = scoreBoards(parsedInput);

    const part1 = boardsByWinOrder[0].score;
    const part2 = boardsByWinOrder[boardsByWinOrder.length - 1].score;


    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  },
  sampleInput: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`
};

export default day;
