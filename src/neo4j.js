import neo4j from 'neo4j-driver';

const uri = import.meta.env.VITE_NEO4J_URI;
const user = import.meta.env.VITE_NEO4J_USER;
const password = import.meta.env.VITE_NEO4J_PASSWORD;
const storageBase = import.meta.env.VITE_STORAGE_BASE_URL || "";

let driver;

export const getDriver = () => {
  if (!driver && uri && user && password) {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
      logging: {
        level: 'error',
        logger: (level, message) => {
          if (level === 'error') console.error(`[Neo4j ${level.toUpperCase()}] ${message}`);
        }
      }
    });
  }
  return driver;
};

export const fetchGraphData = async () => {
  const drv = getDriver();
  if (!drv) return null;

  const session = drv.session();
  try {
    const result = await session.run(`
      MATCH (n:Investor)
      OPTIONAL MATCH (n)-[r]->(m:Investor)
      RETURN n, r, m
    `);

    const nodesMap = new Map();
    const links = [];

    result.records.forEach(record => {
      const nodeN = record.get('n');
      const relR = record.get('r');
      const nodeM = record.get('m');

      if (nodeN) {
        const id = nodeN.properties.id;
        if (!nodesMap.has(id)) {
          nodesMap.set(id, {
            ...nodeN.properties,
            weight: nodeN.properties.weight?.toNumber() || 0,
            // D3 might need these to be objects, but initially they are properties
          });
        }
      }

      if (relR && nodeN && nodeM) {
        links.push({
          source: nodeN.properties.id,
          target: nodeM.properties.id,
          strength: relR.properties.strength,
          type: relR.type.toLowerCase()
        });
      }
    });

    return {
      nodes: Array.from(nodesMap.values()),
      links: links
    };
  } finally {
    await session.close();
  }
};

export const createInvestor = async (investor) => {
  const drv = getDriver();
  if (!drv) return null;

  const session = drv.session();
  try {
    await session.run(
      `MERGE (i:Investor {id: $id})
       SET i.name = $name,
           i.firm = $firm,
           i.image = $image,
           i.deployed = $deployed,
           i.tags = $tags,
           i.weight = $weight,
           i.type = $type,
           i.education = $education,
           i.pastExperience = $pastExperience`,
      {
        id: investor.id,
        name: investor.name,
        firm: investor.firm,
        // If the image doesn't start with http, assume it's a relative path to our storage bucket
        image: investor.image.startsWith('http') ? investor.image : `${storageBase}${investor.image}`,
        deployed: investor.deployed,
        tags: investor.tags || [],
        weight: neo4j.int(investor.weight),
        type: investor.type,
        education: investor.education || "",
        pastExperience: investor.pastExperience || ""
      }
    );
    return true;
  } catch (error) {
    console.error("Error creating investor in Neo4j:", error);
    return false;
  } finally {
    await session.close();
  }
};
