module.exports = {

  cover:
    process.env.ELEVENTY_ENV === 'production' 
      ? '/covers' 
      : '',

  favicon:
    process.env.ELEVENTY_ENV === 'production'
      ? '/favicon'
      : '',

  opengraph:
    process.env.ELEVENTY_ENV === 'production'
      ? '/opengraph'
      : ''

};