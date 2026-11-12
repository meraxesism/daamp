# NetStruct

**NetStruct** is an interactive network infrastructure designer and algorithm visualizer. It helps you model locations such as offices, campuses, warehouses, and data centers, then uses **Prim's Algorithm** to find the lowest-cost set of connections that keeps every location connected.

The project is designed as a practical demonstration of a **greedy algorithm** and the **Minimum Spanning Tree (MST)** problem.

## What the application does

NetStruct represents an infrastructure plan as a weighted, undirected graph:

- **Locations** are graph vertices.
- **Connections** are graph edges.
- **Connection costs** are edge weights.
- **The optimized network** is the Minimum Spanning Tree produced by Prim's Algorithm.

The interface lets you compare the complete network of possible routes with the optimized backbone and see the potential cost savings.

## Main features

- Add locations and choose their type:
  - Office
  - Data center
  - Warehouse
  - Campus
- Add weighted connections between locations.
- Prevent duplicate connections and invalid or non-positive costs.
- Load and restore a ready-to-use sample network.
- View the full network in an interactive SVG canvas.
- Select locations to highlight their connected routes.
- Run Prim's Algorithm to display the optimized MST.
- Compare:
  - Current network cost
  - Optimized network cost
  - Potential savings
  - Savings percentage
- Show a clear warning when the graph is disconnected.
- Responsive layout for desktop and smaller screens.

## How to use the web app

### 1. Add locations

Use the **New location** form in the left panel:

1. Enter a name, such as `Midtown Office`.
2. Select a location type.
3. Click **Add location**.

New locations are placed automatically on the network canvas. Click a location in the list or on the canvas to select it.

### 2. Add possible connections

Use the **New connection** form:

1. Choose a starting location.
2. Choose a destination location.
3. Enter the installation cost or distance.
4. Click **Add connection**.

Connections are undirected, so the route from A to B is equivalent to the route from B to A. The app rejects self-connections, duplicate routes, and invalid costs.

### 3. Explore the full network

The **Full network** tab shows every possible connection. Edge labels display the cost of each route. Selecting a location highlights the routes connected to it.

### 4. Run the optimizer

Click **Run optimizer** to apply Prim's Algorithm. The app switches to the **MST result** tab and highlights only the connections selected for the Minimum Spanning Tree.

For a connected graph with `V` locations, the MST contains exactly `V - 1` connections.

### 5. Read the results

The results panel shows:

- **Current network cost**: the sum of all possible connection costs.
- **Optimized network cost**: the cost of the selected MST connections.
- **Potential savings**: current network cost minus optimized network cost.
- **Savings percentage**: potential savings as a percentage of the current network cost.

If the graph is disconnected, NetStruct does not present a partial result as a successful optimization. Instead, it asks you to add the missing connections.

## How Prim's Algorithm works here

Prim's Algorithm builds a Minimum Spanning Tree one location at a time:

1. Start with the first location in the graph.
2. Look at all connections from the visited part of the network to an unvisited location.
3. Select the lowest-cost connection.
4. Add the newly reached location to the visited set.
5. Repeat until every location is visited.

The implementation sorts available candidate edges by cost at each step. The result includes:

- Selected MST connections
- Total MST cost
- IDs of visited locations
- A connectivity flag

The core algorithm is kept as a pure function in [`src/algorithms/prim.ts`](./src/algorithms/prim.ts), separate from the React UI.

## Project structure

```text
src/
├── algorithms/
│   └── prim.ts          # Prim's Algorithm implementation
├── data/
│   └── sampleGraph.ts   # Initial sample locations and connections
├── types/
│   └── graph.ts        # Location, Connection, and PrimResult types
├── App.tsx             # Main dashboard and graph editor
├── App.css             # Dashboard and visualization styles
├── index.css           # Global styles and fonts
└── main.tsx            # React application entry point
```

## Technology stack

- React
- TypeScript
- Vite
- SVG for graph rendering
- Oxlint for linting
- CSS with responsive media queries

No graph visualization library is required. The network canvas is rendered directly with SVG so edges, labels, node positions, and MST highlighting remain easy to understand and customize.

## Getting started

### Requirements

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

### Run the production build

```bash
npm run build
```

### Run the linter

```bash
npm run lint
```

### Preview the production build

```bash
npm run preview
```

## Data model

Locations contain an ID, display name, type, and normalized canvas coordinates:

```ts
type Location = {
  id: string
  name: string
  type: 'office' | 'data-center' | 'warehouse' | 'campus'
  x: number
  y: number
}
```

Connections contain two location IDs and a positive cost:

```ts
type Connection = {
  id: string
  from: string
  to: string
  cost: number
}
```

The current version keeps changes in React state for the active browser session. Persistent save/load support can be added later with local storage or a backend.

## Future improvements

Potential next steps include:

- Drag-and-drop node positioning
- Step-by-step Prim's Algorithm animation
- Save and load network designs
- Export network diagrams
- Keyboard-accessible graph editing
- Additional MST algorithms such as Kruskal's Algorithm
- Cost units and distance-based edge presets
- Automated unit tests for graph editing and algorithm edge cases

## License

This project is intended as an educational demonstration of graph algorithms and network optimization.
