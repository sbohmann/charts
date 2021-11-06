export function LogarithmicScaling(data, positiveOnly) {
    let transformedData
    let minimumValue
    let maximumValue

    function init() {
        for (const value of data) {
            if (!minimumValue || value < minimumValue) {
                minimumValue = value
            }
            if (!maximumValue || value > maximumValue) {
                maximumValue = value
            }
        }
    }

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
        if (value < 1) {
            if (value < 0) {
                console.log(value)
            }
            return value
        }
        if (Math.log.value < 0) {
            console.log(value)
        }
        return Math.log(value)
    }

    init()

    return {
        get transformedData() {
            return buildTransformedData()
        },
        transformValue(value) {
            return transformDataPoint(value)
        }
    }
}
