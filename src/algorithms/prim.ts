import type { Connection, Location, PrimResult } from '../types/graph'

export function calculatePrimMst(
  locations: Location[],
  connections: Connection[],
): PrimResult {
  if (locations.length === 0) {
    return { edges: [], totalCost: 0, visitedIds: [], isConnected: true }
  }

  const visited = new Set<string>([locations[0].id])
  const selected: Connection[] = []

  while (visited.size < locations.length) {
    const candidate = connections
      .filter(
        (connection) =>
          (visited.has(connection.from) && !visited.has(connection.to)) ||
          (visited.has(connection.to) && !visited.has(connection.from)),
      )
      .sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id))[0]

    if (!candidate) {
      break
    }

    selected.push(candidate)
    visited.add(candidate.from)
    visited.add(candidate.to)
  }

  return {
    edges: selected,
    totalCost: selected.reduce((sum, connection) => sum + connection.cost, 0),
    visitedIds: [...visited],
    isConnected: visited.size === locations.length,
  }
}
