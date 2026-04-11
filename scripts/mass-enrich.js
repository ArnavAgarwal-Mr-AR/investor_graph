/**
 * 🛠️ THE DEAL FLOOR: MASS ENRICHMENT UTILITY
 * Use this script to update existing Neo4j nodes with 
 * Backblaze B2 image keys.
 */

import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function enrichProfiles() {
  const session = driver.session();
  
  // Example Mapping: { "Investor Name": "b2_object_key.jpg" }
  const assetMap = {
    "Namita Thapar": "dossier_thapar_final.jpg",
    "Vineeta Singh": "dossier_singh_v1.jpg",
    // Add more mappings here...
  };

  try {
    for (const [name, imageKey] of Object.entries(assetMap)) {
      console.log(`Updating ${name} -> ${imageKey}...`);
      
      await session.run(
        `MATCH (i:Investor {name: $name})
         SET i.image = $image`,
        { name, image: imageKey }
      );
    }
    console.log("✅ Enrichment sequence complete.");
  } catch (error) {
    console.error("❌ Enrichment failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

enrichProfiles();
