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
    console.log('slider', this.value)
    label.textContent = this.value
    updateLabelPosition()
})

// Handle the selection event
function handleSelection(suggestion) {
    console.log('Selected:', suggestion)
    // Perform any additional actions needed on selection
}

// Initialize label position on page load
updateLabelPosition()

// Search bar
const searchBar = document.querySelector('.search-bar')
const autocompleteList = document.querySelector('.autocomplete-list')

searchBar.addEventListener('input', async function () {
    const query = this.value
    if (!query) {
        clearAutocompleteList()
        return
    }

    // Simulate an API call with a Promise that resolves with mock data
    const response = await mockApiCall(query)
    const suggestions = await response.json()

    // Clear previous suggestions
    clearAutocompleteList()

    // Display new suggestions
    suggestions.forEach((suggestion) => {
        const item = document.createElement('div')
        item.textContent = suggestion.name
        item.addEventListener('click', function () {
            searchBar.value = suggestion.name
            clearAutocompleteList()
            handleSelection(suggestion) // Handle the selection event
        })
        autocompleteList.appendChild(item)
    })
})

function clearAutocompleteList() {
    autocompleteList.innerHTML = ''
}

// Mock API call function
function mockApiCall(query) {
    const mockData = [
        { id: 1, name: 'Auckland' },
        { id: 2, name: 'Christchurch' },
    ]

    return new Promise((resolve) => {
        const filteredData = mockData.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        )
        resolve({
            json: () => Promise.resolve(filteredData),
        })
    })
}

// Hide suggestions when clicking outside
document.addEventListener('click', function (e) {
    if (e.target !== searchBar) {
        clearAutocompleteList()
    }
})
