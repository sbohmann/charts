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
        if (value < Math.E) {
            return interpolatedValue(value)
        }
        return Math.log(value)
    }

    function interpolatedValue(value) {
        return value / Math.E
    }

    function firstLabelIndex() {
        let rawExponent = Math.log10(minimumValue)
        let minimumExponent = Math.floor(rawExponent)
        let resultingIndex = minimumExponent * 3
        let value = Math.pow(10, minimumExponent)
        if (value >= minimumValue) {
            return resultingIndex
        }
        ++resultingIndex
        value *= 2
        if (value >= minimumValue) {
            return resultingIndex
        }
        return resultingIndex + 1
    }

    init()

    return {
        get transformedData() {
            return buildTransformedData()
        },
        get nextLabel() {
            let currentLabelIndex = firstLabelIndex()
            return () => labelForIndex(currentLabelIndex++)
        }
    }
}
