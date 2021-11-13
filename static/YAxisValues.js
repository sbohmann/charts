export function DecimalYAxisValues() {
    let next
    let state = -1
    let base = 1
    return {
        get() {
            switch (state) {
                case 0:
                    next = base
                    break
                case 1:
                    next = base * 2
                    break
                case 2:
                    next = base * 5
                    break
                case 3:
                    base *= 10
                    next = base
                    break
                default:
                    next = 0
            }
            state = (state + 1) % 4
            return next
        }
    }
}

export function BinaryYAxisValues() {
    let value = 1
    return {
        get() {
            let result = value
            value *= 2
            return result
        }
    }
}
