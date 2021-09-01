const fs = require('fs')
const joda = require('@js-joda/core')
const output = require('./output')

const datasets = [
    {
        name: 'inzidenzen',
        dataColumn: 11
    },
    {
        name: 'hospitalisierungen',
        dataColumn: 10
    },
    {
        name: 'intensiv',
        dataColumn: 10
    }
]

const dataRows = new Map()

for (const dataset of datasets) {
    const points = fs.readFileSync('raw_data/wikipedia/' + dataset.name + '.csv', 'utf-8')
        .split(/\n/)
        .flatMap(line => {
            const parts = line
                .split('||')
                .map(part => part.trim())
            if (parts.length > 1) {
                const dateMatch = parts[0].match(/\| (\d{2})\.(\d{2})\.(\d{4})(?: .*)?/)
                if (!dateMatch) {
                    throw RangeError("Missing date at beginning of parts[0]" + parts[0])
                }
                const date = joda.LocalDate
                    .of(Number(dateMatch[3]), Number(dateMatch[2]), Number(dateMatch[1]))
                const value = Number(parts[dataset.dataColumn])
                return [{
                    date,
                    value
                }]
            }
            return []
        })

    dataRows.set(dataset.name, points)
}

const datasetNames = datasets.map(set => set.name)
const result = output.forDatasets(datasetNames, dataRows)

fs.writeFileSync('data/wikipedia.json', JSON.stringify(result))
