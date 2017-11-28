// Create variable to hold map element, give initial settings to map
var map = L.map('map', { center: [52.3711, 4.9015], zoom: 15 });

// Add MapBox tile layer to map element
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
function initialiseMap() {
    var mapboxToken = 'https://api.mapbox.com/styles/v1/bowltie/cjahygh0e9ebd2so13iy889cc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYm93bHRpZSIsImEiOiJjamFoOTFyeWMya3AyMzNwOGFnNGhwMmZiIn0.TH1x7IRV8yLpP22E7UEs8A';
    L.tileLayer(mapboxToken, { attribution: '© OpenStreetMap, MapBox' }).addTo(map);
    // Show the scale bar
    L.control.scale().addTo(map);
}

initialiseMap();

var markersLG = new L.LayerGroup();
var startEndLG = new L.LayerGroup();
//var circlesLG = new L.LayerGroup();

var centrePoint = null;
var startMarker = null;
var endMarker = null;
//var radiusCircle = null;

createCentrePoint();

function getRadius() {
    console.log('calculating radius');
    var distance = $("#radius").val() * 1000;
    console.log('radius', distance);
    return distance;
}

console.log('centre point', centrePoint);

function createCentrePoint() {
    // Create point feature for the point in the centre of the map
    console.log('new centre point');
    centrePoint = L.marker([52.36981, 4.89601], { draggable: true }); //.addTo(map);
    centrePoint.on('dragend', async (e) => {
        // var body = query1(centrePoint.getLatLng());
        // console.log(body);
        console.log('centre point dragend');
        // radiusCircle.setLatLng(e.target.getLatLng());
        // radiusCircle.setRadius(getRadius());

        await getCityCardPlaces(e.target.getLatLng().lat, e.target.getLatLng().lng, getRadius());
    });
    // radiusCircle = L.circle([52.3701, 4.9052], getRadius(), { color: '#BDBDBD' }).addTo(map);
    addMarkers(centrePoint);
    //addCircle(radiusCircle);
}

function createRouteMarkers() {
    // Create draggable start and end points
    console.log('new route markers');
    startMarker = L.marker([52.37418440434255, 4.899473190307618], { draggable: true }); //.addTo(map);
    // centrePoint.on('dragend', async (e) => {
    //     console.log('centre point dragend');
    //     await getCityCardPlaces(e.target.getLatLng().lat, e.target.getLatLng().lng, getRadius());
    // });
    // radiusCircle = L.circle([52.3701, 4.9052], getRadius(), { color: '#BDBDBD' }).addTo(map);
    endMarker = L.marker([52.36821042155847, 4.89393711090088], { draggable: true }); 
    
    console.log('cleared start end points');
    startEndLG.clearLayers();
    console.log('added start end points');
    startEndLG.addLayer(startMarker);
    startEndLG.addLayer(endMarker);
    startEndLG.addTo(map);
    console.log('startEndLG', startEndLG);
}

// Creates a red marker with a heart icon
var cityCardMarker = L.AwesomeMarkers.icon({
    icon: 'glyphicon glyphicon-heart',
    //icon: 'heart-o',
    markerColor: 'red'
});

// Marker for stripclubs, nightclubs and brothels
var stripclubMarker = L.AwesomeMarkers.icon({
    icon: 'glyphicon glyphicon-heart-empty',
    markerColor: 'red'
});

// Marker for cinema
var cinemaMarker = L.AwesomeMarkers.icon({
    icon: 'glyphicon glyphicon-film',
    markerColor: 'black'
});

// Marker for FEBO
var feboMarker = L.AwesomeMarkers.icon({
    // icon: 'fa-icon-fast-food',
    // icon: 'fa-cutlery',
    icon: 'glyphicon glyphicon-king',
    markerColor: 'purple'
});

// Marker for haring
var haringMarker = L.AwesomeMarkers.icon({
    // icon: 'icon-fishes',
    icon: 'glyphicon glyphicon-header',
    markerColor: 'blue'
});

// Marker for bars
var barMarker = L.AwesomeMarkers.icon({
    icon: 'glyphicon glyphicon-glass',
    markerColor: 'orange'
});

// Marker for coffeeshops
var coffeeshopMarker = L.AwesomeMarkers.icon({
    //icon: 'icon-skulls',
    icon: 'glyphicon glyphicon-star',
    markerColor: 'green'
});

// L.marker([51.941196, 4.512291], { icon: cityCardMarker }).addTo(map);

function addMarkers(markers) {
    // markersLG = new L.LayerGroup();
    markersLG.clearLayers();
    console.log('added centre point');
    markersLG.addLayer(markers);
    markersLG.addTo(map);
}

//circlesLG.addTo(map);

function removeAllMarkers() {
    // if (centrePoint != null) {
    //     centrePoint = null;
    // }
    centrePoint = null;
    markersLG.clearLayers();

    console.log('remove markers');
}

// function removeAllCircles() {
//     console.log('remove circles');
//     // if (radiusCircle != null) {
//     //     radiusCircle = null;
//     // }
//     circlesLG.clearLayers();
// }

// map.on('click', function(e) {
//     console.log(e.latlng);
// });

$('#btn_reset').click(() => {
    console.log('reset click');
    resetMap($('.active.tab-pane').attr('id'));
    // removeAllMarkers();
    // // removeAllCircles();
    // createCentrePoint();
    // cityCardG.clearLayers();
});

$('#btn_bikes').click(async () => {
    console.log('bikes click');
    console.log('start', startMarker.getLatLng());
    console.log('end', endMarker.getLatLng());
    await getBikePlaces(startMarker.getLatLng(), endMarker.getLatLng(), $("#distance").val() * 1000);
    // removeAllMarkers();
    // // removeAllCircles();
    // createCentrePoint();
    // cityCardG.clearLayers();
});

function resetMap(tab) {
    console.log('reset map');
    switch (tab) {
        case "menu1":
            console.log('reset menu1 tab');
            // map.removeLayer(cityCardG);
            //console.log('centre point is', centrePoint);
            markersLG.removeLayer(centrePoint);
            //console.log('centre point is', centrePoint);
            //console.log('markersLG is', markersLG);
            map.removeLayer(markersLG);
            //console.log('markersLG is', markersLG);
            createCentrePoint();
            //console.log('new centre point is', centrePoint);
            break;
        case "menu2":
            console.log('reset menu2 tab');
            //markersLG.removeLayer(centrePoint);
            console.log(markersLG);
            map.removeLayer(markersLG);
            hideAmenity('all');
            break;
        case "menu3":
            console.log('reset menu3 tab');
            //markersLG.removeLayer(centrePoint);
            map.removeLayer(markersLG);
            hideAmenity('all');
            createRouteMarkers();
            break;
        default:
            console.log('something went wrong');
        // default:
        //     // not used
        //     map.eachLayer(function (layer) {
        //         map.removeLayer(layer);
        //     });
    }
    map.removeLayer(cityCardG);
    //initialiseMap();
}

function hideAmenity(amenity) {
    console.log('hiding amenity', amenity);
    switch (amenity) {
        case "haring":
            map.removeLayer(haringG);
            break;
        case "febo":
            map.removeLayer(feboG);
            break;
        case "coffeeshop":
            map.removeLayer(coffeeshopG);
            break;
        case "bar":
            map.removeLayer(barG);
            break;
        case "stripclub":
            map.removeLayer(stripclubG);
            break;
        case "cinema":
            map.removeLayer(cinemaG);
            break;
        default:
            map.removeLayer(haringG);
            map.removeLayer(feboG);
            map.removeLayer(coffeeshopG);
            map.removeLayer(barG);
            map.removeLayer(stripclubG);
            map.removeLayer(cinemaG);

            // Reset all checkboxes
            $("input[type='checkbox']").prop('checked', false);
            break;
    }
}

$('#radius').on('input', function () {
    getCityCardPlaces(centrePoint.getLatLng().lat, centrePoint.getLatLng().lng, getRadius());
});

var cityCardG = L.geoJSON().addTo(map);

async function getCityCardPlaces(lat, lng, radius) {
    cityCardG.clearLayers();
    $.post('/citycard', { lat: lat, lng: lng, radius: radius }, function (data) {
        cityCardG = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: cityCardMarker });
            },
            onEachFeature: function (feature, layer) {
                var name = "<h3>" + feature.properties.f1 + "</h3>";
                layer.bindPopup(name + feature.properties.f2 + "<p><b>Distance</b>: " + parseFloat(feature.properties.f3).toFixed(2) + " m", {
                    maxWidth: "250px",
                    autoPan: false
                });
            }
        }).addTo(map);
    });
}


var bikePlacesG = L.geoJSON().addTo(map);

async function getBikePlaces(start, end, distance) {
    console.log('got start', start);
    console.log('got end', end);
    bikePlacesG.clearLayers();
    $.post('/bikes', { startLat: start.lat, startLng: start.lng, endLat: end.lat, endLng: end.lng, distance: distance }, function (data) {
        console.log('got data', data);
        bikePlacesG = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // TODO change icon
                return L.marker(latlng, { icon: cityCardMarker });
            },
            onEachFeature: function (feature, layer) {
                var name = "";
                if (feature.properties.f1) {
                    name = "<h4>" + feature.properties.f1 + "</h4>";
                }
                layer.bindPopup(name + feature.properties.f2 + "<p><b>Distance</b>: " + parseFloat(feature.properties.f3).toFixed(2) + " m", {
                    // maxWidth: "250px",
                    autoPan: false
                });
            }
        }).addTo(map);
    });
}

var haringG = L.geoJSON().addTo(map);
var feboG = L.geoJSON().addTo(map);
var coffeeshopG = L.geoJSON().addTo(map);
var barG = L.geoJSON().addTo(map);
var stripclubG = L.geoJSON().addTo(map);
var cinemaG = L.geoJSON().addTo(map);

async function getAmenity(amenity) {
    cityCardG.clearLayers();
    var filter = "";
    var icon = null;
    switch (amenity) {
        case "haring":
            filter = "WHERE LOWER(name) like '%haring%'";
            icon = haringMarker;
            break;
        case "febo":
            filter = "WHERE LOWER(name) = 'febo'";
            icon = feboMarker;
            break;
        case "coffeeshop":
            filter = "WHERE amenity = 'coffee_shop' OR LOWER(name) LIKE '%coffeeshop%'";
            icon = coffeeshopMarker;
            break;
        case "bar":
            filter = "WHERE amenity = 'bar'";
            icon = barMarker;
            break;
        case "stripclub":
            filter = "WHERE (amenity = 'brothel' OR amenity = 'stripclub' or amenity = 'nightclub')"
                + "AND COALESCE(name, '') <> ''";
            icon = stripclubMarker;
            break;
        case "cinema":
            filter = "WHERE amenity='cinema'";
            icon = cinemaMarker;
            break;
    }
    console.log('sending post amenity ', amenity);
    $.post('/amenity', { filter: filter }, function (data) {
        console.log('data', data);
        var layer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: icon });
            },
            onEachFeature: function (feature, layer) {
                // If name if undefined, don't bind a pop up
                if (feature.properties.f1) {
                    var name = "<b><h4>" + feature.properties.f1 + "</h4></b>";
                    var amenity = "<p>" + feature.properties.f2 + "</p>";
                    layer.bindPopup(name + amenity, {
                        autoPan: false
                    });
                }
            }
        });   //).addTo(map);
        console.log(layer);

        switch (amenity) {
            case "haring":
                haringG = layer.addTo(map);
                break;
            case "febo":
                feboG = layer.addTo(map);
                break;
            case "coffeeshop":
                coffeeshopG = layer.addTo(map);
                break;
            case "bar":
                barG = layer.addTo(map);
                break;
            case "stripclub":
                stripclubG = layer.addTo(map);
                break;
            case "cinema":
                cinemaG = layer.addTo(map);
                break;
        }
    });
}