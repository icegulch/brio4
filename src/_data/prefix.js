module.exports = {

  cover:
    process.env.ELEVENTY_ENV === 'production' 
      ? '/covers' 
      : '',

  favicon:
    process.env.ELEVENTY_ENV === 'production'
      ? '/favicon'
      : ''

};