/* eslint-disable no-console, no-process-exit */
const fs = require('fs').promises;
const dedicatedbrand = require('./eshops/dedicatedbrand');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    
    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
	
	    // Convert the products array to JSON format
    const jsonProducts = JSON.stringify(products);

    // Write the JSON data to a file called "prod_dedicated.json"
    await fs.writeFile('prod_dedicated.json', jsonProducts, 'utf8');
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