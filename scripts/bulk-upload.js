/**
 * 🚀 THE DEAL FLOOR: BULK IMAGE UPLOADER
 * Uploads a local directory of images to Backblaze B2 in parallel,
 * handling concurrency and automatically generating an asset map.
 * 
 * Usage:
 * 1. Place all your images in: /scripts/assets/
 * 2. Run: node scripts/bulk-upload.js
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' }); // Or wherever your secure vars are

// 1. Configure the B2 Client
const rawEndpoint = process.env.B2_ENDPOINT;
const endpoint = rawEndpoint.startsWith('http') ? rawEndpoint : `https://${rawEndpoint}`;

const s3 = new S3Client({
  endpoint: endpoint,
  forcePathStyle: true, // Often required for B2/S3 compatibility
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
  },
  region: "ca-east-006", 
});

const BUCKET_NAME = process.env.B2_BUCKET_NAME;
const ASSETS_DIR = path.join(process.cwd(), 'scripts', 'assets');
const CONCURRENCY_LIMIT = 5; // Upload 5 images at a time

// Helper function to process in chunks
async function processInChunks(items, limit, asyncCallback) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    console.log(`[Batch] Processing ${i + 1} to ${Math.min(i + limit, items.length)} of ${items.length}...`);
    const chunkResults = await Promise.all(chunk.map(asyncCallback));
    results.push(...chunkResults);
  }
  return results;
}

// Map file extensions to content types
const getContentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  };
  return types[ext] || 'application/octet-stream';
};

async function runBulkUpload() {
  console.log(`\n📦 Initializing Bulk Upload from: ${ASSETS_DIR}`);
  
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
    console.log(`⚠️ Created directory: ${ASSETS_DIR}`);
    console.log(`Please place your images here and run the script again.`);
    return;
  }

  const files = fs.readdirSync(ASSETS_DIR).filter(file => {
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(file);
  });

  if (files.length === 0) {
    console.log(`🟡 No valid images found in ${ASSETS_DIR}.`);
    return;
  }

  console.log(`🚀 Found ${files.length} images. Starting upload...`);

  const assetMap = {};

  const uploadFile = async (filename) => {
    const filePath = path.join(ASSETS_DIR, filename);
    const buffer = fs.readFileSync(filePath);
    const cleanName = filename.toLowerCase().replace(/\s+/g, '_');
    const objectKey = `bulk_${Date.now()}_${cleanName}`;
    
    try {
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: buffer,
        ContentType: getContentType(filename)
      }));
      
      const entityName = path.parse(filename).name; 
      assetMap[entityName] = objectKey;
      
      console.log(`   ✅ Uploaded: ${filename} -> ${objectKey}`);
      return { success: true, name: entityName, key: objectKey };
    } catch (error) {
      console.error(`   ❌ Failed: ${filename}`, error.message);
      return { success: false, name: filename, error };
    }
  };

  // Upload using our chunking helper
  await processInChunks(files, CONCURRENCY_LIMIT, uploadFile);

  console.log(`\n🎉 Upload Complete!`);
  
  // Save the mapping so you can easily copy-paste it into mass-enrich.js
  const mapPath = path.join(process.cwd(), 'scripts', 'bulk-upload-results.json');
  fs.writeFileSync(mapPath, JSON.stringify(assetMap, null, 2));
  
  console.log(`\n📋 I've saved your upload correlations to: ${mapPath}`);
  console.log(`You can now copy that JSON mapping directly into your mass-enrich.js script!`);
}

runBulkUpload();
