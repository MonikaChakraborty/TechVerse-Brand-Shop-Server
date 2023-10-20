const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.63dg6sa.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client.db('ProductsDB').collection('products');

    const cartCollection = client.db('cartDB').collection('cart');


    app.get('/products', async (req, res) => {
      // Handle logic for fetching all products without filtering by brand
      const allProducts = await productsCollection.find({}).toArray();
      res.send(allProducts);
    });
    
    // get to update product
    app.get('/update/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productsCollection.findOne(query);
      res.send(result);
    })
    
    
    // get specific products to see details
    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      // console.log('product id:', id);
      const query = { _id : new ObjectId(id)}
      // console.log('Query:', query);
      const result = await productsCollection.findOne(query);
      // console.log('result:', result);
      res.send(result);
    })




    // get brand products for product/brand route
    app.get('/brands/:brand', async(req, res) => {
      const brand = req.params.brand;
      // console.log('brand name:', brand);
      const query = {brand_name : brand}
      const products = await productsCollection.find(query).toArray();
      // console.log('products:', products);
      res.send(products);
    })



    app.post('/products', async(req, res) => {
        const newProduct = req.body;
        // console.log(newProduct);
        const result = await productsCollection.insertOne(newProduct);
        res.send(result);
    })
    
    
    
    
    // post cart items
    app.post('/cart', async(req, res) => {
     
      const cartItem = req.body;
      console.log(cartItem);
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })



    // app.post('/cart', async(req, res) => {
    //   const details = req.body;
    //   console.log(details);
    //   const result = await cartCollection.insertOne(details);
    //   res.send(result);
    // })



    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Tech server is running')
})



app.listen(port, () => {
    console.log(`Tech server is running on port: ${port}`);
})