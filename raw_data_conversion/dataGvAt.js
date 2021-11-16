const fs = require('fs')
const joda = require('@js-joda/core')
const output = require('./output')

function regex(... parts) {
    let result = ''
    for (let part of parts) {
        result += parts
    }
    return RegExp(result)
}

function emsInzidenzen() {
    const accumulation = fs.readFileSync('raw_data/timeline-faelle-ems.csv', 'utf-8')
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

    const points = []
    let previous = null
    for (const rawPoint of accumulation) {
        if (previous) {
            points.push({
                date: rawPoint.date,
                value: rawPoint.value - previous.value
            })
        }
        previous = rawPoint
    }

    let datasetName = 'inzidenzen'
    const datasets = [datasetName]
    const dataRows = new Map()
    dataRows.set(datasetName, points)

    const result = output.forDatasets(datasets, dataRows)

    let text = JSON.stringify(result[0])
    fs.writeFileSync('data/inzidenzen.json', text)
    return text
}

function hospitalisierungUndIntensiv() {
    const fs = require('fs')
    const joda = require('@js-joda/core')
    const output = require('./output')

    const accumulation = fs.readFileSync('raw_data/Hospitalisierung.csv', 'utf-8')
        .split(/\n/)
        .flatMap(line => {
            let match = line.match(/(\d{2}).(\d{2}).(\d{4}).*Österreich;(\d+);(?:\d+);(\d+);.*/)
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

        let text = JSON.stringify(result[0])
        fs.writeFileSync('data/hospitalisierung.json', text)
        return text
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

        let text = JSON.stringify(result[0])
        fs.writeFileSync('data/intensiv.json', text)
        return text
    }

    return [
        writeHospitalisierung(),
        writeIntensiv()]
}

console.log("Writing static/data.js")

let inzidenzen = emsInzidenzen()
let [hospitalisierung, intensiv] = hospitalisierungUndIntensiv()
let text = [inzidenzen, hospitalisierung, intensiv].join(', ')

let dataTemplate = fs.readFileSync('raw_data/templates/data.js.template', 'utf-8')
fs.writeFileSync('static/data.js', dataTemplate.replace('@_data_gv_at;', text), 'utf-8')
