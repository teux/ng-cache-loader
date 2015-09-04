#!/usr/bin/env bash

# unit
./node_modules/mocha/bin/mocha test/unit

# build example in test/out/main.out.js
./node_modules/webpack/bin/webpack.js --config=test/webpack.config.js