#!/bin/bash -e
echo Fetching data from data.gv.at
cd raw_data
rm timeline-faelle-ems.csv && wget https://info.gesundheitsministerium.gv.at/data/timeline-faelle-ems.csv
rm Hospitalisierung.csv && wget https://covid19-dashboard.ages.at/data/Hospitalisierung.csv
