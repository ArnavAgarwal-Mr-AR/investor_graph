# 🛡️ The Deal Floor: Secure API Ecosystem

This document details the serverless functions that power the secure, cloud-native architecture of **The Deal Floor**. All functions reside in the `/api` directory and are optimized for deployment as **Vercel Serverless Functions**.

## 🏗️ Core Architecture
The API acts as a secure "Security Proxy" between the public frontend and your sensitive cloud resources (Neo4j AuraDB & Backblaze B2).

---

## 1. Create Investor
**Endpoint**: `POST /api/create-investor`  
**Purpose**: Securely persists investor data to Neo4j.

### Payload Schema
```json
{
  "id": "string (unique)",
  "name": "string",
  "firm": "string",
  "image": "string (B2 object key)",
  "deployed": "string/number",
  "tags": ["string"],
  "weight": "number",
  "type": "string",
  "education": "string",
  "pastExperience": "string"
}
```

### Security Features
- **Lazy Load**: Validates `NEO4J_URI` at runtime to prevent cold-boot crashes.
- **Credential Protection**: Uses server-side environment variables; credentials never touch the browser.

---

## 2. Secure Image Proxy
**Endpoint**: `GET /api/get-image?key={objectKey}`  
**Purpose**: Serves images from your **Private** Backblaze B2 bucket.

### Workflow
1. Browser requests `/api/get-image?key=dossier_123.jpg`.
2. Vercel function authenticates with B2 using private master keys.
3. Function streams the bytes directly to the browser with correct `Content-Type`.

### Benefits
- **Full Privacy**: Your B2 bucket remains 100% private.
- **URL Masking**: Users never see your raw Backblaze endpoint or bucket name.
- **Edge Caching**: Implements `Cache-Control: public, max-age=86400` to speed up the Deal Floor.

---

## 3. Secure Manual Upload (Pre-signed URLs)
**Endpoint**: `POST /api/get-upload-url`  
**Purpose**: Grants a secure, temporary tunnel for direct browser-to-B2 uploads.

### Payload Schema
```json
{
  "fileName": "string",
  "contentType": "string"
}
```

### Response
```json
{
  "uploadUrl": "string (Temporary S3 URL)",
  "objectKey": "string (Unique storage path)"
}
```

### Workflow
1. Frontend requests a signed URL.
2. API generates a `PutObjectCommand` signed with B2 credentials (valid for 5 mins).
3. Frontend `PUT`s the local file directly to this `uploadUrl`.

---

## 4. Asset Mirroring (Legacy/Internal)
**Endpoint**: `POST /api/mirror-asset`  
**Purpose**: Automated download and vaulting of external images.

### Security Note
- Primarily used during the LinkedIn import flow.
- Includes `User-Agent` emulation to bypass common scraping protections.

---
