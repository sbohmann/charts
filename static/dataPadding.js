export function buildPaddedData(data) {
    let minimumDate
    data.forEach(row => {
        let date = JSJoda.LocalDate.parse(row.firstDate)
        if (!minimumDate || date.compareTo(minimumDate) < 0) {
            minimumDate = date
        }
    })
    return data.map(row => {
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
