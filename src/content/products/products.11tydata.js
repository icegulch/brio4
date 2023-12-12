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
          // Iterate through each physical location
          for (const location of physicalLocations) {
            const branchProducts = location.products;

            // Check if the product title is in branchProducts
            if (branchProducts && branchProducts.includes(productTitleToFind)) {
              // Add the retailer to the list for this specific location
              retailers.push({
                name: retailer.data.name,
                productUrl: "Not Offered Online", // Adjust as needed
                storeLocations: [location.branch_name || location.city],
              });
            }
          }
        }

        // Check if the product is available online for the current retailer
        if (onlineProducts && Array.isArray(onlineProducts)) {
          const matchingProduct = onlineProducts.find(
            (product) => product.title === productTitleToFind
          );

          if (matchingProduct) {
            // Add the retailer to the list with online product information
            retailers.push({
              name: retailer.data.name,
              productUrl: matchingProduct.url,
              storeLocations: ["Online Only"],
            });
          }
        }
      }

      return retailers;
    },
  
    // retailersForProduct: (data) => {
    //   const productTitleToFind = data.title;
    //   const retailers = [];
    //   const retailersCollection = data.collections.retailers;

    //   // Iterate through each retailer in the "retailers" collection
    //   for (const retailer of retailersCollection) {
    //     const onlineProducts = retailer.data.online_products;
    //     const physicalLocations = retailer.data.physical_locations;

    //     // Check if physicalLocations is defined and not empty
    //     if (physicalLocations && physicalLocations.length > 0) {
    //         const physicalProducts = physicalLocations[0].products; // Assuming there's only one branch in physical_locations

    //         // Check if the product title is in either online or physical products
    //         if (
    //         (onlineProducts && onlineProducts.find(product => product.title === productTitleToFind)) ||
    //         (physicalProducts && physicalProducts.includes(productTitleToFind))
    //         ) {
    //         // Add the retailer to the list
    //         const storeLocations = physicalLocations
    //             .filter((location) => location.branch_name || location.city)
    //             .map((location) => location.city);

    //         // Check if onlineProducts is defined before accessing its properties
    //         const onlineProduct = onlineProducts && Array.isArray(onlineProducts) ? onlineProducts.find(product => product.title === productTitleToFind) : null;

    //         retailers.push({
    //             name: retailer.data.name,
    //             productUrl: onlineProduct ? onlineProduct.url : "Not Offered Online",
    //             storeLocations: storeLocations,
    //         });
    //         }
    //     } else if (onlineProducts && Array.isArray(onlineProducts)) {
    //         // Retailer is online-only
    //         const matchingProduct = onlineProducts.find((product) => product.title === productTitleToFind);

    //         if (matchingProduct) {
    //         retailers.push({
    //             name: retailer.data.name,
    //             productUrl: matchingProduct.url,
    //             storeLocations: ["Online Only"],
    //         });
    //         }
    //     }

    //   }

    //   return retailers;
    // },
  },
};
