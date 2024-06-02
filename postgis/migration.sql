
-- Create extension for PostGIS
CREATE EXTENSION postgis;

-- Create Cities Table
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    coordinate GEOMETRY(POINT, 4326),
    population INTEGER
);

-- Create Suburbs Table
CREATE TABLE suburbs (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    name VARCHAR(100),
    coordinate GEOMETRY(POINT, 4326),
    population INTEGER
);

-- Insert Data into Cities Table
INSERT INTO cities (name, coordinate, population) VALUES
('Auckland', ST_GeomFromText('POINT(174.7633 -36.8485)', 4326), 1657000),
('Wellington', ST_GeomFromText('POINT(174.7772 -41.2889)', 4326), 215100),
('Christchurch', ST_GeomFromText('POINT(172.6306 -43.5321)', 4326), 381500),
('Hamilton', ST_GeomFromText('POINT(175.2528 -37.7870)', 4326), 176500),
('Tauranga', ST_GeomFromText('POINT(176.1674 -37.6878)', 4326), 136600),
('Dunedin', ST_GeomFromText('POINT(170.5036 -45.8788)', 4326), 118500),
('Palmerston North', ST_GeomFromText('POINT(175.6111 -40.3523)', 4326), 88000),
('Napier', ST_GeomFromText('POINT(176.9187 -39.4928)', 4326), 66000);

-- Insert Data into Suburbs Table
INSERT INTO suburbs (city_id, name, coordinate, population) VALUES
(1, 'Ponsonby', ST_GeomFromText('POINT(174.7477 -36.8560)', 4326), 7300),
(1, 'Mount Eden', ST_GeomFromText('POINT(174.7636 -36.8799)', 4326), 20000),
(1, 'Newmarket', ST_GeomFromText('POINT(174.7790 -36.8707)', 4326), 14000),
(2, 'Te Aro', ST_GeomFromText('POINT(174.7684 -41.2937)', 4326), 7200),
(2, 'Kelburn', ST_GeomFromText('POINT(174.7643 -41.2830)', 4326), 7500),
(2, 'Miramar', ST_GeomFromText('POINT(174.8267 -41.3215)', 4326), 8600),
(3, 'Riccarton', ST_GeomFromText('POINT(172.6110 -43.5329)', 4326), 12000),
(3, 'Addington', ST_GeomFromText('POINT(172.6125 -43.5396)', 4326), 7000),
(3, 'Cashmere', ST_GeomFromText('POINT(172.6381 -43.5703)', 4326), 5500),
(4, 'Chartwell', ST_GeomFromText('POINT(175.2773 -37.7445)', 4326), 7000),
(4, 'Rototuna', ST_GeomFromText('POINT(175.2825 -37.7221)', 4326), 8000),
(4, 'Hamilton East', ST_GeomFromText('POINT(175.2927 -37.7901)', 4326), 9500),
(5, 'Papamoa', ST_GeomFromText('POINT(176.2912 -37.7159)', 4326), 20000),
(5, 'Mount Maunganui', ST_GeomFromText('POINT(176.1714 -37.6392)', 4326), 19000),
(5, 'Bethlehem', ST_GeomFromText('POINT(176.1165 -37.6984)', 4326), 9500),
(6, 'North East Valley', ST_GeomFromText('POINT(170.5256 -45.8574)', 4326), 7500),
(6, 'St Clair', ST_GeomFromText('POINT(170.4906 -45.9140)', 4326), 6500),
(6, 'Roslyn', ST_GeomFromText('POINT(170.5068 -45.8734)', 4326), 5700),
(7, 'Hokowhitu', ST_GeomFromText('POINT(175.6331 -40.3739)', 4326), 9000),
(7, 'Terrace End', ST_GeomFromText('POINT(175.6364 -40.3402)', 4326), 8000),
(7, 'Milson', ST_GeomFromText('POINT(175.6100 -40.3200)', 4326), 5500),
(8, 'Tamatea', ST_GeomFromText('POINT(176.8650 -39.5017)', 4326), 6000),
(8, 'Marewa', ST_GeomFromText('POINT(176.8905 -39.4851)', 4326), 5000),
(8, 'Napier South', ST_GeomFromText('POINT(176.9163 -39.5008)', 4326), 5500);
