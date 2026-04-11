import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getB2Client from "./_lib/b2-client.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fileName, contentType } = req.body;
  
  if (!fileName || !contentType) {
    return res.status(400).json({ error: "fileName and contentType are required" });
  }

  try {
    const s3 = getB2Client();
    const objectKey = `dossier_${Date.now()}_${fileName.replace(/\s+/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: objectKey,
      ContentType: contentType,
    });

    // Generate a pre-signed URL valid for 5 minutes
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return res.status(200).json({ 
      uploadUrl, 
      objectKey 
    });
  } catch (error) {
    console.error("Presigned URL failure:", error);
    return res.status(500).json({ error: "Failed to generate upload tunnel" });
  }
}
