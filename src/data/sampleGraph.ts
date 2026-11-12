import type { Connection, Location } from '../types/graph'

export const sampleLocations: Location[] = [
  { id: 'hq', name: 'HQ Campus', type: 'campus', x: 18, y: 48 },
  { id: 'north', name: 'North Office', type: 'office', x: 48, y: 16 },
  { id: 'east', name: 'East Data Center', type: 'data-center', x: 82, y: 32 },
  { id: 'south', name: 'South Warehouse', type: 'warehouse', x: 72, y: 78 },
  { id: 'west', name: 'West Office', type: 'office', x: 28, y: 84 },
]

export const sampleConnections: Connection[] = [
  { id: 'hq-north', from: 'hq', to: 'north', cost: 420 },
  { id: 'hq-west', from: 'hq', to: 'west', cost: 280 },
  { id: 'hq-east', from: 'hq', to: 'east', cost: 690 },
  { id: 'north-east', from: 'north', to: 'east', cost: 310 },
  { id: 'north-south', from: 'north', to: 'south', cost: 560 },
  { id: 'east-south', from: 'east', to: 'south', cost: 240 },
  { id: 'west-south', from: 'west', to: 'south', cost: 470 },
  { id: 'west-north', from: 'west', to: 'north', cost: 520 },
]
