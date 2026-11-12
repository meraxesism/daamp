export type Location = {
  id: string
  name: string
  type: 'office' | 'data-center' | 'warehouse' | 'campus'
  x: number
  y: number
}

export type Connection = {
  id: string
  from: string
  to: string
  cost: number
}

export type PrimResult = {
  edges: Connection[]
  totalCost: number
  visitedIds: string[]
  isConnected: boolean
}
