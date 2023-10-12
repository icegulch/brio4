const fs = require("fs");
const path = require("path");

const retailersFolder = path.resolve(__dirname, "../content/retailers");

const retailers = fs
  .readdirSync(retailersFolder)
  .filter(name => path.extname(name) === ".json")
  .map(name => ({
    ...require(path.join(retailersFolder, name)),
  }));

module.exports = retailers;