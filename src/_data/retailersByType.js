const util = require('util');
const retailersData = require('./retailers.js');

const retailersByType = {
  online: {
    locations: [],
  },
  physical: {
    locationsByState: {},
  },
};

retailersData.forEach((retailer) => {
  retailer.locations.forEach((location) => {
    if (location.type === 'online') {
      // Online stores
      const onlineStore = {
        name: retailer.name,
        products: location.products,
      };
      retailersByType.online.locations.push(onlineStore);
    } else {
      const state = location.state;
      if (!retailersByType.physical.locationsByState[state]) {
        retailersByType.physical.locationsByState[state] = [];
      }
      const physicalLocations = retailer.locations.filter(loc => loc.type === 'physical');
      const storeName = (physicalLocations.length > 1) ? `${retailer.name} - ${location.branch_name}` : retailer.name;

      // Append the location to the state group
      retailersByType.physical.locationsByState[state].push({
        name: storeName,
        branch_name: location.branch_name,
        street1: location.street1,
        street2: location.street2,
        city: location.city,
        state: state,
        postal_code: location.postal_code,
        phone: location.phone,
        store_url: location.store_url,
        products: location.products,
      });
    }
  });

  // Sort physical locations within each state by city
  for (const state in retailersByType.physical.locationsByState) {
    retailersByType.physical.locationsByState[state].sort((a, b) => a.city.localeCompare(b.city));
  }
});

// Sort the states within the physical type by state
const sortedStates = Object.keys(retailersByType.physical.locationsByState).sort();

// Create an array of physical store locations grouped by state
const physicalLocationsByState = sortedStates.map(state => {
  return {
    state: state,
    locations: retailersByType.physical.locationsByState[state],
  };
});

// Convert the retailersByType object to an array
const retailersArray = Object.values(retailersByType);

// Add the sorted physical locations to the resulting array
retailersArray[1].locationsByState = physicalLocationsByState;

// console.log(util.inspect(retailersByType, { depth: null }));
module.exports = retailersByType;
