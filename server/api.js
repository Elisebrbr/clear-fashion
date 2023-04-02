const { ObjectID } = require('bson');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {MongoClient} = require('mongodb');
const MONGODB_URI = "mongodb+srv://eliseb:MongoDB123@cluster0.2slx9zb.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

var ObjectId=require('mongodb').ObjectId;


const PORT = 8092;
const app = express();




module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', async(request, response) => {

    //response.send({'ack':true});

    const client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');
    const products = await collection.find({}).toArray();
    response.send(products);


});



app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

async function ID(id){

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');
    const produ = await collection.find({"_id": new ObjectId(id)}).toArray();
    return produ;
}


async function gettingProducts(limit, brand , price) {
    const client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    let query = {};
    if (brand) {
        query.brand = brand;
    }
    if (price) {
        query.price = { $lte: parseInt(price) };
    }

    const products = await collection.find(query).sort({ price: 1 }).limit(limit).toArray();

    return products;
}


async function getProducts(size, brand, price, page,sort) {
    const client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    let query = {};
    let sortquery = {};
    if (brand) {
        query.brand = brand;
    }
    if (price) {
        query.price = { $lte: parseInt(price) };
    }

    if (sort === 'asc') {

        sortquery.price = 1;
    }
    if (sort === 'desc') {

        sortquery.price = -1;
    }

    if (sort === 'old') {

        sortquery.date = 1;
    }
    if (sort === 'new') {

        sortquery.date = -1;
    }

    const products = await collection.find(query).sort(sortquery).skip((page - 1) * size).limit(size).toArray();

    return products;
}

app.get('/products', async (req, res) => {
    const page = parseInt(req.query.page || 1);
    const size = parseInt(req.query.size || 12);
    const brand = req.query.brand || null;
    const price = req.query.price || null;
    const sort=req.query.sort|| null;
    let query = {};

    const client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');


    if (brand) {
        query.brand = brand;
    }
    if (price) {
        query.price = { $lte: parseInt(price) };
    }



    const totalProducts = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / size);

    const products = await getProducts(size, brand, price, page,sort);



    res.send({
        products,
        totalPages,
        currentPage: page,
        totalProducts,
    });
});




app.get('/products/search', async (request, response) => {
    const limit = parseInt(request.query.limit) || 12;
    const brand = request.query.brand || null;
    const price = request.query.price || null;

    const products = await gettingProducts(limit, brand, price);
    response.json(products);
});


app.get('/brands', async(request,response)=>{

    const client = await MongoClient.connect(MONGODB_URI, { 'useNewUrlParser': true });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');
    const produ = await collection.distinct('brand');

    response.send(produ);
})





app.get('/products/:id', async(request, response) => {

    const result=await ID(request.params.id);
    response.send(result);
});
