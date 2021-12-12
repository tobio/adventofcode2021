type Graph = Map<string, string[]>

function parseGraph(input: string): Graph {
  const graph = new Map<string, string[]>();

  const addEdge = (from: string, to: string) => {
    if(to === 'start') return; // I ain't goin back. Bit of a hack since I'm essentially storing directional edges.
    if(!graph.has(from)) graph.set(from, []);

    graph.get(from).push(to);
  }

  input.split('\n').forEach((line) => {
    const [from, to] = line.split('-');

    addEdge(from, to);
    addEdge(to, from);
  });

  return graph;
}

interface TraversalItem {
  path: string[],
  atNode: string
}

const isLargeNode = (node: string) => node.toUpperCase() === node;

const entryRules = {
  singleVisit: (node: string, path: string[]) => isLargeNode(node) || !path.includes(node),
  singleSmallReentry: (node: string, path: string[]) => {
    if(isLargeNode(node)) return true;
    if(!path.includes(node)) return true;

    return Array.from(path.filter(n => !isLargeNode(n)).reduce((entriesPerNode, node) => {
      entriesPerNode.set(node, (entriesPerNode.get(node) || 0) + 1);
      return entriesPerNode;
    }, new Map<string, number>()).values()).every(i => i == 1);
  }
}

function *allPaths(graph: Graph, mayEnter: (node: string, path: string[]) => boolean): Generator<string[], void, void> {
  const toTraverse = [['start']];

  while(toTraverse.length) {
    const path = toTraverse.shift();
    const connectedNodes = graph.get(path[path.length - 1]);

    const pendingTraveral = connectedNodes.filter(node => mayEnter(node, path)).map(node => [...path, node]);
    for (const path of pendingTraveral) {
      if(path[path.length - 1] === 'end') {
        yield path;
      }
      else toTraverse.push(path);
    }
  }
}

export function findPathLengths(input: string) {
  const graph = parseGraph(input);

  const part1Paths = Array.from(allPaths(graph, entryRules.singleVisit));
  const part1 = part1Paths.length;

  const part2Paths = Array.from(allPaths(graph, entryRules.singleSmallReentry));
  const part2 = part2Paths.length;

  console.log('OG Part 1:', part1);
  console.log('OG Part 2:', part2);
}
