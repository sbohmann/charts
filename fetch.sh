#!/bin/bash -e
echo Fetching data from data.gv.at
cd raw_data
wget -O timeline-faelle-ems.csv https://info.gesundheitsministerium.gv.at/data/timeline-faelle-ems.csv
wget -O Hospitalisierung.csv https://covid19-dashboard.ages.at/data/Hospitalisierung.csv
