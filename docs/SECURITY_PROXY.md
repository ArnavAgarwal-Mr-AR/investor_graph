# 🛡️ Vercel Security Proxy Template

Since your repository is public, you should move the Neo4j write operations off the client-side to prevent your database credentials from being visible in the browser's Network tab.

Follow these steps to deploy a **Vercel Serverless Function** that acts as a secure middleman.

## 1. Project Structure
Create a new directory (e.g., `api/`) in your project and add the secure proxy files:

- `create-investor.js`: Handles database writes.
- `get-image.js`: Serves images from private B2 buckets.
- `get-upload-url.js`: Provides secure tunnels for manual image uploads.


## 2. Configuration on Vercel
1.  Push your code to GitHub and connect it to Vercel.
2.  In **Vercel Project Settings > Environment Variables**, add:
    - `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`
    - `B2_KEY_ID` (Backblaze Key ID)
    - `B2_APP_KEY` (Backblaze Application Key)
    - `B2_ENDPOINT` (e.g., `https://s3.us-west-004.backblazeb2.com`)
    - `B2_BUCKET_NAME` (Your B2 Bucket name)
    - `STORAGE_BASE_URL` (Use `/api/get-image?key=` for private buckets)
3.  **PRIVATE BUCKET NOTE**: Since your bucket is private, your `STORAGE_BASE_URL` must point to your serverless proxy. This ensures your keys stay safe and images load securely.
4.  **IMPORTANT**: Remove these `VITE_` variables from your local `.env.production` before building, so they never reach the client bundle.

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
