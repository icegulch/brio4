const getBuildInfo = () => {
  const now = new Date();
  const timeZone = 'UTC';
  const buildTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone,
  }).format(now);
  return {
    time: {
      raw: now.toISOString(),
      formatted: `${buildTime} ${timeZone}`,
    }
  };
};

module.exports = {
  title: "With Brio",
  description: "With Brio extracts compelling stories from familiar data creating whimisical mountain mementos.",
  env: process.env.ELEVENTY_ENV,
  domain: process.env.ELEVENTY_ENV === "production" ? "https://withbr.io" : "http://localhost:8080",
  og_img: "/images/wm48-wood-bg.jpg",
  last_updated: getBuildInfo().time.formatted,
};