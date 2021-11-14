#!/bin/bash -xe
export generate_js_location="$1"
./fetch.sh
pwd
node raw_data_conversion/dataGvAt.js
echo running "[$generate_js_location]"
node "$generate_js_location"
