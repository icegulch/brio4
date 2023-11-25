module.exports = {
  layout: "product.liquid",
  permalink: "/products/{{ title | slugify }}/index.html",
    eleventyComputed: {
    meta_og: data => data.cover || null,
    retailersForProduct: (data) => {
      const productTitleToFind = data.title;
      const retailers = [];
      const retailersCollection = data.collections.retailers;

      // Iterate through each retailer in the "retailers" collection
      for (const retailer of retailersCollection) {
          const onlineProducts = retailer.data.online_products;
          const physicalLocations = retailer.data.physical_locations;

          // Check if physicalLocations is defined and not empty
          if (physicalLocations && physicalLocations.length > 0) {
              const physicalProducts = physicalLocations[0].products; // Assuming there's only one branch in physical_locations

              // Check if the product title is in either online or physical products
              if (
                  (onlineProducts && onlineProducts.find(product => product.title === productTitleToFind)) ||
                  (physicalProducts && physicalProducts.includes(productTitleToFind))
              ) {
                  // Add the retailer to the list
                  const storeLocations = physicalLocations
                      .filter((location) => location.branch_name || location.city)
                      .map((location) => location.branch_name || location.city);

                  retailers.push({
                      name: retailer.data.name,
                      productUrl: onlineProducts.find(product => product.title === productTitleToFind)?.url || "Not Offered Online",
                      storeLocations: storeLocations,
                  });
              }
          } else if (onlineProducts) {
              // Retailer is online-only
              const matchingProduct = onlineProducts.find((product) => product.title === productTitleToFind);

              if (matchingProduct) {
                  retailers.push({
                      name: retailer.data.name,
                      online_url: matchingProduct.url,
                      storeLocations: ["Online Only"],
                  });
              }
          }

      }

      return retailers;
    },
  },
};
