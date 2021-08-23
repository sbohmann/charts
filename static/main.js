import {GraphPainter} from './graphPainter.js'
import {data, fake} from './data.js'
import {LogarithmicScaling} from './logarithmicScaling.js'
import {LinearScaling} from './linearScaling.js'

const linearScaling = LinearScaling(data, true)
const logarithmicScaling = LogarithmicScaling(data, true)

let logarithmic = true
let currentScaling

function setCurrentScaling() {
    currentScaling = logarithmic ? logarithmicScaling : linearScaling
}

setCurrentScaling()

function initialize() {
    const canvas = document.getElementById('canvas')
    let graphPainter

    function setup() {
        createGraphPainter()
        window.onresize = refreshCanvas
        refreshCanvas()
        connectSettings()
    }

    function createGraphPainter() {
        graphPainter = GraphPainter(canvas, currentScaling.transformedData)
    }

    function refreshCanvas() {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        graphPainter.run()
    }

    function connectSettings() {
        const linearButton = document.getElementById('linear')
        const logarithmicButton = document.getElementById('logarithmic')
        ;(logarithmic ? logarithmicButton : linearButton).checked = true
        linearButton.onclick = () => setLogarithmicScaling(false)
        logarithmicButton.onclick = () => setLogarithmicScaling(true)
    }

    function setLogarithmicScaling(active) {
        logarithmic = active
        setCurrentScaling()
        createGraphPainter()
        refreshCanvas()
    }

    setup()
}

window.onload = initialize
