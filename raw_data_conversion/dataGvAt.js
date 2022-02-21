const fs = require('fs')
const joda = require('@js-joda/core')
const output = require('./output')

const regions = [
    {inputName: 'Österreich', outputName: 'oesterreichGesamt'},
    {inputName: 'Österreich', outputName: 'oesterreich'},
    {inputName: 'Wien', outputName: 'wien'},
    {inputName: 'Niederösterreich', outputName: 'niederoesterreich'},
    {inputName: 'Oberösterreich', outputName: 'oberoesterreich'},
    {inputName: 'Burgenland', outputName: 'burgenland'},
    {inputName: 'Steiermark', outputName: 'steiermark'},
    {inputName: 'Kärnten', outputName: 'kaernten'},
    {inputName: 'Salzburg', outputName: 'salzburg'},
    {inputName: 'Tirol', outputName: 'tirol'},
    {inputName: 'Vorarlberg', outputName: 'vorarlberg'}
]

function emsInzidenzen(region) {
    const accumulation = fs.readFileSync('raw_data/timeline-faelle-ems.csv', 'utf-8')
        .split(/\n/)
        .flatMap(line => {
            let match = line.match(new RegExp('(\\d{4})-(\\d{2})-(\\d{2}).*' + region + ';(\\d+)'))
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

    if (accumulation.length === 0) {
        console.log("No inzidenzen data found for region [" + region + "]")
    }

    const points = []
    let previous = null
    for (const rawPoint of accumulation) {
        if (previous) {
            const dayDistance = joda.Period.between(previous.date, rawPoint.date).days()
            for (let date = previous.date.plusDays(1);
                 date.compareTo(rawPoint.date) <= 0;
                 date = date.plusDays(1)) {
                points.push({
                    date,
                    value: (rawPoint.value - previous.value) / dayDistance
                })
            }
        }
        previous = rawPoint
    }

    let datasetName = 'inzidenzen'
    const datasets = [datasetName]
    const dataRows = new Map()
    dataRows.set(datasetName, points)

    const result = output.forDatasets(datasets, dataRows)

    return JSON.stringify(result[0])
}

function hospitalisierungUndIntensiv(region) {
    const fs = require('fs')
    const joda = require('@js-joda/core')
    const output = require('./output')

    const accumulation = fs.readFileSync('raw_data/Hospitalisierung.csv', 'utf-8')
        .split(/\n/)
        .flatMap(line => {
            let match = line.match(new RegExp('(\\d{2}).(\\d{2}).(\\d{4}).*' + region + ';(\\d+);(?:\\d+);(\\d+);.*'))
            if (match) {
                const date = joda.LocalDate
                    .of(Number(match[3]), Number(match[2]), Number(match[1]))
                const hospitalisierung = Number(match[4])
                const intensiv = Number(match[5])
                return [{
                    date,
                    hospitalisierung,
                    intensiv
                }]
            }
            return []
        })

    if (accumulation.length === 0) {
        console.log("No hospitalisierung / intensiv data found for region [" + region + "]")
    }

    function writeHospitalisierung() {
        const points = []
        let previous = null
        for (const rawPoint of accumulation) {
            if (previous) {
                points.push({
                    date: rawPoint.date,
                    value: rawPoint.hospitalisierung
                })
            }
            previous = rawPoint
        }

        let datasetName = 'hospitalisierung'
        const datasets = [datasetName]
        const dataRows = new Map()
        dataRows.set(datasetName, points)

        const result = output.forDatasets(datasets, dataRows)

        return JSON.stringify(result[0])
    }

    function writeIntensiv() {
        const points = []
        let previous = null
        for (const rawPoint of accumulation) {
            if (previous) {
                points.push({
                    date: rawPoint.date,
                    value: rawPoint.intensiv
                })
            }
            previous = rawPoint
        }

        let datasetName = 'intensiv'
        const datasets = [datasetName]
        const dataRows = new Map()
        dataRows.set(datasetName, points)

        const result = output.forDatasets(datasets, dataRows)

        return JSON.stringify(result[0])
    }

    return [
        writeHospitalisierung(),
        writeIntensiv()]
}

console.log("Writing static/data.js")

let result = fs.readFileSync('templates/data.js.template', 'utf-8')

for (let region of regions) {
    let inzidenzen = emsInzidenzen(region.inputName)
    let [hospitalisierung, intensiv] = hospitalisierungUndIntensiv(region.inputName)
    let text = [inzidenzen, hospitalisierung, intensiv].join(', ')
    result = result.replace('@_' + region.outputName + ';', text)
}

fs.writeFileSync('static/data.js', result, 'utf-8')
