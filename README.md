# General course assignment

Build a map-based application, which lets the user see geo-based data on a map and filter/search through it in a meaningfull way. Specify the details and build it in your language of choice. The application should have 3 components:

1. Custom-styled background map, ideally built with [mapbox](http://mapbox.com). Hard-core mode: you can also serve the map tiles yourself using [mapnik](http://mapnik.org/) or similar tool.
2. Local server with [PostGIS](http://postgis.net/) and an API layer that exposes data in a [geojson format](http://geojson.org/).
3. The user-facing application (web, android, ios, your choice..) which calls the API and lets the user see and navigate in the map and shows the geodata. You can (and should) use existing components, such as the Mapbox SDK, or [Leaflet](http://leafletjs.com/).

## Example projects

- Showing nearby landmarks as colored circles, each type of landmark has different circle color and the more interesting the landmark is, the bigger the circle. Landmarks are sorted in a sidebar by distance to the user. It is possible to filter only certain landmark types (e.g., castles).

- Showing bicykle roads on a map. The roads are color-coded based on the road difficulty. The user can see various lists which help her choose an appropriate road, e.g. roads that cross a river, roads that are nearby lakes, roads that pass through multiple countries, etc.

## Data sources

- [Open Street Maps](https://www.openstreetmap.org/)

## My project

**Application description**: 
The application shows various points of interest in the city of Amsterdam. 
The user can display the places that are free to visit with I Amsterdam City Card that are located in a specified radius. The pop up of each place will show a photo of the place, its description, how much you will save, its opening hours and the distance from the chosen point.
The user can also filter through various food, drinks and fun categories. Those include typical things Amsterdam is known for, such as traditional haring, FEBO, coffeeshops or even stripbars. The user can also display bicycle rentals, bicycle parkings and bicycle repair stations near the line between the two selected points. 

**Application usage examples**:

Below you can find displayed the screenshots of the application:

![Screenshot1](/screenshots/screenshot1.PNG)

*Free to visit places in the radius of 1,6 km near the selected location.*

![Screenshot2](/screenshots/screenshot2.PNG)

*All places to get haring, pot or have a wild night.*

**Data source**: [I Amsterdam City Card](https://www.iamsterdam.com/en/i-am/i-amsterdam-city-card/what-is-included), OpenStreetMaps, Mapbox

**Technologies used**: PostgreSQL(PostGIS), Node.js, Express, JavaScript, jQuery, Leaflet, MapBox, Bootstrap, [Leaflet.awesome-markers](https://github.com/lvoogdt/Leaflet.awesome-markers)

**Run the project**:
To run the project, clone the project and run the following commands in the main directory:
```
npm install
npm start
```
The application will be available at http://localhost:3000.

## Frontend

Relevant frontend code can be found in  `index.html` and  `map.js`. The client takes care of displaying the basic layout of the application with the sidebar panel and the map. It handles the user events such as changing the radius input or (un)checking the checkboxes with jQuery and sends necessary HTTP POST requests to the server to get GeoJSON data. Then it displays the received data on the Leaflet map.

## Backend

On the server side, Express router is used to define the main routes in  `index.js` file. In this file, the connection to the database is established and all queries are created.

**Routes**:

These HTTP POST routes are available:
- /getCityCard (takes *lat, lang and radius* as the request body parameters)
- /getAmenity (takes *amenity type*)
- /getBikes (takes *startLat, startLng, endLat, engLng, distance*)


## Database

The data was stored in PostgreSQL database along with the PostGIS extension. 
Necessary indices were created for geometry columns to improve the query speed, for example:

```sql
CREATE INDEX point_index ON planet_osm_point USING GIST (way);
```

**Importing data**:
`osm2pgsql` tool's command ``osm2pgsql -m -U postgres -W -H localhost -E 4326 map.osm`` was used to import geographical data of Amsterdam from OpenStreetMaps. 
To import KML data from Google for I Amsterdam City Card places, similar `ogr2ogr`command was used ``ogr2ogr -f "PostgreSQL" PG:"host='yourhost' user='youruser' dbname='yourdb' password='yourpass'" inputfilename.kml``

**Queries**:

To return query results in a GeoJSON format, the queries were written like this:

```sql

SELECT row_to_json(fc) FROM (
	SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features 
	FROM (
		SELECT 'Feature' As type,
		ST_AsGeoJSON(lg.way)::json As geometry,
		row_to_json((name, osm_id)) As properties 
		FROM planet_osm_point As lg 
		WHERE LOWER(name) like '%haring%'
	) As f
) As fc

```
