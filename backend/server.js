const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
// Remove in-memory MongoDB server
// const { MongoMemoryServer } = require('mongodb-memory-server');

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Config
dotenv.config();
console.log("MongoDB URI:", process.env.MONGO_URI);
const app = express();

// Simplify CORS to allow all origins
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Origin']
}));

// Simple CORS headers for every request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    serverPort: process.env.PORT || 5002
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Upload folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Connect to MongoDB
async function startServer() {
  try {
    // Connect directly to MongoDB Atlas with hardcoded URI
    const mongoUri = "mongodb+srv://tiwarisanidhya21:Sanidhya21@cluster0.bcvaj6r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');

    // Delete all existing products to start fresh
    const Product = require('./models/productModel');
    const User = require('./models/userModel');
    const bcrypt = require('bcryptjs');
    
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('All existing products deleted.');
    
    // First check if we need to recreate the admin user
    console.log('Checking admin user...');
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    
    // If admin exists, but we want to refresh the password for testing
    if (adminUser) {
      console.log('Admin user exists, resetting password for testing');
      
      // We'll use the actual password hashing function from the model
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      
      // Update the user's password directly (bypassing middleware)
      await User.updateOne(
        { _id: adminUser._id },
        { $set: { password: hashedPassword } }
      );
      
      // Fetch the updated user
      adminUser = await User.findById(adminUser._id);
      console.log('Admin password reset successfully');
    } else {
      // Create new admin if doesn't exist
      console.log('Admin user does not exist, creating new admin');
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456', // This will be hashed by the pre-save middleware
        isAdmin: true,
      });
      console.log('Admin user created with ID:', adminUser._id);
    }
    
    // Test the admin login credentials
    console.log('Testing admin credentials...');
    const isPasswordValid = await adminUser.matchPassword('123456');
    console.log(`Admin password valid: ${isPasswordValid}`);
    
    // Sample products for all categories
    const sampleProducts = [
      // Notebooks Category
      {
        name: 'Premium Leather Notebook',
        image: 'https://images.unsplash.com/photo-1666732545331-197ef67139fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fG5vdGVib29rc3xlbnwwfHwwfHx8MA%3D%3D',
        description: 'Handcrafted with genuine Italian leather, this luxurious notebook features 240 pages of acid-free, fountain pen-friendly paper. The elegant stitched binding allows pages to lay flat when open, while the attached bookmark ribbon and elastic closure keep your thoughts secure. Perfect for executives, writers, and journaling enthusiasts.',
        brand: 'Moleskine',
        category: 'notebooks',
        price: 24.99,
        countInStock: 15,
        rating: 4.8,
        numReviews: 12,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Dotted Grid Journal',
        image: 'https://images.unsplash.com/photo-1522199670076-2852f80289c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg0fHxub3RlYm9va3N8ZW58MHx8MHx8fDA%3D',
        description: 'Designed specifically for bullet journaling and planning, this premium notebook features precisely spaced 5mm dotted grid pages. The 120gsm paper prevents bleeding even with fountain pens, while the numbered pages and included index make organization effortless. Comes with 3 ribbon bookmarks in different colors for multi-project tracking.',
        brand: 'Leuchtturm1917',
        category: 'notebooks',
        price: 15.99,
        countInStock: 20,
        rating: 4.6,
        numReviews: 89,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Recycled Paper Notebook',
        image: 'https://images.unsplash.com/photo-1636014708703-36477b887ee4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIyfHxub3RlYm9va3N8ZW58MHx8MHx8fDA%3D',
        description: 'Environmentally conscious design featuring 100% post-consumer recycled paper with a natural, unbleached finish. The kraft paper cover is water-resistant and biodegradable, while still providing durability for daily use. Each purchase supports global reforestation efforts with a tree planted for every notebook sold.',
        brand: 'EcoNotes',
        category: 'notebooks',
        price: 12.99,
        countInStock: 30,
        rating: 4.3,
        numReviews: 56,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Pocket Notebook Set (3-Pack)',
        image: 'https://images.unsplash.com/photo-1584628804572-f84284d9f388?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk2fHxub3RlYm9va3N8ZW58MHx8MHx8fDA%3D',
        description: 'This convenient set includes three 3.5" x 5.5" pocket notebooks with different paper styles (lined, graph, and blank). Each notebook contains 48 pages of durable 70# paper that resists tearing and fraying. The staple-bound design allows them to lay completely flat, while the rounded corners prevent damage when carried in pockets or bags.',
        brand: 'Field Notes',
        category: 'notebooks',
        price: 9.99,
        countInStock: 40,
        rating: 4.5,
        numReviews: 42,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Executive Leather Portfolio',
        image: 'https://media.istockphoto.com/id/1288804667/photo/elegant-leather-black-folder-for-businessman-documents.jpg?s=1024x1024&w=is&k=20&c=BXBQlzRMcjhYa4O-Ycwoh_2vjGmS8lT82Ruz8Nagtfs=',
        description: 'Crafted from premium full-grain leather that develops a beautiful patina over time, this professional portfolio includes a replaceable letter-sized notepad, document pockets, business card holders, and a dedicated pen loop. The zippered closure protects important documents, while the interior tablet sleeve accommodates devices up to 10.5 inches.',
        brand: 'Executive Office',
        category: 'notebooks',
        price: 49.99,
        countInStock: 8,
        rating: 4.9,
        numReviews: 24,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Hardcover Notebook with Elastic Band',
        image: 'https://plus.unsplash.com/premium_photo-1667251760504-096946b820af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFuZGNvdmVyJTIwbm8wdGVib29rfGVufDB8fDB8fHww',
        description: 'This classic A5-sized notebook features a durable hardcover with linen texture finish and 192 cream-colored pages (96 sheets) of 80gsm paper. The lay-flat binding allows comfortable writing across the entire page, while the elastic closure band and built-in accordion pocket keep loose papers organized. Available in 8 vibrant colors.',
        brand: 'ClassicNotes',
        category: 'notebooks',
        price: 17.99,
        countInStock: 35,
        rating: 4.2,
        numReviews: 61,
        user: adminUser._id,
        featured: false,
      },
      
      // Pens Category
      {
        name: 'Fountain Pen Set',
        image: 'https://plus.unsplash.com/premium_photo-1679826780158-bef9a5b575b6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zm91bnRhaW4lMjBwZW58ZW58MHx8MHx8fDA%3D',
        description: 'Experience the luxury of traditional writing with this hand-crafted fountain pen set featuring a stainless steel medium nib that provides consistent ink flow. The set includes the pen, a converter for bottled ink, 3 ink cartridges in different colors, and a premium gift box with microfiber cleaning cloth. The balanced weight distribution ensures writing comfort even during extended use.',
        brand: 'Parker',
        category: 'pens',
        price: 39.99,
        countInStock: 10,
        rating: 4.9,
        numReviews: 76,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Gel Ink Pens (12 Colors)',
        image: 'https://images.unsplash.com/photo-1601311911926-dbdae16e54c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdlbCUyMHBlbnxlbnwwfHwwfHx8MA%3D%3D',
        description: 'This set of 12 premium gel pens features quick-drying, acid-free ink that won\'t smear, bleed, or skip. Each pen has a 0.7mm tip for smooth, precise writing and a comfortable rubber grip to reduce hand fatigue. The vibrant colors are perfect for color-coding notes, artistic journaling, or adding flair to everyday writing tasks.',
        brand: 'Pilot',
        category: 'pens',
        price: 11.99,
        countInStock: 25,
        rating: 4.6,
        numReviews: 128,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Premium Ballpoint Pen',
        image: 'https://images.unsplash.com/photo-1587145717011-b2c3349adf6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGJhbGxwaW50JTIwcGVufGVufDB8fDB8fHww',
        description: 'Crafted with aerospace-grade aluminum, this refillable ballpoint pen combines modern engineering with timeless design. The proprietary ink formula provides a smooth writing experience with no clumping or skipping, while the precision-weighted body offers perfect balance. The twist mechanism operates with satisfying smoothness and won\'t loosen over time.',
        brand: 'Cross',
        category: 'pens',
        price: 7.99,
        countInStock: 50,
        rating: 4.4,
        numReviews: 95,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Calligraphy Pen Set',
        image: 'https://images.unsplash.com/photo-1588073019544-d9d80701ef83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGJhbGxwaW50JTIwcGVufGVufDB8fDB8fHww',
        description: 'Develop your calligraphy skills with this comprehensive set featuring 4 pen holders and 12 interchangeable nibs of varying widths. Includes 5 ink bottles in classic colors, practice sheets with guidelines for different calligraphy styles, and a detailed instruction booklet. The wooden storage box keeps everything organized and makes this an impressive gift for creative individuals.',
        brand: 'Sheaffer',
        category: 'pens',
        price: 29.99,
        countInStock: 15,
        rating: 4.7,
        numReviews: 64,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Executive Metal Rollerball Pen',
        image: 'https://images.unsplash.com/photo-1676302467358-6be8ed3519a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fGJhbGxwaW50JTIwcGVufGVufDB8fDB8fHww',
        description: 'Make a statement with this sophisticated rollerball pen featuring a solid brass body with palladium plating that resists tarnishing and wear. The ceramic roller tip delivers consistent ink flow and precise lines, while the cap secures with a satisfying click. Presented in a suede-lined gift box with a lifetime mechanical warranty for the discerning professional.',
        brand: 'Montblanc',
        category: 'pens',
        price: 59.99,
        countInStock: 7,
        rating: 4.9,
        numReviews: 37,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Erasable Gel Pens (5-Pack)',
        image: 'https://images.unsplash.com/photo-1587303988571-c5563c0bceab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE4fHxiYWxscGludCUyMHBlbnxlbnwwfHwwfHx8MA%3D%3D',
        description: 'These innovative pens combine the smooth writing experience of gel ink with the ability to completely erase mistakes using the built-in eraser tip. The thermo-sensitive ink disappears with friction and leaves no residue or shadow. Perfect for students, professionals, and anyone who appreciates the ability to correct errors without crossing out text.',
        brand: 'FriXion',
        category: 'pens',
        price: 14.99,
        countInStock: 22,
        rating: 4.5,
        numReviews: 83,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Brush Pen Set for Lettering',
        image: 'https://images.unsplash.com/photo-1608805759193-a8d970f4abd1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fGJhbGxwaW50JTIwcGVufGVufDB8fDB8fHww',
        description: 'Create beautiful modern calligraphy and hand lettering with these professional-grade brush pens featuring flexible nylon tips that respond to pressure variations. The water-based, blendable ink is ideal for creating gradients and watercolor effects. This set includes 24 vibrant colors that won\'t bleed through most papers, making them perfect for bullet journals, cards, and art projects.',
        brand: 'Tombow',
        category: 'pens',
        price: 19.99,
        countInStock: 18,
        rating: 4.7,
        numReviews: 72,
        user: adminUser._id,
        featured: false,
      },
      
      // Desk Accessories Category
      {
        name: 'Ergonomic Desk Organizer',
        image: 'https://images.unsplash.com/photo-1705417272217-490f4511abeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVzayUyMG9yZ2FuaXNlcnxlbnwwfHwwfHx8MA%3D%3D',
        description: 'This multi-functional desk organizer was designed with workflow efficiency in mind. The tiered structure includes compartments for pens, scissors, sticky notes, paper clips, and a dedicated phone stand with cable management. The bamboo construction is not only sustainable but adds natural warmth to your workspace while resisting stains and moisture.',
        brand: 'SimpleDesk',
        category: 'desk-accessories',
        price: 19.99,
        countInStock: 20,
        rating: 4.5,
        numReviews: 89,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Wooden Pen Holder',
        image: 'https://images.unsplash.com/photo-1639916991657-e74ba7546b28?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVuJTIwaG9sZGVyfGVufDB8fDB8fHww',
        description: 'Handcrafted from reclaimed oak with a natural beeswax finish that highlights the unique grain patterns. This sturdy pen holder features three compartments of different sizes to accommodate various writing instruments and desktop tools. The weighted base prevents tipping, while felt padding on the bottom protects your desk surface from scratches.',
        brand: 'WoodCraft',
        category: 'desk-accessories',
        price: 16.99,
        countInStock: 15,
        rating: 4.3,
        numReviews: 45,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Desk Pad Protector',
        image: 'https://images.unsplash.com/photo-1598978554679-6e24fe91f7cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGVzayUyMHBhZCUyMHByb3RlY3RvcnxlbnwwfHwwfHx8MA%3D%3D',
        description: 'This dual-sided desk pad features premium PU leather on the top surface that provides a smooth writing experience and protects your desk from scratches, spills, and heat damage. The non-slip suede bottom keeps the pad securely in place during use. The waterproof surface is easy to clean and serves as an ideal mouse pad, with stitched edges that won\'t fray over time.',
        brand: 'DeskMate',
        category: 'desk-accessories',
        price: 14.99,
        countInStock: 30,
        rating: 4.4,
        numReviews: 38,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Metal Letter Tray',
        image: 'https://images.unsplash.com/photo-1625461291092-13d0c45608b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRlc2slMjBwYWQlMjBwcm90ZWN0b3J8ZW58MHx8MHx8fDA%3D',
        description: 'Keep your correspondence and documents organized with this sleek metal letter tray featuring a modern mesh design that prevents papers from sliding. The stackable design allows you to expand vertically as your storage needs grow, while the powder-coated finish resists scratches and rust. Rubber feet protect your desk surface from marks.',
        brand: 'OfficePro',
        category: 'desk-accessories',
        price: 22.99,
        countInStock: 18,
        rating: 4.2,
        numReviews: 29,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Minimalist Desk Calendar',
        image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3',
        description: 'Combine functionality with sophisticated design in this minimalist desk calendar featuring a solid brass stand with a timeless brushed finish. The thick, high-quality paper cards display one month per card with a clean, typography-focused design. The calendar can be displayed horizontally or vertically to suit your desk arrangement.',
        brand: 'MinimalistOffice',
        category: 'desk-accessories',
        price: 12.99,
        countInStock: 25,
        rating: 4.1,
        numReviews: 34,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Adjustable Laptop Stand',
        image: 'https://plus.unsplash.com/premium_photo-1683736986821-e4662912a70d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGFwdG9wJTIwc3RhbmR8ZW58MHx8MHx8fDA%3D',
        description: 'Improve your posture and reduce neck strain with this fully adjustable aluminum laptop stand. The height can be set between 2-7 inches, while the angle adjusts from 15-45 degrees for optimal viewing comfort. The open design promotes airflow to prevent overheating, and the rubber pads protect your device from scratches while ensuring stability during use.',
        brand: 'ErgoTech',
        category: 'desk-accessories',
        price: 32.99,
        countInStock: 15,
        rating: 4.6,
        numReviews: 52,
        user: adminUser._id,
        featured: true,
      },
      
      // Electronics Category
      {
        name: 'Wireless Charging Desk Lamp',
        image: 'https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGVzayUyMGxhbXB8ZW58MHx8MHx8fDA%3D',
        description: 'This multifunctional lamp combines modern lighting technology with convenient Qi wireless charging for compatible smartphones. Features include 5 color temperature modes, 7 brightness levels, a touch-sensitive control panel, and a 60-minute auto-off timer. The adjustable neck and head allow you to direct light precisely where needed for reduced eye strain.',
        brand: 'TechLight',
        category: 'electronics',
        price: 49.99,
        countInStock: 8,
        rating: 4.7,
        numReviews: 9,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Bluetooth Speaker',
        image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3',
        description: 'Compact Bluetooth speaker with impressive sound quality, perfect for your desk or on the go.',
        brand: 'SoundPro',
        category: 'electronics',
        price: 35.99,
        countInStock: 10,
        rating: 4.5,
        numReviews: 87,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Desk USB Hub',
        image: 'https://images.unsplash.com/photo-1616578273461-3a99ce422de6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNiJTIwaHVifGVufDB8fDB8fHww',
        description: 'Expand your connectivity with this sleek USB hub featuring multiple ports and fast data transfer.',
        brand: 'TechConnect',
        category: 'electronics',
        price: 24.99,
        countInStock: 30,
        rating: 4.6,
        numReviews: 53,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Digital Desk Clock',
        image: 'https://images.unsplash.com/photo-1652850494317-b80cc04a25f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzayUyMGNsb2NrfGVufDB8fDB8fHww',
        description: 'Modern digital clock with temperature display, alarm functions, and minimalist design.',
        brand: 'TimeKeeper',
        category: 'electronics',
        price: 19.99,
        countInStock: 25,
        rating: 4.3,
        numReviews: 41,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Wireless Ergonomic Mouse',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91c2V8ZW58MHx8MHx8fDA%3D',
        description: 'Ergonomically designed wireless mouse that reduces wrist strain during long work sessions.',
        brand: 'ErgoTech',
        category: 'electronics',
        price: 29.99,
        countInStock: 22,
        rating: 4.7,
        numReviews: 68,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Compact Document Scanner',
        image: 'https://images.unsplash.com/photo-1620423855978-e5d74a7bef30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcGFjdCUyMGRvYyUyMHNjYW5uZXxlbnwwfHwwfHx8MA%3D%3D',
        description: 'Portable document scanner for quick digitization of paperwork and receipts with cloud storage.',
        brand: 'DocuTech',
        category: 'electronics',
        price: 89.99,
        countInStock: 7,
        rating: 4.8,
        numReviews: 43,
        user: adminUser._id,
        featured: true,
      },
      
      // Filing & Storage Category
      {
        name: 'Expanding File Organizer',
        image: 'https://images.unsplash.com/photo-1588982638245-867534499945?ixlib=rb-4.0.3',
        description: 'Accordion-style expanding file folder with 12 pockets for organizing documents by month or category.',
        brand: 'OfficePro',
        category: 'filing',
        price: 15.99,
        countInStock: 40,
        rating: 4.3,
        numReviews: 57,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Decorative Storage Boxes (3-Pack)',
        image: 'https://images.unsplash.com/photo-1585670140617-39b85a349ddb?ixlib=rb-4.0.3',
        description: 'Set of 3 decorative storage boxes in graduated sizes, perfect for organizing office supplies or keepsakes.',
        brand: 'HomeStyle',
        category: 'filing',
        price: 23.99,
        countInStock: 18,
        rating: 4.5,
        numReviews: 32,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Premium Leather Magazine Holder',
        image: 'https://images.unsplash.com/photo-1619621618200-e73df6f290c8?ixlib=rb-4.0.3',
        description: 'Sophisticated leather magazine holder for organizing publications, catalogs, or documents with style.',
        brand: 'ExecutiveDecor',
        category: 'filing',
        price: 42.99,
        countInStock: 9,
        rating: 4.7,
        numReviews: 27,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Desktop File Organizer',
        image: 'https://images.unsplash.com/photo-1616091670146-a5e49d850bc9?ixlib=rb-4.0.3',
        description: 'Vertical desktop file organizer with multiple compartments for document sorting and organization.',
        brand: 'OfficePro',
        category: 'filing',
        price: 18.99,
        countInStock: 25,
        rating: 4.2,
        numReviews: 46,
        user: adminUser._id,
        featured: false,
      },

      // Art Supplies Category
      {
        name: 'Professional Colored Pencil Set',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3',
        description: '36-piece professional artist colored pencil set with vibrant pigments and smooth laydown.',
        brand: 'ArtistChoice',
        category: 'art-supplies',
        price: 34.99,
        countInStock: 12,
        rating: 4.9,
        numReviews: 73,
        user: adminUser._id,
        featured: true,
      },
      {
        name: 'Watercolor Paint Set',
        image: 'https://images.unsplash.com/photo-1574134935226-efbbe352d43b?ixlib=rb-4.0.3',
        description: '24 vibrant watercolor paints in a compact case with mixing palette and brush.',
        brand: 'ArtistPro',
        category: 'art-supplies',
        price: 28.99,
        countInStock: 15,
        rating: 4.6,
        numReviews: 41,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Sketching Pad (9x12")',
        image: 'https://images.unsplash.com/photo-1602738328654-51ab2ae6c4ff?ixlib=rb-4.0.3',
        description: 'Premium 100-page sketching pad with acid-free paper suitable for pencil, charcoal, and light washes.',
        brand: 'SketchMaster',
        category: 'art-supplies',
        price: 12.99,
        countInStock: 35,
        rating: 4.5,
        numReviews: 58,
        user: adminUser._id,
        featured: false,
      },
      {
        name: 'Calligraphy Marker Set',
        image: 'https://images.unsplash.com/photo-1596557407768-4428fe12302b?ixlib=rb-4.0.3',
        description: 'Set of 12 dual-tip brush pens for modern calligraphy and hand lettering projects.',
        brand: 'ScriptArt',
        category: 'art-supplies',
        price: 17.99,
        countInStock: 20,
        rating: 4.7,
        numReviews: 64,
        user: adminUser._id,
        featured: false,
      }
    ];
    
    console.log('Adding sample products to database...');
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} sample products added to database successfully`);

    // Start the server with port fallback logic
    const startPort = process.env.PORT || 5002;
    let currentPort = startPort;
    
    const startServerWithPortFallback = (port) => {
      const server = app.listen(port)
        .on('listening', () => {
          console.log(`Server running on port ${port}`);
        })
        .on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying port ${port + 1}...`);
            server.close();
            startServerWithPortFallback(port + 1);
          } else {
            console.error(`Error starting server: ${err.message}`);
          }
        });
    };
    
    startServerWithPortFallback(currentPort);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

startServer(); 