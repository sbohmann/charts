export function GraphPainter(canvas, data) {
    const context = canvas.getContext('2d')

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
        context.strokeStyle = "#33335599"
        context.lineWidth = 5
        data.forEach(paintDataSet)
    }

    function determineDrawingBounds() {
        xStart = 15
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
                if (point !== null && (!yMin || point < yMin)) {
                    yMin = point
                }
                if (point !== null && (!yMax || point > yMax)) {
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

    function paintDataSet(set) {
        context.beginPath()
        let pointsConsidered = paintDataSetPath(set)
        if (pointsConsidered > 0) {
            context.stroke()
        }
    }

    function paintDataSetPath(set) {
        let pointsConsidered = 0
        for (let index = 0; index < set.points.length; ++index) {
            if (set.points[index] !== null) {
                let x = xStart + index * xScale
                let y = yStart + (set.points[index] - yMin) * yScale
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

    return {
        run
    }
}
