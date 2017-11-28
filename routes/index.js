/**
 * Defines the router and the main routes along with the corresponding queries.
 */

var express = require('express');
var router = express.Router();
var pg = require("pg");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// Setup database connection
var username = "postgres"
var password = "brokolica"
var host = "localhost:5432"
var database = "gis"
var conString = "postgres://" + username + ":" + password + "@" + host + "/" + database;
// var conString = "postgres://postgres:brokolica@localhost:5432/gis";

const client = new pg.Client(conString);
client.connect();

/* Get the city card query */
router.post('/citycard', async function (req, res) {
  console.log(req.body);
  console.log("citycard query");
  var response = "";

  var queryCityCard = "SELECT row_to_json(fc) FROM ("
    + "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ("
    + "SELECT 'Feature' As type, ST_AsGeoJSON(lg.wkb_geometry)::json As geometry,"
    + "row_to_json((name, description, "
    + "ST_Distance(ST_SetSRID(ST_Point(" + req.body.lat + ", " + req.body.lng + "), 4326)::geography, ST_SetSRID(ST_Point(ST_Y(lg.wkb_geometry), ST_X(lg.wkb_geometry)), 4326)::geography)"
    + ")) As properties FROM free_entrance As lg "
    + "WHERE ST_DWITHIN(ST_FlipCoordinates(lg.wkb_geometry)::geography,ST_GeomFromText('POINT("
    + req.body.lat + " " + req.body.lng + ")',4326)::geography, " + req.body.radius + ")"
    + ") As f"
    + ") As fc";
  console.log('queryCityCard', queryCityCard);
  var query = client.query(queryCityCard, function (err, result) {
    if (!result) {
      console.log("No rows returned");
      return;
    }
    var geoJSON = result.rows[0].row_to_json;
    console.log(geoJSON);
    res.json(geoJSON);
  })
});


/* Get amenity*/
router.post('/amenity', async function (req, res) {
  console.log(req.body);
  console.log("amenity query");
  var response = "";
  var queryAmenity = "SELECT row_to_json(fc) FROM ("
    + "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ("
    + "SELECT 'Feature' As type, ST_AsGeoJSON(lg.way)::json As geometry,"
    + "row_to_json((name, amenity)) As properties FROM planet_osm_point As lg "
    + req.body.filter
    + ") As f"
    + ") As fc";

  console.log('queryAmenity', queryAmenity);
  var query = client.query(queryAmenity, function (err, result) {
    if (!result) {
      console.log("No rows returned");
      return;
    }
    var geoJSON = result.rows[0].row_to_json;
    console.log(geoJSON);
    res.json(geoJSON);
  })
});


/* Get amenities related to bikes close to the line between two points*/
router.post('/bikes', async function (req, res) {
  console.log(req.body);
  console.log("bikes query");
  var response = "";
  var queryBikes = "SELECT row_to_json(fc) FROM ("
    + "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ("
    + "SELECT 'Feature' As type, ST_AsGeoJSON(lg.way)::json As geometry,"
    + "row_to_json((name, amenity, "
    + "ST_DISTANCE(ST_GeomFromText('LINESTRING(" + req.body.startLat + " " + req.body.startLng + ", " + req.body.endLat + " " + req.body.endLng + ")', 4326)::geography, ST_FlipCoordinates(lg.way)::geography)))"
    + " As properties FROM planet_osm_point As lg "
    + "WHERE (amenity = 'bicycle_rental' or amenity = 'bicycle_parking' or amenity = 'bicycle_repair_station') "
    + "AND ST_DISTANCE(ST_GeomFromText('LINESTRING(" + req.body.startLat + " " + req.body.startLng + ", " + req.body.endLat + " " + req.body.endLng + ")', 4326)::geography, ST_FlipCoordinates(lg.way)::geography) < " + req.body.distance
    + ") As f"
    + ") As fc";

  console.log('queryBikes', queryBikes);
  var query = client.query(queryBikes, function (err, result) {
    if (!result) {
      console.log("No rows returned");
      return;
    }
    var geoJSON = result.rows[0].row_to_json;
    console.log(geoJSON);
    res.json(geoJSON);
  })
});