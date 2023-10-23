module.exports = {
  permalink: false,
  eleventyComputed: {
    location_types: (data) => {
      let types = [];

      if (data.online_products && data.online_products.length > 0) {
        types.push('online');
      }

      if (data.physical_locations && data.physical_locations.length > 0) {
        types.push('physical');
      }
      return types;
    },
  },
};
