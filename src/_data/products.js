const fs = require("fs");
const path = require("path");

const productsFolder = path.resolve(__dirname, "../content/products");

const products = fs
  .readdirSync(productsFolder)
  .filter(name => path.extname(name) === ".json")
  .map(name => {
    const filename = path.basename(name, '.json'); // Remove the ".json" extension
    const rawProductData = require(path.join(productsFolder, name));

    // Create a new product object
    const productObject = {
      id: filename,
      ...rawProductData,
    };

    return productObject;
  });

module.exports = products;