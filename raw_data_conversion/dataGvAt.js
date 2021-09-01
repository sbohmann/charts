const fs = require('fs')
const joda = require('@js-joda/core')
const output = require('./output')

const points = fs.readFileSync('raw_data/timeline-faelle-ems.csv', 'utf-8')
    .split(/\n/)
    .flatMap(line => {
        let match = line.match(/(\d{4})-(\d{2})-(\d{2}).*Österreich;(\d+)/)
        if (match) {
            const date = joda.LocalDate
                .of(Number(match[1]), Number(match[2]), Number(match[3]))
            const value = Number(match[4])
            return [{
                date,
                value
            }]
        }
        return []
    })

console.log(points)

let datasetName = 'inzidenzen'
const datasets = [datasetName]
const dataRows = new Map()
dataRows.set(datasetName, points)

const result = output.forDatasets(datasets, dataRows)

fs.writeFileSync('data/inzidenzen.json', JSON.stringify(result))
