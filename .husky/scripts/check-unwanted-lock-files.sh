#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Define the unwanted lock files
unwanted_files=("package-lock.json" "pnpm-lock.yaml" "bun.lockb")

# Check for unwanted lock files in the staged changes
for file in "${unwanted_files[@]}"; do
    if git diff --cached --name-only | grep -qE "^$file$"; then
        echo "Error: Commits containing '$file' are not allowed. Please use Yarn and remove this file from your commit."
        exit 1
    fi
done

# Allow only yarn.lock, not mandatory but should be the only lock file if present
if git diff --cached --name-only | grep -qE "^(package-lock\.json|pnpm-lock\.yaml|bun\.lockb)$"; then
    echo "Error: Only 'yarn.lock' is allowed as a lock file. Please remove any other lock files from your commit."
    exit 1
fi
