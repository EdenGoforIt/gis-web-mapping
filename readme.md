# Web Mapping Application

## Introduction

This web mapping application is built using OpenLayers for the front-end, Node.js for the back-end, and PostGIS along with GeoServer for geospatial data management and services. The application follows a three-tiered architecture, ensuring scalability, maintainability, and clear separation of concerns.

## Architecture

The architecture consists of three main layers:

1. **Presentation Layer**: The front-end of the application, built with OpenLayers, which handles user interactions and displays the map interface.
2. **Application Logic Layer**: The back-end service, implemented with Node.js and Express.js, processes requests from the front-end and communicates with the data layer.
3. **Data Layer**: Manages geospatial data with PostGIS as the spatial database and GeoServer for providing geospatial services.

### Diagram

```

[ User (Web Browser) ] 
        |
        v
[ Presentation Layer (Web Client - OpenLayers) ]
        |
        v
[ Application Logic Layer (Backend Service - Node.js, Express.js) ]
            |                                       |
            v                                       v
[ PostGIS (Spatial Database) ] <---- [ GeoServer (Map Services) ]

```


### Workflow

1. **User Interaction**:
   - The user accesses the web mapping application through a web browser.
   - The user interacts with the map interface, performing actions like panning, zooming, and searching for locations.

2. **Request Handling**:
   - The web client, built with OpenLayers, sends an HTTP request to the backend service for geospatial data or map services.

3. **Backend Processing**:
   - The backend service (Node.js and Express.js) receives the request.
   - **Querying PostGIS Directly**: For requests requiring raw spatial data (e.g., coordinates, attributes), the backend directly queries PostGIS.
     - Example query: `SELECT * FROM cities WHERE name = 'Auckland';`
   - **Communicating with GeoServer**: For requests involving map tiles or other OGC services, the backend makes a request to GeoServer.
     - GeoServer accesses PostGIS as a data store to retrieve the necessary spatial data for the requested service.
     - Example request: Requesting a WMS layer from GeoServer.

4. **Data Delivery**:
   - The backend service processes the responses from PostGIS and/or GeoServer.
   - The processed data is sent back to the web client as an HTTP response.

5. **Data Presentation**:
   - The web client receives the data and updates the map interface accordingly.
   - The user sees the requested geospatial information displayed on the map.

## Folder Structure

```
gis-web-mapping/
│
├── models/                          any models 
├── node_modules/                    libraries being used
├── postgis/                         postgis related files
├── .gitignore                       git ignore file
├── .prettierrc                      code format rules
├── city.js                          mock data for cities
├── index.html                       home page
├── main-wms.js                      WMS consuming JavaScript file
├── main.js                          Template for Open Street Map
├── map.js                           Constants for Layers configuration to get the data
├── package-lock.json                package dependencies
├── package.json                     package list and scripts
├── geoserver-postgis.js             postgis GEOJSON data configuration
├── readme.md                        readme file
├── server.js                        express server
├── style.css                        style for the interface
└── vite.config.js                   vite config
```

## Technologies Used

- **OpenLayers**: A JavaScript library for displaying map data in web browsers.
- **Node.js**: A JavaScript runtime used for building the backend service.
- **Express.js**: A web application framework for Node.js, used to create the backend API.
- **PostGIS**: A spatial database extender for PostgreSQL that allows geographic objects to be stored and queried.
- **GeoServer**: An open-source server that allows users to share, process, and edit geospatial data.

## Setup and Installation

### **Install packages**

 ```npm install```

### **Start the Server**

 ```node server.js```

### **Start the web mapping application**
 ```npm run start```
 