#!/bin/sh

# Default environment and launcher
environment="development"
launcher="nodemon"

# Check arguments
while [[ $# > 0 ]]; do
  if [ $1 = "-l" ]; then launcher=$2; fi
  if [ $1 = "-e" ]; then environment=$2; fi
  shift 2
done

# Handle environment shortcut names
if [ $environment = "dev" ]; then environment="development"; fi
if [ $environment = "prod" ]; then environment="production"; fi

# Run using specified launcher and environment
echo "$launcher server/server.js -env=$environment"
$launcher server/server.js -env=$environment
