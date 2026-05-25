const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Product = require('./models/product.model');
const Category = require('./models/category.model');

const productsData = [
  {
    name: 'Bohemian Oxidized Necklace',
    slug: 'bohemian-oxidized-necklace',
    category: 'Oxidized',
    images: ['products/oxidized_necklace.png'],
    price: 899,
    originalPrice: 1299,
    isBestSeller: true,
    description: 'Beautiful ethnic oxidized necklace with intricate detailing.'
  },
  {
    name: 'Classic Gold Plated Bangles',
    slug: 'classic-gold-plated-bangles',
    category: 'Gold Plated',
    images: ['products/gold_bangles.png'],
    price: 1499,
    originalPrice: 1999,
    isBestSeller: true,
    description: 'Set of two classic gold plated bangles for everyday wear.'
  },
  {
    name: 'Minimalist Silver Earrings',
    slug: 'minimalist-silver-earrings',
    category: 'Silver',
    images: ['products/silver_earrings.png'],
    price: 599,
    originalPrice: 899,
    isBestSeller: true,
    description: 'Simple and elegant silver stud earrings.'
  },
  {
    name: 'Titanium Men\'s Ring',
    slug: 'titanium-mens-ring',
    category: 'Men\'s',
    images: ['products/mens_ring.png'],
    price: 999,
    originalPrice: 1499,
    isBestSeller: true,
    description: 'Durable titanium ring for men.'
  }
];

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');
    
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('Existing Data Destroyed...');

    const mediaBaseUrl = process.env.AWS_CLOUDFRONT_URL
      ? process.env.AWS_CLOUDFRONT_URL.replace(/\/$/, '')
      : `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

    console.log(`Using Media Base URL: ${mediaBaseUrl}`);

    // Extract unique categories
    const categoryNames = [...new Set(productsData.map(p => p.category))];
    const categoryDocs = categoryNames.map(name => {
      const slug = name.toLowerCase().replace(/ & | /g, '-').replace(/'/g, '');
      return {
        name,
        slug,
        image: `${mediaBaseUrl}/categories/${slug}.png`
      };
    });

    const insertedCategories = await Category.insertMany(categoryDocs);
    console.log('Categories Imported!');

    // Map products
    const productDocs = productsData.map(p => {
      const cat = insertedCategories.find(c => c.name === p.category);
      return {
        name: p.name,
        slug: p.slug,
        sku: p.slug.toUpperCase().replace(/-/g, '').substring(0, 6) + Math.floor(Math.random() * 1000),
        description: p.description,
        category: cat._id,
        price: p.price,
        discountPrice: p.originalPrice > p.price ? p.price : 0,
        images: p.images.map(img => `${mediaBaseUrl}/${img}`),
        isFeatured: p.isBestSeller,
        stock: 100, // Dummy stock
        isActive: true,
      };
    });

    await Product.insertMany(productDocs);
    console.log('Products Imported!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
