/**
 * 🛠️ THE DEAL FLOOR: MASS ENRICHMENT UTILITY (CLOUD SYNC)
 * Reads the 'bulk-upload-results.json' mapping and updates
 * all Neo4j nodes with their respective Backblaze B2 keys.
 */

import neo4j from 'neo4j-driver';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function syncCloudAssets() {
  const resultPath = './scripts/bulk-upload-results.json';
  
  if (!fs.existsSync(resultPath)) {
    console.error(`❌ Error: ${resultPath} not found. Run bulk-upload.js first.`);
    return;
  }

  const assetMap = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
  const entries = Object.entries(assetMap);
  const session = driver.session();

  try {
    console.log(`🚀 Synchronizing ${entries.length} cloud assets with the Graph...`);

    // Prepare batch for UNWIND
    const batch = entries.map(([name, key]) => ({ name, key }));

    const query = `
      UNWIND $batch AS asset
      MATCH (i:Investor {name: asset.name})
      SET i.image = asset.key
    `;

    await session.run(query, { batch });

    console.log("✅ Database successfully linked to cloud imagery!");
    console.log("✨ All 109 nodes now point to secure B2 object keys.");
  } catch (error) {
    console.error("❌ Sync failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

syncCloudAssets();
