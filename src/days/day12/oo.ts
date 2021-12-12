class Cave {
  size: 'small' | 'large'
  private connectedTo: Cave[]
  constructor(readonly name: string) {
    this.size = name.toUpperCase() === name ? 'large' : 'small';
    this.connectedTo = [];
  }

  addEdge(to: Cave) {
    if(to.name === 'start') return; // Once you enter the impossible labyrinth there's no going back
    this.connectedTo.push(to);
  }

  traversableNodes(filter: (cave: Cave) => boolean): Cave[] {
    return this.connectedTo.filter(filter);
  }

  isEnd() { return this.name === 'end'; }
}

type Path = Cave[]

class Graph {
  constructor(readonly start: Cave) {}

  static parse(input: string): Graph {
    const cavesByName = new Map<string, Cave>();
    const getCave = (name: string): Cave => {
      if(!cavesByName.has(name)) cavesByName.set(name, new Cave(name));
      return cavesByName.get(name);
    }
    input.split('\n').forEach((line) => {
      const [from, to] = line.split('-').map(getCave);

      from.addEdge(to);
      to.addEdge(from);
    });

    return new Graph(cavesByName.get('start'));
  }
}

type EntryRuleset = (cave: Cave, path: Path) => boolean;

class DFSGraphTraverser {
  traverseAllPaths(graph: Graph, mayEnter: EntryRuleset): Generator<Path, void, void> {
    return this.traverse(graph.start, [], mayEnter);
  }

  private * traverse(current: Cave, path: Path, mayEnter: EntryRuleset): Generator<Path, void, void> {
    path.push(current);
    if(current.isEnd()) yield [...path];
    else {
      for (const cave of current.traversableNodes((c) => mayEnter(c, path))) {
        for (const p of this.traverse(cave, path, mayEnter)) {
          yield p
        }
      }
    }

    // Remove the current cave from the path
    path.pop();
  }
}

class BFSGraphTraverser {
  * traverseAllPaths(graph: Graph, mayEnter: EntryRuleset): Generator<Path, void, void> {
    const toTraverse: Path[] = [[graph.start]];

    while(toTraverse.length) {
      const path = toTraverse.shift();
      const atNode = path[path.length - 1];

      const pendingTraversal = atNode.traversableNodes((c) => mayEnter(c, path)).map((c) => ({to: c, path: [...path, c]}))
      for (const {to, path} of pendingTraversal) {
        if(to.isEnd()) yield path;
        else toTraverse.push(path);
      }
    }
  }
}

const entryRulesets: Record<string, EntryRuleset> = {
  smallCaveSingleEntry: (cave: Cave, path: Path) => cave.size === 'large' || !path.includes(cave),
  singleSmallCaveDualEntry: (cave: Cave, path: Path) => {
    if(cave.size === 'large') return true;
    if(!path.includes(cave)) return true;

    return Array.from(path.filter(c => c.size === 'small').reduce((entriesPerCave, cave) => {
      entriesPerCave.set(cave.name, (entriesPerCave.get(cave.name) || 0) + 1);
      return entriesPerCave;
    }, new Map<string, number>()).values()).every(i => i == 1);
  }
}

export function findPathLengths(input: string) {
  const graph = Graph.parse(input);

  const bfsTraverse = new BFSGraphTraverser();
  const dfsTraverse = new DFSGraphTraverser();

  const bfsStart = Date.now();
  const part1Paths = Array.from(bfsTraverse.traverseAllPaths(graph, entryRulesets.smallCaveSingleEntry));
  const part1 = part1Paths.length;

  const part2Paths = Array.from(bfsTraverse.traverseAllPaths(graph, entryRulesets.singleSmallCaveDualEntry));
  const part2 = part2Paths.length;

  const dfsStart = Date.now()
  const part1PathsDFS = Array.from(dfsTraverse.traverseAllPaths(graph, entryRulesets.smallCaveSingleEntry));
  const part2PathsDFS = Array.from(dfsTraverse.traverseAllPaths(graph, entryRulesets.singleSmallCaveDualEntry));
  const dfsEnd = Date.now();

  console.log('OO Part 1:', part1);
  console.log('OO Part 2:', part2);
  console.log('Times: ', dfsStart - bfsStart, dfsEnd - dfsStart);
}
