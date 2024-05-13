/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

module.exports = withPWA({
  transpilePackages: ["@repo/ui", "@repo/common", "@repo/recoil"],
});
