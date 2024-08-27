/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/keyv/, (data) => {
        delete data.dependencies[0].critical;
        return data;
      })
    );
    return config;
  },
  
  transpilePackages: ["@repo/ui", "@repo/common", "@repo/recoil"],
   images: isDev
    ? { unoptimized: true }
    : {
        domains: ["d2szwvl7yo497w.cloudfront.net"],
        //Add your domain here
      },

};
