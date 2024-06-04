import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay.js'

import TileWMS from 'ol/source/TileWMS'
import { WMSLayerConfigs } from './map.js'
import './style.css'
import { cities } from './city.js'
import { toStringHDMS } from 'ol/coordinate.js'
import { requests } from './goeserver-postgis.js'
import { fromLonLat, toLonLat } from 'ol/proj.js'

var centerCoordinates = []
var suggestions = []
var marker

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

// Popup showing the position the user clicked
const popup = new Overlay({
    element: document.getElementById('popup'),
})
map.addOverlay(popup)
const popupElement = popup.getElement()
let popover = bootstrap.Popover.getInstance(popupElement)

const pin = new Overlay({
    position: fromLonLat([174.7633, -36.8485]), // Marker position (Auckland)
    positioning: 'center-center',
    element: document.getElementById('pin'),
    stopEvent: false,
})
map.addOverlay(pin)

// Get the slider element
const messageElement = document.getElementById('message')
const slider = document.getElementById('year-range')

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

const { searchBar, autocompleteList } = searchbarFunction()

fetchCities()
fetchSuburbs()
AddToggleListener()
AddMapClickEvent()
removeIfPinExists()

document.addEventListener('click', (event) => {
    if (event.target !== searchBar) {
        autocompleteList.innerHTML = ''
    }
})

function createLabels() {
    const min = parseInt(slider.min, 10)
    const max = parseInt(slider.max, 10)
    for (let i = min; i <= max; i += 1) {
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
        // resetMap();

        // Hide the message
        messageElement.style.display = 'none'
    } else {
        removeLayers()
        // resetMap();

        // Show the message if the config is not found
        messageElement.textContent =
            'Data is not ready yet, we are trying hard to provide it soon...'
        messageElement.style.display = 'block'
    }
}

function resetMap() {
    map.getView().setZoom(6)
    map.getView().setCenter(fromLonLat([174.7633, -39.8485]))
}

function removeLayers() {
    if (popover) {
        popover.hide()
    }
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

function searchbarFunction() {
    const searchBar = document.querySelector('.search-bar')
    const autocompleteList = document.querySelector('.autocomplete-list')

    searchBar.addEventListener('input', () => {
        const input = searchBar.value.toLowerCase()
        autocompleteList.innerHTML = ''

        if (!input) {
            return false
        }

        const filteredSuggestions = suggestions.filter((suggestion) =>
            suggestion.toLowerCase().includes(input.toLowerCase())
        )
        filteredSuggestions.forEach((suggestion) => {
            const item = document.createElement('div')
            item.classList.add('autocomplete-item')
            item.textContent = suggestion

            item.addEventListener('click', () => {
                console.log('search text clicked', suggestion)
                searchBar.value = suggestion
                autocompleteList.innerHTML = ''

                const foundCenterCoordinate = centerCoordinates.find(
                    (x) => x.name == suggestion
                )
                if (foundCenterCoordinate) {
                    const [lon, lat] =
                        foundCenterCoordinate.coordinate.coordinates
                    console.log('found center coordinate', lon, lat)

                    const transformedCoordinate = fromLonLat([lon, lat])
                    map.getView().setCenter(transformedCoordinate)
                    map.getView().setZoom(10)

                    addMarker([lon, lat])
                    if (popover) {
                        popover.hide()
                    }
                }
            })

            autocompleteList.appendChild(item)
        })
    })
    return { searchBar, autocompleteList }
}

function AddToggleListener() {
    const toggleBtn = document.querySelector('.toggle-btn')
    const box = document.getElementById('box')

    toggleBtn.addEventListener('click', function () {
        if (box.style.display === 'none' || box.style.display === '') {
            box.style.display = 'block'
            toggleBtn.textContent = 'Close History'
        } else {
            box.style.display = 'none'
            toggleBtn.textContent = 'Open History'
        }
    })
}

function AddMapClickEvent() {
    map.on('click', function (evt) {
        const coordinate = evt.coordinate
        const hdms = toStringHDMS(toLonLat(coordinate))
        popup.setPosition(coordinate)
        if (popover) {
            popover.dispose()
        }
        let content = ''
        content += '<div>'
        content +=
            '<p>The location you clicked was:</p><code>' + hdms + '</code>'
        content += '<hr>'
        content +=
            '<p><b>Source:</b> Ministry for the Environment (MfE), Manaaki Whenua – Landcare Research. The data can be accessed via the MfE Data Service website <a href="https://data.mfe.govt.nz/layer/117733-lucas-nz-land-use-map-2020-v003/" target="_blank">https://data.mfe.govt.nz/layer/117733-lucas-nz-land-use-map-2020-v003/</a>.</p>'
        content += '<p><b>Metadata:</b></p>'
        content +=
            '<p><b>File Identifier:</b> 9696D6AA-75A5-41B6-80C4-978101C8E619</p>'
        content +=
            '<p><b>Standard Name:</b> ANZLIC Metadata Profile: An Australian/New Zealand Profile of AS/NZS ISO 19115:2005, Geographic Information - Metadata</p>'
        content += '<p><b>Date Stamp:</b> 2024-04-29</p>'
        content += '<p><b>Resource Title:</b> LUM 2020 v003 NZ</p>'
        content += '<p><b>Dataset Languages:</b> English (UTF-8)</p>'
        content +=
            '<p><b>Reference System:</b> NZGD2000 / New Zealand Transverse Mercator 2000 (2193)</p>'
        content += '</div>'
        content += '<hr>'
        content += '<div>'
        content +=
            '<p><b>Source:</b> Stats NZ – Tatauranga Aotearoa. The dataset can be accessed via the Stats NZ Data Service website <a href="https://datafinder.stats.govt.nz/layer/111196-urban-rural-2023-clipped-generalised/" target="_blank">https://datafinder.stats.govt.nz/layer/111196-urban-rural-2023-clipped-generalised/</a>.</p>'
        content +=
            '<p><b>Metadata Standard Name:</b> ISO 19139 Geographic Information - Metadata - Implementation Specification</p>'
        content += '<p><b>Date Stamp:</b> 2022-12-01</p>'
        content += '<p><b>Dataset Languages:</b> English (UTF-8)</p>'
        content +=
            '<p><b>Reference System:</b> NZGD2000 / New Zealand Transverse Mercator 2000 (2193)</p>'
        content +=
            '<p><b>Use Constraints:</b> Creative Commons Attribution 4.0 International (CC BY 4.0)</p>'
        content += '</div>'
        content += '<hr>'
        content += '<div>'

        content += '</div>'

        popover = new bootstrap.Popover(popupElement, {
            animation: false,
            container: popupElement,
            content: content,
            html: true,
            placement: 'top',
            title: 'Description',
        })
        popover.show()
    })
}

function removeIfPinExists() {
    const pinElement = document.getElementById('pin')

    if (pinElement) {
        pinElement.style.display = 'none'
    }
}

function addMarker(coordinates) {
    const pinElement = document.getElementById('pin')
    if (!marker) {
        pinElement.style.display = 'block'

        marker = new Overlay({
            position: fromLonLat(coordinates),
            positioning: 'center-center',
            element: pinElement,
            stopEvent: false,
        })
        map.addOverlay(marker)
    } else {
        marker.setPosition(fromLonLat(coordinates))
    }
}

async function fetchCities() {
    $.ajax({
        url: 'http://localhost:3000/api/cities',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const names = data.map((x) => x.name).filter(Boolean)
            suggestions = suggestions.concat(names)
            centerCoordinates = centerCoordinates.concat(data)
        },
        error: function (error) {
            console.error('Error fetching cities data:', error)
        },
    })
}

async function fetchSuburbs() {
    $.ajax({
        url: 'http://localhost:3000/api/suburbs',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const names = data.map((x) => x.name).filter(Boolean)
            suggestions = suggestions.concat(names)
            centerCoordinates = centerCoordinates.concat(data)
        },
        error: function (error) {
            console.error('Error fetching suburbs data:', error)
        },
    })
}
