import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import './style.css';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()  
    }),
    new TileLayer({
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/activity/wms',  
        params: {
          'LAYERS': 'activity:NZ Springs', 
          'FORMAT': 'image/png', 
          'TRANSPARENT': 'true'  
        },
        serverType: 'geoserver',  
        transition: 0  
      })
    })
  ],
  view: new View({
    center: fromLonLat([174.7633, -36.8485]), 
    zoom: 10  
  })
});
