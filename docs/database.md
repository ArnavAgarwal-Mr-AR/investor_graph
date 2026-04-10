# 🗄️ Database Schema & Rules

The environment currently relies on a localized mock dataset found in `src/data/mockEnvironment.js`.

The dataset outlines **50 primary Indian Venture entities**.

## 1. Entities (`mockInvestors`)
Each entity adheres to the following interface:
- `id` (string): Unique identifier.
- `name` (string): Key individual representing the capital mass.
- `firm` (string): The wider capital vehicle they represent.
- `weight` (integer): Crucial mathematical variable. Defines the visual CSS scaling and the Depth of the Box Shadow (Z-axis visual illusion).
- `type` (enum): `elite`, `flow`, or `passive`. Drives node color accents.
- `tags` (string[]): A list of industries. The **first tag** is parsed by the physics engine to determine which Industry Cluster the node is pulled towards.

## 2. Links (`mockLinks`)
The links represent Syndicate deal-flow.
- `source` & `target`: Entity identifiers.
- `strength` (number): A dynamic float. 
   - A high strength (`0.8`) represents a deep historical syndicate. In UI, it translates to thicker, brighter SVG tension bands, and heavily overrides `d3.forceLink` distances, physically chaining entities tighter together than the standard bounds.
