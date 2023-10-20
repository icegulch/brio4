const fs = require("fs");
const path = require("path");

const productsFolder = path.resolve(__dirname, "../content/products");

const products = fs
  .readdirSync(productsFolder)
  .filter(name => path.extname(name) === ".json")
  .map(name => ({
    ...require(path.join(productsFolder, name)),
  }));

module.exports = products;