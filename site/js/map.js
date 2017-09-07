let pos = new CoordTuple(0, 0);

function initMap() {
    let map, infoWindow;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 49.496675, lng: -102.65625 }
    });

    let georssLayer = new google.maps.KmlLayer({
        url: 'https://raw.githubusercontent.com/lab9k/Parking/master/site/data/Parkeertariefzones.kml',
        suppressInfoWindows: true
    });

    georssLayer.setMap(map);

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos.setLatitude(position.coords.latitude);
            pos.setLongitude(position.coords.longitude);

            infoWindow.setPosition(pos.toPlainObject());
            infoWindow.setContent('You are here');
            infoWindow.open(map);
            map.setCenter(pos.toPlainObject());
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent('You are here');
    infoWindow.open(map);
}