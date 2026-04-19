import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { files } = await req.json();
    
    // Connects to your NEW AWS account
    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      },
    });

    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

    const urls = await Promise.all(
      files.map(async (file) => {
        const key = `logoImgs/${Date.now()}-${file.fileName}`;
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          ContentType: file.fileType,
        });

        // Generates the secret link for the frontend to use
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return { fileName: file.fileName, url, key };
      })
    );

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("AWS Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}