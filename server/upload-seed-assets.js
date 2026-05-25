const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Load environment variables
dotenv.config();

// Validate AWS environment variables
const requiredEnv = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET'];
const missing = requiredEnv.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('Error: Missing required environment variables in server/.env:');
  console.error(missing.join(', '));
  process.exit(1);
}

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_S3_BUCKET;

// File mappings: [localPath, s3Key, contentType]
const uploadTargets = [
  // Product Images
  [
    path.join(__dirname, '../client/public/oxidized_necklace.png'),
    'products/oxidized_necklace.png',
    'image/png'
  ],
  [
    path.join(__dirname, '../client/public/gold_bangles.png'),
    'products/gold_bangles.png',
    'image/png'
  ],
  [
    path.join(__dirname, '../client/public/silver_earrings.png'),
    'products/silver_earrings.png',
    'image/png'
  ],
  [
    path.join(__dirname, '../client/public/mens_ring.png'),
    'products/mens_ring.png',
    'image/png'
  ],
  
  // Category Images (mapped from product images for demo seeding)
  [
    path.join(__dirname, '../client/public/oxidized_necklace.png'),
    'categories/oxidized.png',
    'image/png'
  ],
  [
    path.join(__dirname, '../client/public/gold_bangles.png'),
    'categories/gold-plated.png',
    'image/png'
  ],
  [
    path.join(__dirname, '../client/public/silver_earrings.png'),
    'categories/silver.png',
    'image/png'
  ],
  [
    path.join(__dirname, '../client/public/mens_ring.png'),
    'categories/mens.png',
    'image/png'
  ],

  // Banners
  [
    path.join(__dirname, '../client/public/hero_banner.png'),
    'banners/hero_banner.png',
    'image/png'
  ]
];

const uploadFile = async (localPath, s3Key, contentType) => {
  if (!fs.existsSync(localPath)) {
    console.warn(`Warning: Local file not found at ${localPath}, skipping.`);
    return;
  }

  console.log(`Uploading ${path.basename(localPath)} to s3://${bucketName}/${s3Key}...`);
  const fileContent = fs.readFileSync(localPath);

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
        // Since OAC is being used, public-read ACL is not required and might fail on buckets with blocked public access
      })
    );
    console.log(`Successfully uploaded: ${s3Key}`);
  } catch (error) {
    console.error(`Failed to upload ${s3Key}:`, error.message);
    throw error;
  }
};

const run = async () => {
  try {
    console.log('Starting seed assets upload to S3...');
    for (const [localPath, s3Key, contentType] of uploadTargets) {
      await uploadFile(localPath, s3Key, contentType);
    }
    console.log('All seed assets uploaded successfully!');
  } catch (error) {
    console.error('Asset upload process encountered errors.');
    process.exit(1);
  }
};

run();
