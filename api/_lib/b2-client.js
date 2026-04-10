import { S3Client } from "@aws-sdk/client-s3";

let s3;

export const getB2Client = () => {
  if (!process.env.B2_ENDPOINT) {
    throw new Error("B2_ENDPOINT is missing in environment variables.");
  }
  if (!s3) {
    const rawEndpoint = process.env.B2_ENDPOINT;
    const endpoint = rawEndpoint.startsWith('http') ? rawEndpoint : `https://${rawEndpoint}`;
    
    s3 = new S3Client({
      endpoint: endpoint,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APP_KEY,
      },
      region: "us-west-004",
    });
  }
  return s3;
};

export default getB2Client;
