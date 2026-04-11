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

- `d3.forceX(d => cluster[...].x)` and `forceY` are mapped to dynamically calculated focal points depending on the entity's primary industry.

## 🌉 The Full-Stack Data Bridge
The application transitions from a "client-only" tool to a secured full-stack ecosystem using a **Security Proxy Pattern**.

### 1. Security Proxy (Vercel)
To prevent Neo4j Cloud credentials from being exposed in the browser, all write operations (e.g., creating a new investor) are routed through `/api/create-investor.js`. This serverless function validates the input and executes the `MERGE` query on behalf of the user using protected environment variables.

### 2. Secure Image Proxy (B2 Bridge)
The application handles media via a private Backblaze B2 bucket. 
- **Privacy**: The bucket is 100% private and inaccessible via standard URLs.
- **Service**: `/api/get-image.js` acts as an authenticated streamer. It fetches the private object and streams it to the frontend with optimized cache headers (`public, max-age=86400`), ensuring both security and performance for the Deal Floor.

### 3. Direct-to-Storage Handshake
During manual investor uploads, the frontend performs a two-step handshake:
1. Requests a **Pre-signed S3 URL** from `/api/get-upload-url.js`.
2. Uploads the file directly to B2 via this temporary URL, keeping potentially large file streams off the serverless function's memory.
