
const { MongoClient } = require('mongodb');
const MONGODB_URI = "mongodb+srv://eliseb:MongoDB123@cluster0.2slx9zb.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DB_NAME);
  console.log('Connected to MongoDB database:', MONGODB_DB_NAME);

  // Any additional code that needs to interact with the database can be added here
  // Don't forget to close the connection when you're done!
  await client.close();
  console.log('Disconnected from MongoDB database:', MONGODB_DB_NAME);
}

connectToDatabase().catch((error) => console.error(error));

const fs = require('fs');

async function insertProducts(db, products) {
  const collection = db.collection('products');
  const result = await collection.insertMany(products);
  console.log(`${result.insertedCount} products inserted`);
  console.log(result);
}
async function main() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(MONGODB_DB_NAME);

    try {
      const data = fs.readFileSync('all_products.json');
      const products = JSON.parse(data);

      await insertProducts(db, products);
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
}

main();

const brand1 = 'Dedicated';
const brand2 = 'Montlimart';
const brand3 = 'Circle Sport';

async function findProductsByBrand(db, brand) {
  const collection = db.collection('products');
  const products = await collection.find({ brand }).toArray();
  console.log(`Found ${products.length} products for brand '${brand}'`);
  console.log(products);
}


//Find all products related to a given brands
async function query1() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(MONGODB_DB_NAME);

  try {
    await findProductsByBrand(db, brand3);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

async function findProductsByPriceLessThan(db, price) {
  const collection = db.collection('products');
  const products = await collection.find({ price: { $lt: price } }).toArray();
  console.log(`Found ${products.length} products with price less than ${price}`);
  console.log(products);
}

//Find all products less than a price
async function query2() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(MONGODB_DB_NAME);

  try {
    await findProductsByPriceLessThan(db, 100);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

async function findProductsSortedByPrice(db, sortDirection = 1) {
  const collection = db.collection('products');
  const sort = { price: sortDirection };
  const products = await collection.find().sort(sort).toArray();
  console.log(`Found ${products.length} products sorted by price (in ${sortDirection === 1 ? 'ascending' : 'descending'} order)`);
  console.log(products);
}

// Find all products sorted by price
async function query3() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(MONGODB_DB_NAME);

  try {
    await findProductsSortedByPrice(db,-1);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

query1()
query2()
query3()




