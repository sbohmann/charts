import {GraphPainter} from './graphPainter.js'
import {data, fake} from './data.js'
import {LogarithmicScaling} from './logarithmicScaling.js'
import {LinearScaling} from './linearScaling.js'
import {DecimalYAxisValues, BinaryYAxisValues} from './YAxisValues.js'
import {buildPaddedData} from './dataPadding.js'

const USE_FAKE_DATA = false

const paddedData = buildPaddedData(USE_FAKE_DATA ? fake : data)

const linearScaling = LinearScaling(paddedData.values, true)
const logarithmicScaling = LogarithmicScaling(paddedData.values, true)

let logarithmic = true
let binary = true
let scaling
let yAxisValues

function setCurrentConfiguration() {
    scaling = logarithmic ? logarithmicScaling : linearScaling
    yAxisValues = binary ? BinaryYAxisValues : DecimalYAxisValues
}

setCurrentConfiguration()

function initialize() {
    const canvas = document.getElementById('canvas')
    let graphPainter

    function setup() {
        createGraphPainter()
        window.onresize = refreshCanvas
        refreshCanvas()
        connectScalingSettings()
        connectYAxisSettings()
    }

    function createGraphPainter() {
        graphPainter = GraphPainter(canvas, scaling, yAxisValues, paddedData.minimumDate)
    }

    function refreshCanvas() {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        graphPainter.run()
    }

    function connectScalingSettings() {
        const linearButton = document.getElementById('linear')
        const logarithmicButton = document.getElementById('logarithmic')
        const activeButton = logarithmic ? logarithmicButton : linearButton
        activeButton.checked = true
        linearButton.onclick = () => setLogarithmicScaling(false)
        logarithmicButton.onclick = () => setLogarithmicScaling(true)
    }

    function connectYAxisSettings() {
        const decimalButton = document.getElementById('decimal')
        const binaryButton = document.getElementById('binary')
        const activeButton = binary ? binaryButton : decimalButton
        activeButton.checked = true
        decimalButton.onclick = () => setYAxisValues(false)
        binaryButton.onclick = () => setYAxisValues(true)
    }

    function setLogarithmicScaling(active) {
        logarithmic = active
        setCurrentConfiguration()
        createGraphPainter()
        refreshCanvas()
    }

    function setYAxisValues(newBinary) {
        binary = newBinary
        setCurrentConfiguration()
        createGraphPainter()
        refreshCanvas()
    }

    setup()
}

window.onload = initialize
