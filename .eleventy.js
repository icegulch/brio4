const util = require("util");

module.exports = function (eleventyConfig) {

  eleventyConfig.addFilter("dump", (value, depth = 2) => {
  //   return liquid.filters.json(value, depth);
    return util.inspect(value, { showHidden: false, depth: depth, colors: false });
  });

  eleventyConfig.addCollection("products", function (collection) {
    return collection.getFilteredByGlob("./src/content/products/*.md");
  });
  
  eleventyConfig.addCollection("retailers", function (collection) {
    return collection.getFilteredByGlob("./src/content/retailers/*.md");
  });
  
  eleventyConfig.addCollection("guides", function (collection) {
    return collection.getFilteredByGlob("./src/content/guides/*.md");
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

  const markdownIt = require("markdown-it");
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });
  const markdownItAttrs = require("markdown-it-attrs");
  md.use(markdownItAttrs);

  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addFilter("markdownify", (str) => md.render(str));

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
