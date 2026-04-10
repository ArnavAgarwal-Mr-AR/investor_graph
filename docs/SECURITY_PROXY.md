# 🛡️ Vercel Security Proxy Template

Since your repository is public, you should move the Neo4j write operations off the client-side to prevent your database credentials from being visible in the browser's Network tab.

Follow these steps to deploy a **Vercel Serverless Function** that acts as a secure middleman.

## 1. Project Structure
Create a new directory (e.g., `api/`) in your project and add a `create-investor.js` file:

```javascript
// api/create-investor.js
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const investor = req.body;
  const session = driver.session();

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
```

## 2. Configuration on Vercel
1.  Push your code to GitHub and connect it to Vercel.
2.  In **Vercel Project Settings > Environment Variables**, add:
    - `NEO4J_URI`
    - `NEO4J_USER`
    - `NEO4J_PASSWORD`
3.  **IMPORTANT**: Remove these `VITE_` variables from your local `.env.production` before building, so they never reach the client bundle.

## 3. Frontend Update
Update your `handleAddInvestor` in `App.jsx` to hit your new serverless endpoint:

```javascript
const handleAddInvestor = async (investor) => {
  setIsOnboarding(false);
  try {
    const response = await fetch('/api/create-investor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(investor),
    });
    
    if (response.ok) {
      await loadData(); // Refresh floor
    } else {
      alert("Proxy handshake failed.");
    }
  } catch (error) {
    alert("Connection to Security Proxy lost.");
  }
};
```

---

> [!TIP]
> This setup ensures that your database password stays on Vercel's secure servers and is never transmitted to the visitor's browser.
