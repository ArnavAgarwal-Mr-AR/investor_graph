import { PutObjectCommand } from "@aws-sdk/client-s3";
import getB2Client from "./_lib/b2-client.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sourceUrl } = req.body;
  if (!sourceUrl) return res.status(400).json({ error: 'sourceUrl is required' });

  try {
    // 1. Download the asset
    const response = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) throw new Error(`Source fetch failed with status: ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) throw new Error("Source image returned an empty body");

    const contentType = response.headers.get("content-type") || "image/jpeg";

    // 2. Construct unique key
    const timestamp = Date.now();
    const objectKey = `investor_${timestamp}.jpg`;

    // 3. Upload to Backblaze B2
    const uploadParams = {
      Bucket: process.env.B2_BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.length // Explicitly define length to avoid IncompleteBody errors
    };

    const s3 = getB2Client();
    await s3.send(new PutObjectCommand(uploadParams));

    // 4. Return the key (frontend will use VITE_STORAGE_BASE_URL + this key)
    return res.status(200).json({ objectKey });
  } catch (error) {
    console.error("Mirroring failure:", error);
    // Graceful fallback: return a default placeholder key if the mirror fails
    return res.status(200).json({ 
      objectKey: "default_investor.jpg",
      warning: "Fallback triggered due to source protection" 
    });
  }
}
