# 🗄️ Database Schema & Rules

The environment relies on a live **Neo4j Aura Cloud** instance. 
Configurations are managed via ecosystem-specific `.env.local` variables.

## 1. Graph Entities (`Investor` node)
Each entity adheres to the following interface:
- `id` (string): Unique identifier.
- `name` (string): Key individual representing the capital mass.
- `firm` (string): The wider capital vehicle they represent.
- `weight` (integer): A crucial mathematical variable scaling from `1 to 15`. It represents the entity's relative gravity/AUM (e.g., 14-15 for top-tier global funds, 3-6 for angel investors). It defines the visual CSS scaling and the depth of the box shadow (Z-axis visual illusion) in the UI.
- `type` (enum): Categorizes the entity's investment behavior. Drives node color accents:
    - `elite`: Top-tier institutional funds and high-AUM VCs (e.g., Peak XV, Tiger Global).
    - `flow`: Mid-market funds and highly active institutional investors (e.g., Blume, Kalaari).
    - `passive`: Angel investors, smaller syndicates, and strategic individuals (e.g., Kunal Shah, Naval Ravikant).
- `tags` (string[]): A list of industries. The **first tag** is parsed by the physics engine to determine which Industry Cluster the node is pulled towards.
- `firmLogo` (string): URL to the firm's branding asset (automated via Clearbit). Used to populate the header icon in the sidebar UI when an entity is selected.

## 2. Relationships
The graph uses directional and bi-directional edges to represent deal-flow and professional history:

### Types:
- **`SYNDICATE`**: Core investment mapping. Drives the primarily visible "tension bands" on the Deal Floor. Thicker bands indicate higher `strength` values.
- **`ALUMNI`**: Educational or prior-firm ties. Visualized as thinner, secondary links that contribute to cluster formation but have less physics "pull" than syndicates.
- **`CAREER`**: Ties representing shared prior employment at major firms (e.g., McKinsey, Google, or local VC firms).

### Properties:
- `strength` (float): Value between `0.1` and `1.0`. 
    - High strength (`0.8`+) translates to brighter SVG tension bands and heavily overrides `d3.forceLink` distances, pulling entities physically closer in the cluster.
- `type` (string): Lowercased relationship type used for CSS classes in `DealFloor.jsx`.

## 3. Maintenance & Data Operations
For mass updates and database synchronization, use the following server-side utilities in the `/scripts` directory.

### 📤 Data Export (`scripts/export-investors.js`)
**Usage**: `node scripts/export-investors.js`
- Pulls live nodes from Neo4j Cloud.
- Sanitizes Neo4j `Integer` types into standard JSON numbers.
- Saves result to `./investors_export.json`.

### 📥 Data Sync/Import (`scripts/import-investors.js`)
**Usage**: `node scripts/import-investors.js`
- Performs a batch `MERGE` operation.
- Updates existing nodes (by `id`) or creates new ones if missing.
- **Workflow**: Ideal for bulk-editing investor weights, tags, or assigning B2 image keys manually.
