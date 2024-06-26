import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat } from 'ol/proj'
import OSM from 'ol/source/OSM'
import './style.css'
import { WMSLayerConfigs } from './map.js'
//  Vector layer
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    view: new View({
        center: fromLonLat([174.7633, -36.8485]),
        zoom: 6,
    }),
})

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
            moveSliderToYear(i)
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

function moveSliderToYear(year) {
    slider.value = year
    const event = new Event('input')
    slider.dispatchEvent(event)
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
    const labels = document.querySelectorAll('.slider-label')
    labels.forEach((label) => {
        const value = parseInt(label.textContent, 10)
        positionLabel(label, value)
    })
}

slider.addEventListener('input', (event) => {
    console.log('Slider input event:', event.target.value)
    updateActiveLabel()
    updateLabelsPosition()
})

window.addEventListener('resize', updateLabelsPosition)

// Initialize labels on page load
createLabels()
updateLabelsPosition() // Ensure initial positioning

function updateWMSLayer(year) {
    const config = getWMSLayerConfig(year)
    if (config) {
        const wmsLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: config.url,
                params: config.params,
                serverType: config.serverType,
                transition: config.transition,
            }),
        })

        // Remove the existing WMS layer if any
        map.getLayers()
            .getArray()
            .forEach((layer) => {
                if (
                    layer instanceof ol.layer.Tile &&
                    layer.getSource() instanceof ol.source.TileWMS
                ) {
                    map.removeLayer(layer)
                }
            })

        // Add the new WMS layer
        map.addLayer(wmsLayer)
    }
}

function getWMSLayerConfig(year) {
    return WMSLayerConfigs[year]
}

updateWMSLayer(2018)
