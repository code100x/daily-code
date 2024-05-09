#!/bin/sh

echo "Copying package.json and yarn.lock files to corresponding directories..."

# Find all package.json files and copy them to corresponding directories
find . -type f \( -name "package.json" -o -name "yarn.lock" \) | while read file; do
    dir=$(dirname "${file}")
    mkdir -p "./${dir}"
    cp "${file}" "./${dir}"
    echo "Copied ${file} to ./${dir}/"
done

echo "Package.json and yarn.lock files copied successfully."
