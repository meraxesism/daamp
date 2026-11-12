import { useMemo, useState } from 'react'
import './App.css'
import { calculatePrimMst } from './algorithms/prim'
import { sampleConnections, sampleLocations } from './data/sampleGraph'
import type { Connection, Location } from './types/graph'

const typeLabels: Record<Location['type'], string> = {
  campus: 'Campus',
  office: 'Office',
  'data-center': 'Data center',
  warehouse: 'Warehouse',
}

const typeColors: Record<Location['type'], string> = {
  campus: '#7667f4',
  office: '#25a7a0',
  'data-center': '#f28c52',
  warehouse: '#e5b848',
}

function formatCost(value: number) {
  return `$${value.toLocaleString('en-US')}`
}

function Icon({ name }: { name: 'network' | 'plus' | 'trash' | 'refresh' | 'route' | 'building' }) {
  const paths = {
    network: <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="5" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.5-4.5M8.2 13.2l7.5 4.5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
    refresh: <><path d="M20 11a8.1 8.1 0 0 0-14.4-4L4 9" /><path d="M4 4v5h5M4 13a8.1 8.1 0 0 0 14.4 4L20 15" /><path d="M20 20v-5h-5" /></>,
    route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h3a3 3 0 0 0 3-3v-3a3 3 0 0 1 3-3h1" /></>,
    building: <><path d="M4 21h16M6 21V5l6-3 6 3v16M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1" /></>,
  }
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
  const [locations, setLocations] = useState<Location[]>(sampleLocations)
  const [connections, setConnections] = useState<Connection[]>(sampleConnections)
  const [selectedId, setSelectedId] = useState('hq')
  const [nodeName, setNodeName] = useState('')
  const [nodeType, setNodeType] = useState<Location['type']>('office')
  const [from, setFrom] = useState('hq')
  const [to, setTo] = useState('north')
  const [cost, setCost] = useState('350')
  const [activeTab, setActiveTab] = useState<'network' | 'optimized'>('network')
  const [notice, setNotice] = useState('Ready to optimize your network.')

  const mst = useMemo(() => calculatePrimMst(locations, connections), [locations, connections])
  const totalCost = connections.reduce((sum, connection) => sum + connection.cost, 0)
  const savings = totalCost - mst.totalCost
  const mstIds = new Set(mst.edges.map((edge) => edge.id))
  const locationById = new Map(locations.map((location) => [location.id, location]))

  function addLocation() {
    const trimmedName = nodeName.trim()
    if (!trimmedName) {
      setNotice('Give the new location a name first.')
      return
    }
    const id = `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    const index = locations.length
    const next: Location = {
      id,
      name: trimmedName,
      type: nodeType,
      x: 20 + ((index * 29) % 66),
      y: 18 + ((index * 41) % 66),
    }
    setLocations((current) => [...current, next])
    setSelectedId(id)
    setFrom(id)
    setNodeName('')
    setNotice(`${trimmedName} added to your network.`)
  }

  function addConnection() {
    const parsedCost = Number(cost)
    const duplicate = connections.some(
      (connection) =>
        (connection.from === from && connection.to === to) ||
        (connection.from === to && connection.to === from),
    )
    if (from === to || !Number.isFinite(parsedCost) || parsedCost <= 0 || duplicate) {
      setNotice(duplicate ? 'That connection already exists.' : 'Choose two different locations and a positive cost.')
      return
    }
    const connection: Connection = {
      id: `${from}-${to}-${Date.now()}`,
      from,
      to,
      cost: parsedCost,
    }
    setConnections((current) => [...current, connection])
    setNotice('Connection added. Run the optimizer to compare costs.')
  }

  function removeSelected() {
    if (!selectedId) return
    const selected = locationById.get(selectedId)
    setLocations((current) => current.filter((location) => location.id !== selectedId))
    setConnections((current) => current.filter((connection) => connection.from !== selectedId && connection.to !== selectedId))
    setSelectedId('')
    setNotice(`${selected?.name ?? 'Location'} removed.`)
  }

  function resetSample() {
    setLocations(sampleLocations)
    setConnections(sampleConnections)
    setSelectedId('hq')
    setFrom('hq')
    setTo('north')
    setActiveTab('network')
    setNotice('Sample network restored.')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Icon name="network" /></div><div><strong>NETSTRUCT</strong><span>Network infrastructure designer</span></div></div>
        <div className="topbar-actions"><span className="status-dot" /> Live canvas <button className="icon-button" onClick={resetSample} aria-label="Reset sample network"><Icon name="refresh" /></button></div>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow">GREEDY ALGORITHM LAB <span>•</span> PRIM'S ALGORITHM</div>
          <h1>Design a smarter<br /><em>network.</em></h1>
          <p>Map your infrastructure, explore connection costs, and discover the most efficient way to keep every location connected.</p>
        </div>
        <div className="hero-note"><span className="note-line" /><div><strong>How it works</strong><p>Prim's algorithm grows a connected network by repeatedly selecting the lowest-cost edge that reaches a new location.</p></div></div>
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <div className="section-heading"><span className="number">01</span><div><h2>Build your network</h2><p>Add locations and define possible connections.</p></div></div>
          <div className="form-group">
            <label htmlFor="location-name">NEW LOCATION</label>
            <div className="input-row"><input id="location-name" value={nodeName} onChange={(event) => setNodeName(event.target.value)} placeholder="e.g. Midtown Office" /><select value={nodeType} onChange={(event) => setNodeType(event.target.value as Location['type'])}><option value="office">Office</option><option value="data-center">Data center</option><option value="warehouse">Warehouse</option><option value="campus">Campus</option></select></div>
            <button className="button secondary full" onClick={addLocation}><Icon name="plus" /> Add location</button>
          </div>
          <div className="form-group">
            <label>NEW CONNECTION</label>
            <div className="stacked-inputs"><div className="select-wrap"><span>FROM</span><select value={from} onChange={(event) => setFrom(event.target.value)}>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></div><div className="select-wrap"><span>TO</span><select value={to} onChange={(event) => setTo(event.target.value)}>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></div></div>
            <div className="cost-input"><span>$</span><input aria-label="Connection cost" type="number" min="1" value={cost} onChange={(event) => setCost(event.target.value)} /><span className="cost-label">installation cost</span></div>
            <button className="button secondary full" onClick={addConnection}><Icon name="route" /> Add connection</button>
          </div>
          <div className="location-list">
            <div className="list-heading"><span>LOCATIONS <b>{locations.length}</b></span><button className="text-button" onClick={removeSelected} disabled={!selectedId}><Icon name="trash" /> Remove selected</button></div>
            {locations.map((location) => <button key={location.id} className={`location-item ${selectedId === location.id ? 'selected' : ''}`} onClick={() => setSelectedId(location.id)}><span className="location-dot" style={{ backgroundColor: typeColors[location.type] }} /><span><strong>{location.name}</strong><small>{typeLabels[location.type]}</small></span><span className="arrow">→</span></button>)}
          </div>
        </aside>

        <section className="canvas-panel">
          <div className="canvas-header"><div className="section-heading compact"><span className="number">02</span><div><h2>Explore the layout</h2><p>See every possible route, then isolate the optimized network.</p></div></div><div className="tabs"><button className={activeTab === 'network' ? 'active' : ''} onClick={() => setActiveTab('network')}>Full network <span>{connections.length}</span></button><button className={activeTab === 'optimized' ? 'active' : ''} onClick={() => setActiveTab('optimized')}>MST result <span>{mst.edges.length}</span></button></div></div>
          <div className="canvas">
            <div className="canvas-label"><span className="live-pulse" /> {activeTab === 'network' ? 'POSSIBLE CONNECTIONS' : 'OPTIMIZED CONNECTIONS'}</div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="network-svg">
              <defs><pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M 5 0 L 0 0 0 5" fill="none" stroke="#e9e9e5" strokeWidth=".15" /></pattern></defs>
              <rect width="100" height="100" fill="url(#grid)" />
              {connections.map((connection) => {
                const start = locationById.get(connection.from)
                const end = locationById.get(connection.to)
                if (!start || !end || (activeTab === 'optimized' && !mstIds.has(connection.id))) return null
                const isSelected = selectedId === connection.from || selectedId === connection.to
                return <g key={connection.id} className={`edge ${activeTab === 'optimized' ? 'optimized-edge' : ''} ${isSelected ? 'edge-selected' : ''}`}><line x1={start.x} y1={start.y} x2={end.x} y2={end.y} /><text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 1}>{formatCost(connection.cost)}</text></g>
              })}
              {locations.map((location) => <g key={location.id} className={`node ${selectedId === location.id ? 'node-selected' : ''}`} transform={`translate(${location.x} ${location.y})`} onClick={() => setSelectedId(location.id)}><circle r="3.3" fill={typeColors[location.type]} /><circle r="4.8" className="node-ring" /><text y="8" textAnchor="middle">{location.name}</text></g>)}
            </svg>
            <div className="map-legend"><span><i className="legend-line possible" /> All possible routes</span><span><i className="legend-line optimized" /> MST routes</span></div>
          </div>
          <div className="canvas-footer"><span><Icon name="building" /> {locations.length} locations</span><span><Icon name="route" /> {activeTab === 'optimized' ? mst.edges.length : connections.length} connections shown</span><span className="notice">{notice}</span></div>
        </section>
      </section>

      <section className="results">
        <div className="section-heading"><span className="number">03</span><div><h2>Optimize your network</h2><p>Let the greedy strategy find your lowest-cost backbone.</p></div></div>
        <div className="results-grid">
          <div className="metric-card"><span className="metric-label">CURRENT NETWORK COST</span><strong>{formatCost(totalCost)}</strong><small>{connections.length} possible connections</small></div>
          <div className="metric-card accent"><span className="metric-label">OPTIMIZED NETWORK COST</span><strong>{mst.isConnected ? formatCost(mst.totalCost) : '—'}</strong><small>{mst.isConnected ? `${mst.edges.length} connections in MST` : 'Network needs more routes'}</small></div>
          <div className="saving-card"><div><span className="metric-label">POTENTIAL SAVINGS</span><strong>{mst.isConnected ? formatCost(savings) : '—'}</strong></div><div className="saving-badge">{mst.isConnected && totalCost > 0 ? `${Math.round((savings / totalCost) * 100)}% less` : 'Connect all'}</div></div>
          <button className="optimize-button" onClick={() => { setActiveTab('optimized'); setNotice(mst.isConnected ? 'MST found — every location is connected at minimum cost.' : 'Add connections until every location can be reached.') }}><span>Run optimizer</span><Icon name="route" /></button>
        </div>
        {!mst.isConnected && locations.length > 0 && <div className="warning">This network is disconnected. Add a connection to connect the remaining locations before calculating savings.</div>}
      </section>
      <footer><span>NETSTRUCT <b>·</b> An interactive study of minimum spanning trees</span><span>Built for curious infrastructure thinkers</span></footer>
    </main>
  )
}

export default App
