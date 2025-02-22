const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const { MongoClient, ObjectId } = require('mongodb');
const MONGODB_URI = "mongodb+srv://eliseb:MongoDB123@cluster0.2slx9zb.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

const PORT = 8092;

const app = express();
module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
    response.send({'ack': true});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);




app.get('/products/search', async (req, res, next) => {
    const { limit = 12, brand = null, price = null } = req.query;
    const query = {};

    if (brand) {
        query.brand = brand;
    }

    if (price) {
        query.price = { $lte: Number(price) };
    }

    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);

    try {
        const collection = db.collection('products');
        const products = await collection
            .find(query)
            .limit(Number(limit))
            .sort({ price: 1 })
            .toArray();

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);
    try {
        const collection = db.collection('products');
        const product = await collection.findOne({ _id: ObjectId(productId) });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found or not existing' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.get('/products', async (req, res) => {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    try {
        const result = await collection.find({}).toArray();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.get('/brands', async (req, res) => {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    try {
        const result = await collection.distinct('brand');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.get('/sort', async (request, response) => {
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const collection = client.db(MONGODB_DB_NAME).collection('products');
    const sortVal = request.query.sort;
    const sortType = {};
    if (sortVal === '1') {
        sortType.price = 1;
    } else if (sortVal === '-1') {
        sortType.price = -1;
    } else {
        sortType.price = 0;
    }
    try {
        const result = await collection.find({}).sort(sortType).toArray();
        response.json(result);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});




