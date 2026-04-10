import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./_lib/b2-client.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sourceUrl } = req.body;
  if (!sourceUrl) return res.status(400).json({ error: 'sourceUrl is required' });

  try {
    // 1. Download the asset
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error("Failed to fetch source image");
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
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
    };

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
