export function LogarithmicScaling(data, threshold) {
    let transformedThreshold
    let transformedData

    function init() {
        transformedThreshold = transformDataPoint(threshold)
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
        if (value < threshold) {
            return interpolatedValue(value)
        }
        return Math.log10(value)
    }

    function interpolatedValue(value) {
        return (value / threshold) * transformedThreshold
    }

    init()

    return {
        get transformedData() {
            return buildTransformedData()
        }
    }
}
