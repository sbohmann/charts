import { GraphPainter } from './graphPainter.js'
import { data } from './data.js'
import { LogarithmicScaling } from './logarithmicScaling.js'
import { LinearScaling } from './linearScaling.js'

const scaling = LogarithmicScaling(data, 12000)
// const scaling = LinearScaling(data)

function initialize() {
    const canvas = document.getElementById('canvas')
    const graphPainter = GraphPainter(canvas, scaling.transformedData)

    function setup() {
        window.onresize = refreshCanvas
        refreshCanvas()
    }

    function refreshCanvas() {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        graphPainter.run()
    }

    setup()
}

window.onload = initialize
