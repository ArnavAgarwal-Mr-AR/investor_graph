/**
 * 📤 THE DEAL FLOOR: DATA EXPORTER
 * Fetches all investor nodes from Neo4j and saves them to 'investors_export.json'
 */

import neo4j from 'neo4j-driver';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Load from .env.local

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function exportData() {
  const session = driver.session();
  try {
    console.log("🔗 Connecting to Neo4j Cloud...");
    const result = await session.run('MATCH (i:Investor) RETURN i');
    
    // Extract properties and handle Neo4j Integers
    const investors = result.records.map(record => {
      const props = record.get('i').properties;
      return {
        ...props,
        weight: neo4j.isInt(props.weight) ? props.weight.toNumber() : props.weight
      };
    });

    const outputPath = './investors_export.json';
    fs.writeFileSync(outputPath, JSON.stringify(investors, null, 2));
    
    console.log(`✅ Success! Exported ${investors.length} entities to ${outputPath}`);
    console.log("💡 You can now edit this file and run 'import-investors.js' to sync changes.");

  } catch (error) {
    console.error("❌ Export failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

exportData();
