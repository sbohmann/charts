export function LinearScaling(data, positiveOnly) {
    return {
        get transformedData() {
            if (positiveOnly) {
                return data.map(value => {
                    if (value < 0) {
                        return null
                    }
                    return value
                })
            }
            return data
        },
        transformValue(value) {
            return value
        }
    }
}
