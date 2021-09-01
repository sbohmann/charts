module.exports.forDatasets = function (datasetNames, dataRows) {
    let minimumDate, maximumDate
    let data

    function result() {
        determineDateLimits()
        collectData()
        console.log(data)
        return buildOutput()
    }

    function determineDateLimits() {
        for (const dataPoint of datasetNames.flatMap(name => dataRows.get(name))) {
            if (!minimumDate || dataPoint.date.compareTo(minimumDate) < 0) {
                minimumDate = dataPoint.date
            }
            if (!maximumDate || dataPoint.date.compareTo(maximumDate) > 0) {
                maximumDate = dataPoint.date
            }
        }
    }

    function collectData() {
        data = new Map()
        for (let date = minimumDate; date.compareTo(maximumDate) <= 0; date = date.plusDays(1)) {
            data.set(date.toString(), new Map())
        }
        for (const name of datasetNames) {
            for (const row of dataRows.get(name)) {
                data.get(row.date.toString()).set(name, row.value)
            }
        }
    }

    function buildOutput() {
        let output = []
        for (const name of datasetNames) {
            let values = []
            for (let date = minimumDate; date.compareTo(maximumDate) <= 0; date = date.plusDays(1)) {
                values.push(data.get(date.toString()).get(name))
            }
            output.push({
                name: name,
                firstDate: minimumDate,
                points: values
            })
        }
        return output
    }

    return result()
}
