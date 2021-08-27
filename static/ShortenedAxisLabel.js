export default function shortenedAxisLabel(value) {
    if (Math.abs(value) < 10_000_000) {
        return value.toString()
    } else {
        return exponentialForm(value)
    }
}

function exponentialForm(value) {
    let exponent = Math.log10(Math.abs(value))

    function mantissa(value) {
        return (value / Math.pow(10, exponent)).toString().slice()
    }

    return (value < 0 ? "-" : "") + mantissa(value) + "10^" + exponent
}
