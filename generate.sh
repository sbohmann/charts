#!/bin/bash -xe
export generate_js_location="$1"
./fetch.sh
pwd
if [[ ! -e static/libraries ]]; then mkdir static/libraries; fi
if [[ ! -e static/libraries/js-joda.js ]]; then cp node_modules/@js-joda/core/dist/js-joda.js static/libraries; fi
node raw_data_conversion/dataGvAt.js
echo running "[$generate_js_location]"
node "$generate_js_location"
