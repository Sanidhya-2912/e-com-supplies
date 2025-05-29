const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb+srv://tiwarisanidhya21:Sanidhya21@cluster0.bcvaj6r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
const client = new MongoClient(uri);

const products = [
  {
    _id: '683776d15e6fdaf888484d81',
    image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d82',
    image: 'https://images.unsplash.com/photo-1532991536991-8e1b6d6b1b34?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d83',
    image: 'https://images.unsplash.com/photo-1587820743271-8b01a8f66d9b?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d84',
    image: 'https://images.unsplash.com/photo-1613275012412-71c9ad3e1844?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d85',
    image: 'https://images.unsplash.com/photo-1575651848487-62c51e383f0b?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d86',
    image: 'https://images.unsplash.com/photo-1597518202381-5660b05d4d84?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d87',
    image: 'https://images.unsplash.com/photo-1607517986984-b1e01f6edb0e?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d88',
    image: 'https://images.unsplash.com/photo-1590961824576-8fffa80f177d?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d89',
    image: 'https://images.unsplash.com/photo-1591923254933-2ee3a67b8850?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d8a',
    image: 'https://images.unsplash.com/photo-1544716278-82dfe3ee6f96?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d8b',
    image: 'https://images.unsplash.com/photo-1623776051377-fb9e73a08bdf?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d8c',
    image: 'https://images.unsplash.com/photo-1601841164234-2f19a0f85a57?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d8d',
    image: 'https://images.unsplash.com/photo-1617111893933-cb3d54e6d902?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d8e',
    image: 'https://images.unsplash.com/photo-1597404674322-6c16b18cce9e?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d8f',
    image: 'https://images.unsplash.com/photo-1586520770409-4cfb78c8f65c?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d90',
    image: 'https://images.unsplash.com/photo-1612694575974-6374d8a579a4?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d91',
    image: 'https://images.unsplash.com/photo-1605535467413-06e6b2fc05f7?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d92',
    image: 'https://images.unsplash.com/photo-1555529771-6b92520504c8?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d93',
    image: 'https://images.unsplash.com/photo-1613307753805-4f7672f16831?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
  {
    _id: '683776d15e6fdaf888484d94',
    image: 'https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&q=80&fit=crop&w=800',
  },
];

async function updateImages() {
  try {
    await client.connect();
    const db = client.db('test'); // Replace 'test' with your database name
    const collection = db.collection('products');

    for (const product of products) {
      await collection.updateOne(
        { _id: new ObjectId(product._id) },
        { $set: { image: product.image } }
      );
      console.log(`Updated product ${product._id} with new image`);
    }

    console.log('✅ All product images updated successfully.');
  } catch (error) {
    console.error('❌ Error updating products:', error);
  } finally {
    await client.close();
  }
}

updateImages();
