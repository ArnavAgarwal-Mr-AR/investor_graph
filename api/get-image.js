import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./_lib/b2-client.js";

export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: "Missing image key" });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);

    // Set correct content type from B2 metadata
    res.setHeader("Content-Type", response.ContentType || "image/jpeg");
    // Cache for 24 hours to improve Deal Floor performance
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");

    // Stream the body directly to the response
    const stream = response.Body;
    
    // In Node.js environment, we can pipe the readable stream
    // For @aws-sdk/client-s3 v3, the Body is a readable stream in Node
    stream.pipe(res);
  } catch (error) {
    console.error("Secure Proxy Failure:", error);
    res.status(404).json({ error: "Image not found or access denied" });
  }
}
