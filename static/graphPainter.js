export function GraphPainter(canvas, data) {
    const context = canvas.getContext('2d')

    let xStart, xEnd, yStart, yEnd
    let n, yMin, yMax
    let xScale, yScale

    function run() {
        determineDrawingBounds()
        determineDataBounds()
        determineScales()
        context.clearRect(0, 0, canvas.width, canvas.height);
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
                n= set.points.length
            }
            set.points.forEach(point => {
                if (!yMin || point < yMin) {
                    yMin = point
                }
                if (!yMax || point > yMax) {
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
        let index = 0
        while (index < set.points.length) {
            let x = xStart + index * xScale
            let y = yStart + (set.points[index] - yMin) * yScale
            if (index === 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
            ++index
        }
        if (index > 1) {
            context.stroke()
        }
    }

    return {
        run
    }
}
