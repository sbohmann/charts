export function GraphPainter(canvas, scaling) {
    const context = canvas.getContext('2d')
    const data = scaling.transformedData

    let xStart, xEnd, yStart, yEnd
    let n, yMin, yMax
    let xScale, yScale

    function run() {
        determineDrawingBounds()
        determineDataBounds()
        determineScales()
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = "#ffeedd"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.lineWidth = 5
        drawYAxisLines()
        data.forEach(paintDataSet)
    }

    function determineDrawingBounds() {
        xStart = 100
        xEnd = canvas.width - 15
        yStart = canvas.height - 15
        yEnd = 15
    }

    function determineDataBounds() {
        data.forEach(set => {
            if (!n || set.points.length > n) {
                n = set.points.length
            }
            set.points.forEach(point => {
                if (point !== null && (yMin === undefined || point < yMin)) {
                    console.log("yMin goes down to ", point)
                    yMin = point
                }
                if (point !== null && (yMax === undefined || point > yMax)) {
                    yMax = point
                }
            })
        })
    }

    function determineScales() {
        const deltaX = xEnd - xStart
        const deltaY = yEnd - yStart
        xScale = deltaX / (n - 1)
        yScale = deltaY / (yMax - yMin)
    }

    function drawYAxisLines() {
        context.strokeStyle = '#33335533'
        context.beginPath()
        let nextValue = nextYAxisValue()
        while (true) {
            let value = nextValue.get()
            let y = yForValue(scaling.transformValue(value))
            context.moveTo(xStart, y)
            context.lineTo(xEnd, y)
            if (y < 0) {
                break
            }
        }
        context.stroke()
    }

    function nextYAxisValue() {
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

    function paintDataSet(set) {
        context.strokeStyle = colorForDataSet(set)
        context.beginPath()
        let pointsConsidered = paintDataSetPath(set)
        if (pointsConsidered > 0) {
            context.stroke()
        }
    }

    function colorForDataSet(set) {
        switch (set.name) {
            case 'inzidenzen':
                return '#99335599'
            case 'hospitalisierung':
                return '#33995599'
            case 'intensiv':
                return '#3333cc99'
            default:
                return "#33335599"
        }
    }

    function paintDataSetPath(set) {
        let pointsConsidered = 0
        for (let index = 0; index < set.points.length; ++index) {
            if (set.points[index] !== null) {
                let x = xStart + index * xScale
                let y = yForValue(set.points[index])
                if (pointsConsidered === 0) {
                    context.moveTo(x, y)
                } else {
                    context.lineTo(x, y)
                }
                ++pointsConsidered
            }
        }
        return pointsConsidered
    }

    function yForValue(value) {
        return yStart + (value - yMin) * yScale
    }

    return {
        run
    }
}
