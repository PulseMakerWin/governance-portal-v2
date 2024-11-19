#!/bin/bash
set -xe

# Navigate to source directory
cd /var/app/staging

# Install global tools
echo "Installing global tools..."
npm install -g yarn

# Install dependencies using yarn
echo "Installing dependencies with yarn..."
export SKIP_HUSKY=true
yarn install --production

# Build the application
echo "Building the application..."
yarn build

echo "Setup completed successfully"