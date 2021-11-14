#!/bin/bash -e
echo Fetching data from data.gv.at
cd raw_data
wget -nc https://info.gesundheitsministerium.gv.at/data/timeline-faelle-ems.csv
wget -nc https://covid19-dashboard.ages.at/data/Hospitalisierung.csv
