const util = require("util");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("dump", (obj) => {
    return util.inspect(obj, { showHidden: false, depth: null, colors: false });
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
