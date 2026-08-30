import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const bucketName = process.env.R2_BUCKET_NAME || "los-pollitos-media";
const publicUrlBase =
  process.env.R2_PUBLIC_URL || "https://pub-sample.r2.dev";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export interface PresignedUrlResult {
  uploadUrl: string;
  r2Key: string;
  publicUrl: string;
}

/**
 * Generates a presigned PUT URL for direct client-to-R2 file upload.
 * This bypasses Vercel's 4.5MB serverless payload limit completely.
 */
export async function getPresignedUploadUrl({
  fileName,
  fileType,
  workspaceId,
  expiresInSeconds = 3600,
}: {
  fileName: string;
  fileType: string;
  workspaceId: string;
  expiresInSeconds?: number;
}): Promise<PresignedUrlResult> {
  // Sanitize filename and create unique timestamped key
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now();
  const r2Key = `workspaces/${workspaceId}/${timestamp}-${randomSuffix}-${sanitizedName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: r2Key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: expiresInSeconds,
  });

  const publicUrl = `${publicUrlBase.replace(/\/$/, "")}/${r2Key}`;

  return {
    uploadUrl,
    r2Key,
    publicUrl,
  };
}

/**
 * Deletes an object from the Cloudflare R2 bucket.
 */
export async function deleteR2Object(r2Key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
    });
    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting object from Cloudflare R2:", error);
    return false;
  }
}
