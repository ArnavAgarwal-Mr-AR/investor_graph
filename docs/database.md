# 🗄️ Database Schema & Rules

The environment relies on a live **Neo4j Aura Cloud** instance. 
Configurations are managed via ecosystem-specific `.env.local` variables.

## 1. Graph Entities (`Investor` node)
Each entity adheres to the following interface:
- `id` (string): Unique identifier.
- `name` (string): Key individual representing the capital mass.
- `firm` (string): The wider capital vehicle they represent.
- `weight` (integer): Crucial mathematical variable. Defines the visual CSS scaling and the Depth of the Box Shadow (Z-axis visual illusion).
- `type` (enum): `elite`, `flow`, or `passive`. Drives node color accents.
- `tags` (string[]): A list of industries. The **first tag** is parsed by the physics engine to determine which Industry Cluster the node is pulled towards.

## 2. Relationships
The graph uses directional and bi-directional edges to represent deal-flow and professional history:

### Types:
- **`SYNDICATE`**: Core investment mapping. Drives the primarily visible "tension bands" on the Deal Floor. Thicker bands indicate higher `strength` values.
- **`ALUMNI`**: Educational or prior-firm ties. Visualized as thinner, secondary links that contribute to cluster formation but have less physics "pull" than syndicates.
- **`CAREER`**: Ties representing shared prior employment at major firms (e.g., McKinsey, Google, or local VC firms).

### Properties:
- `source` & `target`: Entity identifiers (`id`).
- `strength` (float): Value between `0.1` and `1.0`. 
   - High strength (`0.8`+) translates to brighter SVG tension bands and heavily overrides `d3.forceLink` distances, pulling entities physically closer in the cluster.
- `type` (string): Lowercased relationship type used for CSS classes in `DealFloor.jsx`.
