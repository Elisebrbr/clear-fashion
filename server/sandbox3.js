/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/circlesport');
const fs = require('fs').promises;

async function sandbox (eshop = 'https://shop.circlesportswear.com/collections/collection-femme') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
	    // Convert the products array to JSON format
    const jsonProducts = JSON.stringify(products);

    // Write the JSON data to a file called "prod_circle.json"
    await fs.writeFile('prod_circle.json', jsonProducts, 'utf8');
	console.log('File saved successfully!');
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);