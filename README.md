# 🌐 Quantum Capital: The Deal Floor

*An Enterprise-Grade Spatial Visualization Engine for Institutional Capital Networks.*

## 🚀 The Architecture
The hardest question in private equity and venture capital isn't "who has capital?" It's "who holds the power?" 

Capital allocation is not linear. Deal flow, syndicates, and market influence happen through dense, hidden webs of relationships. When modeled using traditional CRMs or relational databases, the structural integrity of the network is lost in flat lists. 

The **Deal Floor** abandons standard relational data modeling in favor of a responsive, high-performance spatial map. It computes hundreds of interwoven financial vectors rendering live in the browser, allowing you to instantly visualize the hidden power structures of the market.

## ⚙️ Core Engineering Systems

### 🧠 The Graph Brain (Neo4j)
We stripped out traditional SQL backbones for a native Neo4j graph database. Every co-investment, syndicate event, and career correlation operates as a high-fidelity, mathematically traversable edge. We aren't querying tables—we are calculating networks.

### ⚛️ The Physics Engine (D3.js + React)
Rather than hard-coding UI positions, a headless **D3.js force simulation** processes continuous physics calculations inside React. It utilizes localized collision detection and custom gravity functions to autonomously pull investors into macro-clusters based on real-time market signals.

### 🎯 Dynamic Subgraph Isolation
When you select a high-gravity entity, the application instantly tracks their entire syndicate tree. In milliseconds, it zeroes out the visual and computational "noise" of the rest of the market—fading background elements into grayscale—to reveal an undisputed sphere of influence.

### 🔒 Zero-Trust Edge Security
Financial intelligence is highly sensitive. The entire connection layer is abstracted behind **Vercel Serverless** edge functions. Coupled with a custom **Backblaze B2** media buffering pipeline, the frontend architecture is blazingly fast and strictly decoupled from internal data stores.

---

## 📁 Technical Documentation
For detailed system architecture, scaling, and implementation notes, see the `/docs` directory:
- [Technical Details](./docs/technical-details.md)
- [Database Schema & Data Flow](./docs/database.md)
- [Graph Context & Intelligence](./docs/graph-context.md)
- [Design Token System](./docs/design.md)
- [Component Architecture](./docs/components.md)
- [Security Proxy Guide](./docs/SECURITY_PROXY.md)

## 🗃️ Backend Operations
To manage the live cloud graph data, use the built-in maintenance scripts:
- **Export Database to JSON:** `node scripts/export-investors.js`
- **Sync JSON to Database (MERGE):** `node scripts/import-investors.js`
- **Bulk Push Images to Secure Cloud:** `node scripts/bulk-upload.js`
- See [Database Operations Docs](./docs/database.md) for full details.

## 💻 Quick Start
```bash
npm install
npm run dev
```
