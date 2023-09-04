const { log } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Product = require("./models/productModel.cjs"); // Note the changed file extension

//routes

app.use(express.json());
app.use(express.urlencoded({extended: false}))


app.get("/products", async(req, res) =>{
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})

        
    }
})

app.get("/products/:id", async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})

        
    }
})

app.put("/products/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            return res.status(404).json({message: `Cannot find any product with ID ${id, req.body}`})
            // we cannot find any product in the database
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

app.get("/blog", (req, res) => {
    res.send("Hello blog!!!");
});

app.post("/product", async (req, res) =>{
   try{
    const product = await Product.create(req.body);
    res.status(200).json(product);
   } catch (error){
    console.log(error.message);
    res.status(500).json({message: error.message});
   }
});

app.delete("/products/id:", async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID${id}`})
        }
        res.status(200).json({message: `ID${id} deleted.`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

const connectionString = "mongodb+srv://joel:Dragonball534@grimdarkindex.ppovxn3.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(3000, () => {
            console.log('node api app is running on port 3000');
        });
    })
    .catch((error) => {
        console.log(error);
    });
