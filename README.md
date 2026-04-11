# 🌐 Investor Graph: "The Deal Floor"

A tactile, physics-driven visualization interface for the Indian Venture Capital Ecosystem.

## 🚀 Overview
The **Deal Floor** abandons traditional, abstract graph network concepts in favor of a "living negotiation surface". Instead of plain nodes and thin lines, the system represents major venture capital firms and angels as **Capital Mass Tiles**—heavy, responsive UI cards that natively sink into a virtual 2D physics field.

They interact organically via **Tension Bands**, which visually indicate the strength of real-world deal syndicates.

## ⚡ Features
- **Headless D3 Physics Engine:** D3 orchestrates the mathematical positioning, while React strictly handles the high-fidelity UI rendering.
- **Framer Motion Integration:** Allows ultra-smooth interactions, dragging, and complex viewport coordinate mapping.
- **Dynamic Minimap HUD:** Geometrically scales and tracks the active D3 zoom viewport for infinite canvas orientation.
- **Smart "Summon" Searching:** A `⌘ K` global command bar that plucks nodes from the void and physically drops them into your immediate view.
- **Tactical Filtering:** A control strip feature that gracefully transitions nodes into un-clickable "ghosts", focusing only on the selected industry sector.

## 📁 Documentation
For detailed architecture, design, and implementation notes, see the `/docs` directory:
- [Technical Details](./docs/technical-details.md)
- [Database Schema](./docs/database.md)
- [Graph Context & Vision](./docs/graph-context.md)
- [Design Aesthetics](./docs/design.md)
- [Component Architecture](./docs/components.md)
- [Security Proxy Guide](./docs/SECURITY_PROXY.md)

## 🗃️ Data Operations
To manage the live cloud graph data, use the built-in maintenance scripts:
- **Export Database to JSON:** `node scripts/export-investors.js`
- **Sync JSON to Database:** `node scripts/import-investors.js`
- See [Database Operations Docs](./docs/database.md#3-maintenance--data-operations) for full details.

## 💻 Quick Start
```bash
npm install
npm run dev
```
