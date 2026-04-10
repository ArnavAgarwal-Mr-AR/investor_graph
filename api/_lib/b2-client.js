import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
  },
  region: "us-west-004",
});

export default s3;
