const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const wellknown = require('wellknown');

const app = express();
const port = 3000; 

// Use CORS to allow requests from your frontend
app.use(cors());

// PostgreSQL connection pool
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'nz',
    password: 'admin',
    port: 5432, // Default PostgreSQL port
});
const convertWktToGeoJSON = (wkt) => {
    return wellknown.parse(wkt);
};
// Endpoint to get cities from PostGIS
app.get('/api/cities', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, population, ST_AsText(coordinate) AS coordinate FROM cities');
       
        const cities= result.rows.map(row=>{
            return {
                id: row.id,
                name: row.name,
                coordinate: convertWktToGeoJSON(row.coordinate)
            }  
        });

        res.json(cities);

    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Endpoint to get cities from PostGIS
app.get('/api/suburbs', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, city_id, name, population,ST_AsText(coordinate) AS coordinate FROM suburbs');
        const suburbs= result.rows.map(row=>{
            return {
                id: row.id,
                name: row.name,
                city_id: row.city_id,
                coordinate: convertWktToGeoJSON(row.coordinate)
            }  
        });

        res.json(suburbs);
    } catch (error) {
        console.error('Error fetching suburbs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
