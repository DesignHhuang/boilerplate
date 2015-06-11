#!/bin/sh

# Default script, environment and launcher
script="server/main.js"
launcher="nodemon"
environment="development"

# Check arguments
while [[ $# > 0 ]]; do
  if [ $1 = "-s" ]; then script=$2; fi
  if [ $1 = "-l" ]; then launcher=$2; fi
  if [ $1 = "-e" ]; then environment=$2; fi
  shift 2
done

# Handle environment shortcut names
if [ $environment = "dev" ]; then environment="development"; fi
if [ $environment = "prod" ]; then environment="production"; fi

# Run using specified launcher and environment
echo "$launcher $script -env=$environment"
$launcher $script -env=$environment
