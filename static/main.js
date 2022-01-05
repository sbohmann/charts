import {GraphPainter} from './graphPainter.js'
import {data, fake} from './data.js'
import {LogarithmicScaling} from './logarithmicScaling.js'
import {LinearScaling} from './linearScaling.js'
import {DecimalYAxisValues, BinaryYAxisValues} from './YAxisValues.js'
import {buildPaddedData} from './dataPadding.js'

const USE_FAKE_DATA = false

let paddedData
let linearScaling
let logarithmicScaling

let logarithmic
let binary
let dataset
let scaling
let yAxisValues
let pageLocation

let shareLink = document.getElementById("shareLink")

let datasetNames = [
    'oesterreichGesamt',
    'oesterreich',
    'wien',
    'niederoesterreich',
    'oberoesterreich',
    'burgenland',
    'steiermark',
    'kaernten',
    'salzburg',
    'tirol',
    'vorarlberg']

function setCurrentConfiguration() {
    paddedData = buildPaddedData(USE_FAKE_DATA ? fake : data[dataset])
    linearScaling = LinearScaling(paddedData.values, true)
    logarithmicScaling = LogarithmicScaling(paddedData.values, true)
    scaling = logarithmic ? logarithmicScaling : linearScaling
    yAxisValues = binary ? BinaryYAxisValues : DecimalYAxisValues
    pageLocation = window.location.pathname +
        '?dataset=' + dataset +
        '&scaling=' + (logarithmic ? 'logarithmic' : 'linear') +
        '&y=' + (binary ? 'binary' : 'decimal')
    shareLink.href = pageLocation
}

function parseQuery() {
    let params = new URLSearchParams(window.location.search)

    let datasetName = params.get('dataset')
    if (datasetName != null && datasetNames.includes(datasetName)) {
        dataset = datasetName
    } else {
        dataset = 'oesterreichGesamt'
    }

    let scalingName = params.get('scaling')
    logarithmic = (scalingName !== 'linear')

    let yName = params.get('y')
    binary = (yName !== 'decimal')
}

parseQuery()
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
        connectDatasetSettings()
    }

    function createGraphPainter() {
        graphPainter = GraphPainter(canvas, scaling, yAxisValues, paddedData.minimumDate)
    }

    function connectScalingSettings() {
        const linearButton = document.getElementById('linear')
        const logarithmicButton = document.getElementById('logarithmic')
        const activeButton = logarithmic ? logarithmicButton : linearButton
        activeButton.checked = true
        linearButton.onclick = () => setLogarithmicScaling(false)
        logarithmicButton.onclick = () => setLogarithmicScaling(true)
    }

    function setLogarithmicScaling(active) {
        logarithmic = active
        setCurrentConfiguration()
        createGraphPainter()
        applyChanges()
    }

    function connectYAxisSettings() {
        const decimalButton = document.getElementById('decimal')
        const binaryButton = document.getElementById('binary')
        const activeButton = binary ? binaryButton : decimalButton
        activeButton.checked = true
        decimalButton.onclick = () => setYAxisValues(false)
        binaryButton.onclick = () => setYAxisValues(true)
    }

    function setYAxisValues(newBinary) {
        binary = newBinary
        setCurrentConfiguration()
        createGraphPainter()
        applyChanges()
    }

    function connectDatasetSettings() {
        for (let datasetName of datasetNames) {
            let button = document.getElementById(datasetName)
            if (datasetName === dataset) {
                button.checked = true
            }
            button.onclick = () => {
                setDataset(datasetName)
            }
        }
    }

    function setDataset(datasetName) {
        dataset = datasetName
        setCurrentConfiguration()
        createGraphPainter()
        applyChanges()
    }

    function applyChanges() {
        if (window.location.toString() !== pageLocation) {
            window.history.pushState("", "", pageLocation)
        }
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
