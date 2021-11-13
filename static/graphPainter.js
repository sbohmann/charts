export function GraphPainter(canvas, scaling, yAxisValues, minimumDate) {
    const context = canvas.getContext('2d')
    const data = scaling.transformedData

    let xStart, xEnd, yStart, yEnd
    let n, yMin, yMax
    let xScale, yScale

    function run() {
        setDrawingBounds()
        determineDataBounds()
        determineScales()
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = "#ffeedd"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.lineWidth = 5
        drawYAxisLines()
        drawDates()
        data.forEach(paintDataSet)
    }

    function setDrawingBounds() {
        xStart = 100
        xEnd = canvas.width - 15
        yStart = canvas.height - 55
        yEnd = 25
    }

    function determineDataBounds() {
        data.forEach(set => {
            if (!n || set.points.length > n) {
                n = set.points.length
            }
            set.points.forEach(point => {
                if (point !== null && (yMin === undefined || point < yMin)) {
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
        context.fillStyle = '#55555599'
        let values = yAxisValues()
        let lastY
        while (true) {
            let value = values.get()
            let y = yForValue(scaling.transformValue(value))
            if (lastY === undefined || y <= lastY - 25) {
                context.beginPath()
                context.moveTo(xStart, y)
                context.lineTo(xEnd, y)
                if (y < 15) {
                    break
                }
                lastY = y
                context.stroke()
                context.font = '25px sans-serif';
                context.textAlign = 'end'
                context.fillStyle = '#666666'
                context.fillText(value, xStart - 5, y + 5);
            }
        }
    }

    function drawDates() {
        let date = minimumDate
        let lastDate = minimumDate
        let lastX = xStart
        let first = true
        while (true) {
            let x = xStart + xScale * JSJoda.ChronoUnit.DAYS.between(lastDate, date)
            if (x > xEnd) {
                break
            }
            if ((first || x > lastX + 200) && x < xEnd - 100) {
                context.strokeStyle = '#33333333'
                context.beginPath()
                context.moveTo(x, yEnd)
                context.lineTo(x, yStart + 20)
                context.stroke()
                context.font = '25px sans-serif';
                context.textAlign = 'start'
                context.fillStyle = '#666666'
                context.fillText(date.toString(), x, yStart + 42);
                lastX = x
            } else {
                context.strokeStyle = '#33333311'
                context.beginPath()
                context.moveTo(x, yEnd)
                context.lineTo(x, yStart)
                context.stroke()
            }
            date = date.plusMonths(1)
            first = false
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
