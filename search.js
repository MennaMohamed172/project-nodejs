// const express= require('express');
// const { date } = require('joi');
// const app= express();
// const mongoose=require("mongoose");
// app.use(express.json());

// // DB connection

// mongoose.connect("mongodb://127.0.0.1:27017/donation" ,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// },(err)=>{
//      if(!err){
//         console.log("connected to db")
//      }
//      else{
//         console.log("ERROR")
//      }
// })



// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create express app
const app = express();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/products', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Define product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

// Define CRUD operations for products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/products/:id', getProduct, (req, res) => {
  res.json(res.product);
});

app.post('/products', async (req, res) => {
  const product = new Product({
    name:  req.body.name,
    price: req.body.price,
    description: req.body.description,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/products/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }

  if (req.body.price != null) {
    res.product.price = req.body.price;
  }

  if (req.body.description != null) {
    res.product.description = req.body.description;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/products/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get product by ID
async function getProduct(req, res, next) {
  let product;

  try {
    product = await Product.findById(req.params.id);

    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

// Start server
app.listen(3000, () => console.log('Server started on port 3000'));