import fs from 'fs';
import path from 'path';

const input = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .trim();

type Vertex = {
  edge: string;
  vertices: Record<string, Vertex>;
  isSmall: boolean;
  visited: number;
};

const data = input.split('\n').map((row) => row.split('-'));
const getEdge = (edge: string) => ({
  edge,
  vertices: {},
  isSmall: edge.toUpperCase() !== edge,
  visited: 0,
});

const graph = data.reduce<Record<string, Vertex>>((acc, [edge1, edge2]) => {
  if (acc[edge1] === undefined) {
    acc[edge1] = getEdge(edge1);
  }
  if (acc[edge2] === undefined) {
    acc[edge2] = getEdge(edge2);
  }
  acc[edge1].vertices[edge2] = acc[edge2];
  acc[edge2].vertices[edge1] = acc[edge1];
  return acc;
}, {});

const traverse = (
  vertexKey: string,
  doubleVisited: boolean,
): string[][] | undefined => {
  const vertex = graph[vertexKey];
  let double = doubleVisited;
  if (vertexKey === 'end') {
    return [[vertexKey]];
  }
  if (vertex.visited === 2 || (doubleVisited && vertex.visited === 1)) {
    return undefined;
  }
  if (vertex.isSmall) {
    vertex.visited++;
    if (!doubleVisited && vertex.visited === 2) {
      double = true;
    }
  }
  const pathVertices: string[][][] = [];
  Object.keys(vertex.vertices).forEach((childVertex) => {
    if (childVertex !== 'start') {
      const vertexPaths = traverse(childVertex, double);
      if (vertexPaths !== undefined) {
        vertexPaths.forEach((el) => el.unshift(vertexKey));
        pathVertices.push(vertexPaths);
      }
    }
  });
  vertex.visited--;
  return pathVertices.flat();
};
const t = traverse('start', false);
const result = t?.map((row) => row.join(','));
console.log(result?.length);
// 118803
