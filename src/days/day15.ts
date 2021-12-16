import type {Day} from './index';
import Heap from 'heap';

class Vertex {
  edges: Map<string, number>

  constructor(readonly name: string, readonly weight: number) {
    this.edges = new Map<string, number>();
  }

  addEdge(to: string, weight: number) {
    this.edges.set(to, weight);
  }
}

interface Graph {
  verticesByName: Map<string, Vertex>
  start: Vertex
  end: Vertex
}

function parseGraph(input: string): Graph {
  const verticesByName = new Map<string, Vertex>();

  const nameVertex = (row: number, column: number) => `${row}x${column}`;

  const getAdjacents = (row: number, column: number) => [
    verticesByName.get(nameVertex(row, column - 1)),
    verticesByName.get(nameVertex(row, column + 1)),
    verticesByName.get(nameVertex(row + 1, column)),
    verticesByName.get(nameVertex(row - 1, column)),
  ].filter(v => !!v);

  const rows = input.split('\n');
  const vertices = rows.flatMap((line, row) => line.
      split('').
      map(Number).
      map((weight, column) => ({
        row,
        column,
        vertex: new Vertex(nameVertex(row, column), weight)
      })));

  vertices.forEach(({vertex}) => verticesByName.set(vertex.name, vertex));
  vertices.forEach(({row, column, vertex}) => {
    getAdjacents(row, column).forEach(adjacent => vertex.addEdge(adjacent.name, adjacent.weight));
  });

  return {
    verticesByName,
    start: verticesByName.get(nameVertex(0, 0)),
    end: verticesByName.get(nameVertex(rows.length - 1, rows[0].length - 1))
  }
}

interface PathDistance {
  to: string
  distance: number
}

function findShortestPath(graph: Graph): [string[], number] {
  const distances = new Heap<PathDistance>((a, b) => a.distance - b.distance);
  const distancesByName = new Map<string, PathDistance>();

  const setDistance = (distance: PathDistance) => {
    if(!distancesByName.has(distance.to)) {
      distancesByName.set(distance.to, distance);
      distances.push(distance);
    } else {
      distances.updateItem(distance);
    }
  };

  setDistance({to: graph.end.name, distance: Number.POSITIVE_INFINITY});
  setDistance({to: graph.start.name, distance: 0});

  const parents = new Map<string, string>();
  const visited = new Set<string>();

  for(let next = distances.pop(); next.to !== graph.end.name; next = distances.pop()) {
    distancesByName.delete(next.to);
    const currentFromStart = next.distance;
    const nextVertex = graph.verticesByName.get(next.to);

    for (const [name, weight] of nextVertex.edges.entries()) {
      if(name === graph.start.name) continue;
      if(visited.has(name)) continue;
      const distanceThroughCurrent = currentFromStart + weight;

      const existingDistance = distancesByName.get(name) || {
        to: name,
        distance: Number.POSITIVE_INFINITY
      };

      if(distanceThroughCurrent < existingDistance.distance) {
        existingDistance.distance = distanceThroughCurrent;
        setDistance(existingDistance);
        parents.set(name, next.to);
      }
    }

    visited.add(next.to);
  }

  const reversePath = [graph.end.name];
  for(let parent = parents.get(graph.end.name); !!parent; parent = parents.get(parent)) {
    reversePath.push(parent);
  }

  return [reversePath.reverse(), distancesByName.get(graph.end.name).distance];
}

function copyInput(input: string): string {
  return input.
    split('\n').
    map(line => line.split('').map(i => {
      if(i === ' ') return i;
      const next = parseInt(i, 10) + 1;
      return next > 9 ? 1 : next;
    }).join('')).
    join('\n');
}

function joinRows(left: string, right: string): string {
  const leftRows = left.split('\n');
  const rightRows = right.split('\n');

  return leftRows.map((row, index) => `${row}${rightRows[index]}`).join('\n');
}

function makePart2Input(input: string): string {
  const wideInput = new Array(4).
    fill(true).
    reduce(({full, last}) => {
      const current = copyInput(last);

      return {
        full: joinRows(full, current),
        last: current
      }
    }, {full: input, last: input}).full;


  return new Array(4).
    fill(true).
    reduce(({full, last}) => {
      const current = copyInput(last);

      return {
        full: [...full, current],
        last: current
      }
    }, {full: [wideInput], last: wideInput}).full.join('\n');
}

const day: Day = {
  id: 15,
  exec: (input: string) => {
    const graph = parseGraph(input);

    const [part1Path, part1] = findShortestPath(graph);

    console.log('Part 1', part1);

    const part2Input = makePart2Input(input);
    // console.log(part2Input);
    const part2Graph = parseGraph(part2Input);
    const [part2Path, part2] = findShortestPath(part2Graph);
    console.log('Part 2', part2);
  },
  sampleInput: `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`
};

export default day;
