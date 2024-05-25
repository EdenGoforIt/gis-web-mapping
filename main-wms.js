import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat } from 'ol/proj'
import OSM from 'ol/source/OSM'
import TileWMS from 'ol/source/TileWMS'
import { WMSLayerConfigs } from './map.js'
import './style.css'

const message = ''

// Create the initial OpenLayers map
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    view: new View({
        center: fromLonLat([174.7633, -39.8485]),
        zoom: 6,
    }),
})

// Get the slider element
const messageElement = document.getElementById('message')
const slider = document.getElementById('year-range')

function createLabels() {
    const min = parseInt(slider.min, 10)
    const max = parseInt(slider.max, 10)
    for (let i = min; i <= max; i += 2) {
        const label = document.createElement('div')
        label.className = 'slider-label'
        label.textContent = i
        label.addEventListener('click', (event) => {
            console.log('Label clicked:', event.target.value)
            moveSliderToYear(event, i)
        })
        document.body.appendChild(label)
        positionLabel(label, i)
    }
    updateActiveLabel()
}

function positionLabel(label, value) {
    const rect = slider.getBoundingClientRect()
    const relativeValue = (value - slider.min) / (slider.max - slider.min)
    const percent = relativeValue * 100
    label.style.left = `calc(${
        rect.left + window.scrollX + (percent / 100) * rect.width
    }px)`
    label.style.top = `${rect.top + window.scrollY - 50}px`
}

function moveSliderToYear(event, year) {
    event.preventDefault()
    slider.value = year
    const inputEvent = new Event('input')
    slider.dispatchEvent(inputEvent)
}

function updateActiveLabel() {
    const labels = document.querySelectorAll('.slider-label')
    labels.forEach((label) => {
        if (parseInt(label.textContent, 10) === parseInt(slider.value, 10)) {
            label.classList.add('active')
        } else {
            label.classList.remove('active')
        }
    })
}

function updateLabelsPosition() {
    console.log('update label positions')
    const labels = document.querySelectorAll('.slider-label')
    labels.forEach((label) => {
        const value = parseInt(label.textContent, 10)
        positionLabel(label, value)
    })
}

// Debounce function to limit the number of updateWMSLayer calls
function debounce(func, wait) {
    let timeout
    return function (...args) {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(context, args), wait)
    }
}

// Update WMS layer function
const debouncedUpdateWMSLayer = debounce((year) => {
    updateWMSLayer(year)
}, 300) // 300ms debounce time

slider.addEventListener('input', (event) => {
    console.log('Slider input event:', event.target.value)
    debouncedUpdateWMSLayer(event.target.value)
    updateActiveLabel()
    updateLabelsPosition()
})

window.addEventListener('resize', updateLabelsPosition)

// Initialize labels on page load
createLabels()
updateLabelsPosition() // Ensure initial positioning

updateWMSLayer(2018)

function updateWMSLayer(year) {
    const config = getWMSLayerConfig(year)
    console.log('WMS Layer Config:', config)
    if (config) {
        const wmsLayer = new TileLayer({
            source: new TileWMS({
                url: config.url,
                params: config.params,
                serverType: config.serverType,
                transition: config.transition,
            }),
        })

        // Remove the existing WMS layer if any
        removeLayers()

        // Add the new WMS layer
        console.log('Adding new WMS layer:', wmsLayer)
        map.addLayer(wmsLayer)

        // Hide the message
        messageElement.style.display = 'none'
    } else {
        removeLayers()
        // Show the message if the config is not found
        messageElement.textContent =
            'Data is not ready yet, we are trying hard to provide it soon...'
        messageElement.style.display = 'block'
    }
}

function removeLayers() {
    // Remove the existing WMS layer if any
    map.getLayers()
        .getArray()
        .forEach((layer) => {
            if (
                layer instanceof TileLayer &&
                layer.getSource() instanceof TileWMS
            ) {
                console.log('Removing layer:', layer)
                map.removeLayer(layer)
            }
        })
}

function getWMSLayerConfig(year) {
    return WMSLayerConfigs[year]
}
