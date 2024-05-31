export const requests = {
    cities: 'http://localhost:8080/geoserver/urban-develop/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urban-develop%3Acities&maxFeatures=50&outputFormat=application%2Fjson',
    suburbs:
        'http://localhost:8080/geoserver/urban-develop/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=urban-develop%3Asuburbs&maxFeatures=50&outputFormat=application%2Fjson',
}
