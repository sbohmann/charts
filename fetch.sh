#!/bin/bash -e
echo Fetching data from data.gv.at
if [[ ! -e raw_data ]]; then mkdir raw_data; fi
cd raw_data
wget -O timeline-faelle-ems.csv https://info.gesundheitsministerium.gv.at/data/timeline-faelle-ems.csv
wget -O Hospitalisierung.csv https://covid19-dashboard.ages.at/data/Hospitalisierung.csv
