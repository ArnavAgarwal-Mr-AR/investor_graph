// api/create-investor.js
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
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const investor = req.body;
    const storageBase = process.env.STORAGE_BASE_URL || "";
    
    let session;
    try {
        const drv = getDriver();
        session = drv.session();
    } catch (err) {
        return res.status(500).json({ error: "Server configuration error: Missing Database Credentials" });
    }

    // Ensure the image URL is properly resolved before saving to the DB
    const finalImageUrl = investor.image.startsWith('http')
        ? investor.image
        : `${storageBase}${investor.image}`;

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
                ...investor,
                image: finalImageUrl, // Use the resolved B2 or external URL
                weight: neo4j.int(investor.weight)
            }
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database write failure' });
    } finally {
        await session.close();
    }
}
