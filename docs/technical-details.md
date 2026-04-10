# ⚙️ Technical Details

This project introduces a highly unique structural pattern to bridge D3.js and React.

## The React + Headless D3 Architecture

Traditionally, `d3` takes full control over the DOM. In this application, we use a **headless physics implementation**. 

1. **State Ownership**: React owns the actual array of node objects.
2. **Mathematical Processing**: `d3.forceSimulation` runs entirely in memory without ever touching the DOM.
3. **Tick Syncing**: We attach an `.on('tick')` event to the D3 simulation that fires a rapid `React.setState()` to force a re-render.
4. **Rendering**: React takes the updated `x` and `y` coordinates from the raw memory nodes and renders vanilla HTML/CSS elements (`<CapitalTile/>`).

### Manual Drag Hijacking
To allow users to manually drag nodes but have them instantly interact with the physics engine:
We use `framer-motion`'s `<motion.div drag />`. 
When the user drags, we intercept the mathematical delta using `onDrag(node, info)`. 
We instantly add `info.delta.x` to the node's strict `node.fx` (fixed X coordinate). D3 sees the fixed coordinate move and ripples the tension across all related nodes naturally, keeping dragging completely physics-compliant.

## Force Engine Adjustments
The physics engine replaces standard Central Gravity with **Clustered Coordinate Gravity**.
- `forceManyBody()` is used to push nodes apart.
- `d3.forceX(d => cluster[...].x)` and `forceY` are mapped to dynamically calculated focal points depending on the entity's primary industry.
