export function LogarithmicScaling(data, positiveOnly) {
    let transformedData

    function buildTransformedData() {
        if (!transformedData) {
            calculateTransformedData()
        }
        return transformedData
    }

    function calculateTransformedData() {
        transformedData = data.map(set => ({
            name: set.name,
            points: set.points.map(transformDataPoint)
        }))
    }

    function transformDataPoint(value) {
        if (value === null) {
            return null
        }
        if (positiveOnly && value < 0) {
            return null
        }
        if (value < Math.E) {
            return interpolatedValue(value)
        }
        return Math.log(value)
    }

    function interpolatedValue(value) {
        return value / Math.E
    }

    return {
        get transformedData() {
            return buildTransformedData()
        }
    }
}
