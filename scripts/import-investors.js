/**
 * 📥 THE DEAL FLOOR: DATA IMPORTER
 * Reads 'investors_export.json' and syncs it with the Neo4j Cloud.
 * Uses MERGE to update existing investors or create new ones if they don't exist.
 */

import neo4j from 'neo4j-driver';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function importData() {
  const inputPath = './investors_export.json';
  
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: ${inputPath} not found. Run export-investors.js first.`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const session = driver.session();

  try {
    console.log(`🚀 Starting sync for ${data.length} entities...`);

    // Use UNWIND for high-performance batch updates
    const query = `
      UNWIND $batch AS investor
      MERGE (i:Investor {id: investor.id})
      SET i += {
        name: investor.name,
        firm: investor.firm,
        image: investor.image,
        deployed: investor.deployed,
        tags: investor.tags,
        weight: investor.weight,
        type: investor.type,
        education: investor.education,
        pastExperience: investor.pastExperience,
        firmLogo: investor.firmLogo
      }
    `;

    await session.run(query, { batch: data });
    
    console.log("✅ Database successfully synchronized with JSON data.");
    console.log("✨ Deal Floor refresh required to see changes.");

  } catch (error) {
    console.error("❌ Import failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

importData();
