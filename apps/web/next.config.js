/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  transpilePackages: ["@repo/ui", "@repo/common", "@repo/recoil"],
};
