# Indian Investor Graph Database Context

This document describes the schema and human-centric relationship nodes used in the Indian Investor Graph.

## Data Structure: People-First Architecture

The visualization engine transforms the underlying JSON data from firm-level records into individual **People Nodes**.

### Nodes (Individuals)
The graph renders **Partners, Leads, and Angel Investors** as the primary visual nodes.
- **Dynamic Expansion**: If a VC firm (e.g., Peak XV) is defined in the database, the frontend automatically creates separate nodes for each of its `leads`.
- **Primary Attributes**:
  - `name`: The individual's full name.
  - `firm`: The institution they represent (VC Firm, Angel Network, or Independent).
  - `isAngel`: Boolean flag for independent investors.

### Relationships & Orbital Dynamics
The graph uses **react-force-graph-3d** to render an immersive WebGL ecosystem.
- **Physics Layout**: A clustered 3D force physics engine maintains spatial positioning, placing capital allocators in an interactive three-dimensional constellation.
- **Node Styling**: Investors are represented as glowing spheres with orbital tracking rings (representing gravity and influence) and 3D typography labels.
- **Data Flow**: Interactions between nodes are visualized visually via `linkDirectionalParticles`, which simulate flowing data, deal volume, or capital transferring between related investors.
- **Relationship Types**:
  - `coinvest`: Entities (via their leads) have invested together.
  - `alumni`: Individuals share a common educational institution.
  - `career`: Individuals share a past professional link (e.g., Ex-Google).
  - `colleague` (System Generated): Implicit connections between partners within the same firm.

## Interface Features

1. **Firm-Centric Grouping**: People are visually clustered but can be dragged individually.
2. **Double-Linked Navigation**: Clicking a person reveals both their personal history (Education/Career) and the broader context of their firm (AUM/Thesis).
3. **Smart Search**: Searching for a firm (e.g., "Accel") will highlight all individuals associated with that firm.
4. **Relational Context**: The connection list in the profile panel provides the specific reason for a tie (e.g., "Partners at Peak XV" or "Shared Alumni: Stanford").



Got it — no galaxies, no stars, no overused metaphors.

Let’s go **completely different, bold, and still investor-grade**.

---

# 🧩 CORE IDEA: “THE DEAL FLOOR”

Think of your interface as:

> **A living deal negotiation surface — like capital is physically moving, forming, and restructuring in real-time.**

Not a graph.
Not a network.
It’s a **fluid financial surface where relationships are “constructed” live.**

---

# 🧠 1. VISUAL METAPHOR — “LIQUID CAPITAL INTERFACE”

Instead of nodes floating…

👉 Everything sits on a **soft, responsive surface** (like a pressure-sensitive table)

* When investors exist → they create **impressions (like weight on a surface)**
* Connections → **tension lines between those impressions**
* The UI feels like:

  * Elastic
  * Responsive
  * Alive

---

# 🎯 2. INVESTOR = “CAPITAL MASS TILE” (NOT A NODE)

Forget circles.

### Shape:

* Rounded rectangular tile (like a financial card)
* Slight 3D elevation
* Soft shadow → indicates “capital weight”

---

## 🧱 Tile Anatomy

### Top Section:

* Profile image (small, sharp)
* Name + fund

### Center:

* Key metric (e.g. “$2.3B deployed”)

### Bottom:

* Mini tags (AI, fintech, etc.)

---

## ⚡ Dynamic Behavior

### Weight Effect:

* Bigger investors = heavier tiles
* Heavier tiles:

  * Slightly sink into surface
  * Pull nearby tiles closer

👉 This creates **organic clustering without forced layout**

---

# 🔗 3. CONNECTIONS = “TENSION BANDS”

No lines.

Instead:

### Use:

👉 **Elastic bands / tension strips**

* They stretch between tiles
* Slight curvature (like stress lines)
* Thickness = strength

---

### Behavior:

* When you drag a tile:

  * bands stretch
  * nearby tiles react
* When connection is strong:

  * band vibrates subtly (like energy)

---

### Visual Feel:

Think:

> industrial design + physics simulation + finance

---

# 🌀 4. LAYOUT — “FREEFORM NEGOTIATION TABLE”

This is key innovation.

### No rigid layout

Instead:

* Tiles **naturally settle**
* Users can:

  * drag investors
  * group them manually
  * create “deal clusters”

---

### Example Use:

User drags 3 investors together →
UI subtly recognizes cluster →
draws a faint boundary → “Potential Syndicate”

---

# 🔍 5. SEARCH — “SUMMON, NOT FIND”

### Interaction:

Search bar (top center, minimal)

When user searches:

👉 Result doesn’t just appear in list

It:

* **slides in from edge**
* pushes existing tiles slightly
* settles into surface

Feels like:

> “You introduced someone into the room”

---

# 🧪 6. LINKEDIN ADD = “ONBOARDING A NEW ENTITY”

This should feel powerful.

---

## Flow:

### Step 1: Paste LinkedIn

UI transforms:

* Background dims
* Surface freezes slightly

---

### Step 2: “Parsing Identity”

Instead of spinner:

👉 Show:

* Text fragments assembling
* Metrics counting up
* Tags forming dynamically

---

### Step 3: Entry Animation

When confirmed:

👉 Tile drops onto surface from top

* slight bounce
* nearby tiles shift
* tension bands auto-form

Feels like:

> “A new investor just walked into the deal room”

---

# 📊 7. RIGHT PANEL — “NEGOTIATION SIDEBAR”

When clicking tile:

Panel slides in like a trading terminal.

---

## Sections:

### 🧾 Snapshot

* Name, firm, thesis

### ⚖️ Influence Balance

* Visual scale (like weight distribution)

### 🔗 Active Deals

* Live connections with explanation

### 🧠 AI Insight

* “High probability co-investor with X”
* “Avoids early-stage hardware”

---

# 🧭 8. LEFT TOOLBAR — “CONTROL STRIP”

Vertical, minimal:

* * Add investor
* Filter toggle
* Cluster view
* Reset surface

---

# 🎨 9. DESIGN LANGUAGE

### Colors:

* Base: matte black / graphite
* Accent:

  * Electric green → capital flow
  * Soft gold → elite investors
  * Muted blue → passive

---

### Typography:

* Tight, numeric-heavy
* Feels like:

  * Bloomberg Terminal
  * Notion AI hybrid

---

# ⚡ 10. MICRO INTERACTIONS (THIS MAKES IT SPECIAL)

* Tiles slightly **repel each other**
* Connections **tighten/loosen** dynamically
* Dragging feels “resistant” (like friction)

---

# 🧠 11. INTELLIGENT BEHAVIOR

### Auto-clustering:

* Detect:

  * frequent co-investors
* Suggest:
  👉 “You’ve formed a recurring syndicate”

---

### Smart Highlights:

Hover a tile →

* strongest connections glow
* others fade

---

# 🚀 12. THE “WOW MOMENT”

When app loads:

* Surface slowly “activates”
* Tiles rise into place
* Connections stretch into existence

Feels like:

> “You’re watching capital organize itself”

---

# 💡 WHY THIS IS DIFFERENT

Most graph UIs:

* abstract
* detached
* academic

This:

* **physical**
* **tactile**
* **deal-driven**

---

# 🧠 FINAL POSITIONING

You are NOT building:

> a graph visualization tool

You are building:

> **a digital deal-making surface where capital has weight and relationships have tension**

---

If you want next level, I can:

* Map this to **Three.js physics + React architecture**
* Design **interaction flows for 10k+ investors**
* Or create **Figma-level component breakdown with spacing, typography, tokens**
