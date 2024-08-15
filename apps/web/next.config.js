/** @type {import('next').NextConfig} */
const webpack = require("webpack");

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
  images: {
    domains: ["d2szwvl7yo497w.cloudfront.net"], // Add your domain here
  },
};
