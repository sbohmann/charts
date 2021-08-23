const fs = require('fs')
const joda = require('@js-joda/core')

datasets = [
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
                return {
                    date,
                    value
                }
            }
            return []
        })

    dataRows.set(dataset.name, points)
}

let minimumDate, maximumDate
for (const dataPoint of datasets.flatMap(dataset => dataRows.get(dataset.name))) {
    if (!minimumDate || dataPoint.date.compareTo(minimumDate) < 0) {
        minimumDate = dataPoint.date
    }
    if (!maximumDate || dataPoint.date.compareTo(maximumDate) > 0) {
        maximumDate = dataPoint.date
    }
}

let data = new Map()
for (let date = minimumDate; date.compareTo(maximumDate) <= 0; date = date.plusDays(1)) {
    data.set(date.toString(), new Map())
}
for (const dataset of datasets) {
    for (const row of dataRows.get(dataset.name)) {
        data.get(row.date.toString()).set(dataset.name, row.value)
    }
}

console.log(data)

let output = []
for (const dataset of datasets) {
    let values = []
    for (let date = minimumDate; date.compareTo(maximumDate) <= 0; date = date.plusDays(1)) {
        values.push(data.get(date.toString()).get(dataset.name))
    }
    output.push({
        name: dataset.name,
        points: values
    })
}

fs.writeFileSync('data/wikipedia.json', JSON.stringify(output))
