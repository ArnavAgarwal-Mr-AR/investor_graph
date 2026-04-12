import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

async function testSingleUpload() {
  const s3 = new S3Client({
    endpoint: `https://${process.env.B2_ENDPOINT}`,
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.B2_KEY_ID,
      secretAccessKey: process.env.B2_APP_KEY,
    },
    forcePathStyle: true
  });

  const file = "scripts/assets/Abhay Pandey.jpg";
  const buffer = fs.readFileSync(file);
  
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: "bulk_1776029584088_aman_gupta.jpg", // A known uploaded key
    }));
    console.log("✅ FETCH SUCCESS! Proxy can retrieve images from B2.");
    console.log("Content Type:", response.ContentType);
  } catch (err) {
    console.error("❌ FETCH FAILED!");
    console.error("Message:", err.message);
  }
}

testSingleUpload();
