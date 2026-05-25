const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

// Load models
const Product = require('./models/product.model');
const Category = require('./models/category.model');

const dataPath = path.join(__dirname, '../client/public/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('Existing Data Destroyed...');

    // Extract unique categories
    const categoryNames = [...new Set(data.products.map(p => p.category))];
    const categoryDocs = categoryNames.map(name => ({
      name,
      slug: name.toLowerCase().replace(/ & | /g, '-'),
      image: 'https://via.placeholder.com/400x400?text=' + name.replace(/ /g, '+')
    }));

    const insertedCategories = await Category.insertMany(categoryDocs);
    console.log('Categories Imported!');

    // Map products
    const productDocs = data.products.map(p => {
      const cat = insertedCategories.find(c => c.name === p.category);
      return {
        name: p.name,
        slug: p.id, // we were using ID as slug in the frontend
        sku: p.id.toUpperCase() + Math.floor(Math.random() * 1000),
        description: p.description || 'Premium jewelry piece by Elore Jewels.',
        category: cat._id,
        price: p.price,
        discountPrice: p.originalPrice > p.price ? p.price : 0, // In backend, discountPrice is used if exists
        images: [p.image, p.hoverImage].filter(Boolean),
        isFeatured: !!p.isBestSeller,
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
