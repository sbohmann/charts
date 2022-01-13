export function buildPaddedData(data) {
    let minimumDate
    let maximumDate
    data.forEach(row => {
        let firstDateOfRow = JSJoda.LocalDate.parse(row.firstDate)
        if (minimumDate === undefined || firstDateOfRow.compareTo(minimumDate) < 0) {
            minimumDate = firstDateOfRow
        }
        let lastDateOfRow = firstDateOfRow.plusDays(row.points.length - 1)
        if (maximumDate === undefined || lastDateOfRow.compareTo(maximumDate) > 0) {
            maximumDate = lastDateOfRow
        }
    })
    return {
        minimumDate,
        maximumDate,
        values: data.map(row => {
            let firstDate = JSJoda.LocalDate.parse(row.firstDate)
            const paddingLength = minimumDate.daysUntil(firstDate)
            let padding = []
            for (let index = 0; index < paddingLength; ++index) {
                padding.push(null)
            }
            return {
                name: row.name,
                points: padding.concat(row.points)
            }
        })
    }
}
