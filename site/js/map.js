const pos = new CoordTuple(0, 0);
const myLatlng = { lat: 51.053970, lng: 3.721015 };

let map, marker;

function initMap() {

    // let map, infoWindow;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatlng
    });

    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
    });

    let georssLayer = new google.maps.KmlLayer({
        url: 'https://raw.githubusercontent.com/lab9k/Parking/master/site/data/Parkeertariefzones.kml',
        suppressInfoWindows: true,
        clickable : false
    });

    georssLayer.setMap(map);

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            placeMarkerAndPanTo({lat: position.coords.latitude, lng: position.coords.longitude}, map);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        pos.setPosition(myLatlng);
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent('You are here');
    infoWindow.open(map);
}

function placeMarkerAndPanTo(latLng, map) {
    if (marker === undefined) {
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            draggable: true
        });
    } else {
        marker.setPosition(latLng);
        map.panTo(latLng);
    }

    pos.setPosition({lat: marker.getPosition().lat(), lng:marker.getPosition().lng()});
}