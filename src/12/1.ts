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
type U = undefined;

const data = input.split('\n').map((row) => row.split('-'));
const getEdge = (edge: string) => ({
  edge,
  vertices: {},
  isSmall: edge.toUpperCase() !== edge,
  visited: 0,
});

const graph = data.reduce<Record<string, Vertex>>((acc, [edge1, edge2]) => {
  if (acc[edge1] === undefined) acc[edge1] = getEdge(edge1);
  if (acc[edge2] === undefined) acc[edge2] = getEdge(edge2);
  if (edge2 !== 'start') acc[edge1].vertices[edge2] = acc[edge2];
  if (edge1 !== 'start') acc[edge2].vertices[edge1] = acc[edge1];
  return acc;
}, {});

const traverse = (vertexKey: string, dVisited = false): string[][] | U => {
  if (vertexKey === 'end') return [[vertexKey]];
  const vertex = graph[vertexKey];
  let double = dVisited;
  if (vertex.visited === 2 || (dVisited && vertex.visited === 1))
    return undefined;
  if (vertex.isSmall) vertex.visited++;
  if (!dVisited && vertex.visited === 2) double = true;
  const keys = Object.keys(vertex.vertices);
  const pathVertices = keys.reduce((acc, childVertex) => {
    const vertexPaths = traverse(childVertex, double);
    if (vertexPaths !== undefined) {
      vertexPaths.forEach((el) => el.unshift(vertexKey));
      acc.push(vertexPaths);
    }
    return acc;
  }, [] as string[][][]);
  vertex.visited--;
  return pathVertices.flat();
};
console.log(traverse('start', false)?.length);
