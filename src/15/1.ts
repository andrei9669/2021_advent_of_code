import fs from 'fs';
import path from 'path';

const text = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').trim();

const inputNumbers: number[][] = text
  .split('\n')
  .map((row) => row.split('').map((num) => Number(num)));

const getMap = (multiplier: number): number[][] => {
  const height = inputNumbers.length;
  const width = inputNumbers[0].length;
  const result: number[][] = [];
  for (let Y = 0, multY = 0; Y < multiplier * height; Y += height, multY++) {
    for (let X = 0, multX = 0; X < multiplier * width; X += width, multX++) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (result[y + Y] === undefined) {
            result[y + Y] = [];
          }
          let newRisk = inputNumbers[y][x] + multY + multX;
          while (newRisk > 9) {
            newRisk -= 9;
          }
          result[y + Y][x + X] = newRisk;
        }
      }
    }
  }
  return result;
};

function* getNeighbours(x: number, y: number) {
  yield [y, x - 1];
  yield [y - 1, x];
  yield [y, x + 1];
  yield [y + 1, x];
}

class Graph {
  vertices: string[] = [];

  adjacencyList: Record<string, Record<string, number>> = {};

  addVertex(vertex: string) {
    this.vertices.push(vertex);
    this.adjacencyList[vertex] = {};
  }

  addEdge(vertex1: string, vertex2: string, weight: number) {
    this.adjacencyList[vertex1][vertex2] = weight;
  }

  dijkstra(source: string, finish: string) {
    let fin = 0;
    const distances: Record<string, number> = {};
    const visited = new Set<string>();
    const touched: Record<string, number> = {};
    for (let i = 0; i < this.vertices.length; i++) {
      if (this.vertices[i] === source) {
        distances[source] = 0;
      } else {
        distances[this.vertices[i]] = Infinity;
      }
    }

    let currVertex = Graph.vertexWithMinDistance(distances, visited);
    // progress log, high effect on performance
    // let sum = 0;
    // let measurements = 0;

    while (currVertex !== null) {
      if (currVertex === finish) fin = distances[currVertex] ?? 0;
      // progress log, high effect on performance
      // const t1 = performance.now();
      const distance = distances[currVertex];
      if (distance !== undefined) delete touched[currVertex];

      const neighbors = this.adjacencyList[currVertex];
      Object.keys(neighbors).forEach((neighbor) => {
        const newDistance = distance + neighbors[neighbor];
        if (distances[neighbor] > newDistance) {
          distances[neighbor] = newDistance;
          touched[neighbor] = newDistance;
        }
      });
      visited.add(currVertex);
      currVertex = Graph.vertexWithMinDistance(touched, visited);
      // progress log, high effect on performance
      // const t2 = performance.now();
      // sum += t2 - t1;
      // const average = sum / ++measurements;
      // process.stdout.write(
      //   `\r${this.vertices.length - visited.size} - ${average}`,
      // );
    }
    return fin;
  }

  static vertexWithMinDistance(
    distances: Record<string, number>,
    visited: Set<string>,
  ): null | string {
    let minDistance = Infinity;
    let minVertex = null;
    Object.keys(distances).forEach((vertex) => {
      const distance = distances[vertex];
      if (distance < minDistance && !visited.has(vertex)) {
        minDistance = distance;
        minVertex = vertex;
      }
    });
    return minVertex;
  }
}

const getVertex = (x: number, y: number) =>
  `${y.toString().padStart(5, '0')}_${x.toString().padStart(5, '0')}`;

const t11 = performance.now();
const graph = new Graph();
const expanded = getMap(5);

expanded.forEach((row, y) =>
  row.forEach((cell, x) => {
    const vertex1 = getVertex(x, y);
    graph.addVertex(vertex1);
    // eslint-disable-next-line no-restricted-syntax -- generator
    for (const [Y, X] of getNeighbours(x, y)) {
      const weight = expanded?.[Y]?.[X];
      if (weight !== undefined) {
        const vertex2 = getVertex(X, Y);
        graph.addEdge(vertex1, vertex2, weight);
      }
    }
  }),
);
console.log('edges:', Object.keys(graph.adjacencyList).length);
const [y, x] = [expanded.length - 1, expanded[0].length - 1];
const risk = graph.dijkstra(getVertex(0, 0), getVertex(x, y));
const t12 = performance.now();
console.log(`\n${risk}`);
console.log((t12 - t11) / 1000);
// part1 - 581
// part2 - 2916
