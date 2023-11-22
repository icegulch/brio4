const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
require('dotenv').config();
const isProduction = process.env.ELEVENTY_ENV === `production`;

module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("./src/images");

  eleventyConfig.addCollection("products", function (collection) {
    return collection.getFilteredByGlob("./src/content/products/*.md");
  });
  
  eleventyConfig.addCollection("retailers", function (collection) {
    return collection.getFilteredByGlob("./src/content/retailers/*.md");
  });

  eleventyConfig.addCollection("physicalRetailStores", function (collection) {
    const retailers = collection.getFilteredByGlob("./src/content/retailers/*.md");

    const physicalRetailStores = [];
    
    retailers.forEach((retailer) => {
      if (retailer.data.physical_locations) {
        retailer.data.physical_locations.forEach((location) => {
          const storeName = location.branch_name
            ? `${retailer.data.name} - ${location.branch_name}`
            : retailer.data.name;

          physicalRetailStores.push({
            name: storeName,
            street1: location.street1 || '',
            street2: location.street2 || '',
            city: location.city || '',
            state: location.state || '',
            postal_code: location.postal_code || '',
            phone: location.phone || '',
            email: location.email || '',
            store_url: location.store_url || '',
            products: location.products || [],
          });
        });
      } else {
        // Handle the case when physical_locations is missing or empty
        physicalRetailStores.push({
          name: retailer.data.name,
          street1: '',
          street2: '',
          city: '',
          state: '',
          postal_code: '',
          phone: '',
          email: '',
          store_url: '',
          products: [],
        });
      }
    });

    return physicalRetailStores;
  });

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addLiquidFilter("cloudinaryPrependDir", function (content) {
    if (isProduction) {

      const cloudinaryDirectory = "/products";
      const modifiedContent = content.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, function (match, p1, p2, p3) {
        const imageUrl = p2;
        const newUrl = cloudinaryDirectory + imageUrl;
        return `<img${p1}src="${newUrl}"${p3}>`;
      });
      return modifiedContent;
    } else {
      // Return the content unchanged in non-production environments
      return content;
    }
  });

  eleventyConfig.addFilter("group_by", groupBy);

  eleventyConfig.addFilter("excludeByField", (array, field, value) => {
    return array.filter(item => item[field] !== value);
  });

  eleventyConfig.addFilter("stateNames", function (stateAbbr) {
    const stateAbbreviationsToNames = {
      CO: "Colorado",
      NH: "New Hampshire",
      VT: "Vermont",
      NY: "New York",
      MA: "Massachusetts",
      ME: "Maine",
      // Add more state mappings as needed
    };

    return stateAbbreviationsToNames[stateAbbr] || stateAbbr;
  });

  // Minify HTML Output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if( isProduction && outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};

function groupBy(array, key) {
  const get = entry => key.split('.').reduce((acc, key) => acc[key], entry)

  const map = array.reduce((acc, entry) => {
    const value = get(entry)

    if (typeof acc[value] === 'undefined') {
      acc[value] = []
    }

    acc[value].push(entry)
    return acc
  }, {})

  return Object.keys(map).reduce(
    (acc, key) => [...acc, { name: key, items: map[key] }],
    []
  )
}
