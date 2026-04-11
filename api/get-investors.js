import neo4j from 'neo4j-driver';

let driver;

const getDriver = () => {
    if (!process.env.NEO4J_URI) {
        throw new Error("NEO4J_URI is missing in environment variables.");
    }
    if (!driver) {
        driver = neo4j.driver(
            process.env.NEO4J_URI,
            neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
        );
    }
    return driver;
};

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    let session;
    try {
        const drv = getDriver();
        session = drv.session();
    } catch (err) {
        return res.status(500).json({ error: "Server configuration error: Missing Database Credentials" });
    }

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
                        weight: neo4j.isInt(nodeN.properties.weight) 
                            ? nodeN.properties.weight.toNumber() 
                            : (nodeN.properties.weight || 0)
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

        return res.status(200).json({
            nodes: Array.from(nodesMap.values()),
            links: links
        });
    } catch (error) {
        console.error("Failed to fetch graph data:", error);
        return res.status(500).json({ error: 'Database read failure' });
    } finally {
        await session.close();
    }
}
