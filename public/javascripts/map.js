// Create the map element
var map = L.map('map', { center: [52.3711, 4.9015], zoom: 15 });

// Add Mapbox tile layer to map element
var mapboxToken = 'https://api.mapbox.com/styles/v1/bowltie/cjahygh0e9ebd2so13iy889cc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYm93bHRpZSIsImEiOiJjamFoOTFyeWMya3AyMzNwOGFnNGhwMmZiIn0.TH1x7IRV8yLpP22E7UEs8A';
L.tileLayer(mapboxToken, { attribution: '© OpenStreetMap, Mapbox' }).addTo(map);

// Show the scale bar
L.control.scale().addTo(map);

var markersLG = new L.LayerGroup();
var startEndLG = new L.LayerGroup();
var centrePoint = null;
var startMarker = null;
var endMarker = null;

createCentrePoint();

/**
 * Return the input value in metres
 */
function getRadius() {
    var distance = $("#radius").val() * 1000;
    return distance;
}

/**
 * Create a point in the centre of the map
 */
function createCentrePoint() {
    console.log('new centre point');
    centrePoint = L.marker([52.36981, 4.89601], { draggable: true }); //.addTo(map);
    centrePoint.on('dragend', async (e) => {
        await getCityCardPlaces(e.target.getLatLng().lat, e.target.getLatLng().lng, getRadius());
    });
    addMarkers(centrePoint);
}

/**
 * Create draggable start and end points
 */
function createRouteMarkers() {
    
    console.log('new route markers');
    startMarker = L.marker([52.37418440434255, 4.899473190307618], { draggable: true }); //.addTo(map);
    endMarker = L.marker([52.36821042155847, 4.89393711090088], { draggable: true }); 
    startEndLG.clearLayers();

    startEndLG.addLayer(startMarker);
    startEndLG.addLayer(endMarker);
    startEndLG.addTo(map);
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

// Marker for bike rentals
var bikeRentalMarker = L.AwesomeMarkers.icon({
    icon: 'glyphicon glyphicon-eur',
    markerColor: 'green'
});

// Marker for bike parking places
var bikeParkingMarker = L.AwesomeMarkers.icon({
    icon: 'glyphicon glyphicon-scale',
    markerColor: 'blue'
});

// Marker for bike repair stations
var bikeRepairStationMarker = L.AwesomeMarkers.icon({
    icon: 'glyphicon glyphicon-wrench',
    markerColor: 'red'
});

function addMarkers(markers) {
    markersLG.clearLayers();
    console.log('added centre point');
    markersLG.addLayer(markers);
    markersLG.addTo(map);
}

function removeAllMarkers() {
    centrePoint = null;
    markersLG.clearLayers();
    console.log('remove markers');
}

// Trigger showing/hiding selected amenity
$("input[type='checkbox']").change(function () {
    if (this.checked) {
        console.log('checked', $(this).attr("id"));
        getAmenity($(this).attr("id"));
    } else {
        console.log('unchecked', $(this).attr("id"));
        hideAmenity($(this).attr("id"));
    }
});

// Reset the map after Reset button is clicked
$('#btn_reset').click(() => {
    console.log('reset click');
    resetMap($('.active.tab-pane').attr('id'));
});

// Get bike places when Find button is clicked
$('#btn_bikes').click(async () => {
    await getBikePlaces(startMarker.getLatLng(), endMarker.getLatLng(), $("#distance").val() * 1000);
});

/**
 * Reset the map based on which navigation tab is selected
 * @param tab active tab
 */
function resetMap(tab) {
    console.log('reset map');
    switch (tab) {
        case "menu1":
            console.log('reset menu1 tab');
            markersLG.removeLayer(centrePoint);
            map.removeLayer(markersLG);
            map.removeLayer(startEndLG);
            createCentrePoint();
            break;
        case "menu2":
            console.log('reset menu2 tab');
            console.log(markersLG);
            map.removeLayer(markersLG);
            map.removeLayer(startEndLG);
            hideAmenity('all');
            break;
        case "menu3":
            console.log('reset menu3 tab');
            map.removeLayer(markersLG);
            hideAmenity('all');
            createRouteMarkers();
            break;
        default:
            console.log('something went wrong');
    }
    map.removeLayer(cityCardG);
    map.removeLayer(bikePlacesG);
}

/**
 * Remove the layer of amenities based on the unchecked option
 * @param amenity unchecked option
 */
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

/**
 * Update city card places when radius input is changed
 */
$('#radius').on('input', function () {
    getCityCardPlaces(centrePoint.getLatLng().lat, centrePoint.getLatLng().lng, getRadius());
});

var cityCardG = L.geoJSON().addTo(map);
/**
 * POST request to the server for returning GeoJSON of free city card places within the selected radius
 * @param {*} lat latitude of the centre point
 * @param {*} lng longitude of the centre point
 * @param {*} radius current radius input value
 */
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

/**
 * POST request to the server for returning GeoJSON of bike rentals, bike parking places and bike repair stations
 * @param {*} start start point of the line
 * @param {*} end end point of the line
 * @param {*} distance 
 */
async function getBikePlaces(start, end, distance) {
    console.log('got start', start);
    console.log('got end', end);
    bikePlacesG.clearLayers();
    $.post('/bikes', { startLat: start.lat, startLng: start.lng, endLat: end.lat, endLng: end.lng, distance: distance }, function (data) {
        console.log('got data', data);
        bikePlacesG = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var icon = null;
                switch (feature.properties.f2) {
                    case "bicycle_rental":
                        icon = bikeRentalMarker;
                        break;
                    case "bicycle_parking":
                        icon = bikeParkingMarker;
                        break;
                    case "bicycle_repair_station":
                        icon = bikeRepairStationMarker;
                        break;
                }
                return L.marker(latlng, { icon: icon });
            },
            onEachFeature: function (feature, layer) {
                var name = "";
                if (feature.properties.f1) {
                    name = "<h4>" + feature.properties.f1 + "</h4>";
                }
                layer.bindPopup(name + feature.properties.f2 + "<p><b>Distance</b>: " + parseFloat(feature.properties.f3).toFixed(2) + " m", {
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

/**
 * POST request to the server for returning GeoJSON with all the selected amenities
 * @param {*} amenity 
 */
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
        });

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