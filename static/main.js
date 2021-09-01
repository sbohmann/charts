import {GraphPainter} from './graphPainter.js'
import {data, fake} from './data.js'
import {LogarithmicScaling} from './logarithmicScaling.js'
import {LinearScaling} from './linearScaling.js'
import {buildPaddedData} from './dataPadding.js'

const USE_FAKE_DATA = true

const paddedData = buildPaddedData(USE_FAKE_DATA ? fake : data)

const linearScaling = LinearScaling(paddedData, true)
const logarithmicScaling = LogarithmicScaling(paddedData, true)

let logarithmic = true
let scaling

function setCurrentScaling() {
    scaling = logarithmic ? logarithmicScaling : linearScaling
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
        graphPainter = GraphPainter(canvas, scaling.transformedData)
    }

    function refreshCanvas() {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        graphPainter.run()
    }

    function connectSettings() {
        const linearButton = document.getElementById('linear')
        const logarithmicButton = document.getElementById('logarithmic')
        const activeButton = logarithmic ? logarithmicButton : linearButton
        activeButton.checked = true
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
