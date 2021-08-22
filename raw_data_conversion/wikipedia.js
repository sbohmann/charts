fs = require('fs')

datasets = [{
    name: 'inzidenzen',
    dataColumn: 11
}]

const dataRows = new Map()

for (const dataset of datasets) {
    const points = fs.readFileSync('raw_data/wikipedia/' + dataset.name + '.csv', 'utf-8')
        .split(/\n/)
        .flatMap(line => {
            const parts = line
                .split('||')
                .map(part => part.trim())
            if (parts.length > 1) {
                const dateMatch = parts[0].match(/\| ([0-9.]+)(?: .*)?/)
                if (!dateMatch) {
                    throw RangeError("Missing date at beginning of parts[0]" + parts[0])
                }
                const date = dateMatch[1]
                const incidence = parts[dataset.dataColumn]
                return {
                    date,
                    incidence
                }
            }
            return []
        })

    dataRows.set(dataset.name, points)
}

console.log(dataRows)

// fs.writeFileSync('data/wikipedia.json', JSON.stringify({
//     name: "Inzidenzen",
//     data
// }))
