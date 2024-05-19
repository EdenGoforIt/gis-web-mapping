import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat } from 'ol/proj'
import OSM from 'ol/source/OSM'
import './style.css'
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

// Create a floating label element
const label = document.createElement('div')
label.className = 'slider-label'
label.textContent = slider.value
document.body.appendChild(label)

function updateLabelPosition() {
    const rect = slider.getBoundingClientRect()
    const value = (slider.value - slider.min) / (slider.max - slider.min)
    const percent = value * 100
    label.style.left = `calc(${
        rect.left + window.scrollX + (percent / 100) * rect.width
    }px)`
    label.style.top = `${rect.top + window.scrollY - 50}px`
}

slider.addEventListener('input', function () {
    label.textContent = this.value
    updateLabelPosition()
})

// Initialize label position on page load
updateLabelPosition()
