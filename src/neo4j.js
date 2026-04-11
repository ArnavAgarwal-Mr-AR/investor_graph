/**
 * Client-Side API Helper interface
 * Proxies requests to Vercel Serverless Functions to keep credentials secure.
 */

export const fetchGraphData = async () => {
    try {
        const response = await fetch('/api/get-investors');
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Secure Proxy Failure: Could not sync with Neo4j Aura.", error);
        return null;
    }
};

// Deprecated: App.jsx now hits /api/create-investor directly via fetch.
// Leaving stub to prevent import errors.
export const createInvestor = async () => {
    console.warn("createInvestor is deprecated in neo4j.js, use direct fetch to /api/create-investor");
    return false;
};

