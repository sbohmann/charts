#!/bin/bash -xe
export generate_js_location="$1"
(cd raw_data && ./fetch.sh)
node raw_data_conversion/dataGvAt.js
echo running "[$generate_js_location]"
node "$generate_js_location"
