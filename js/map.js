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
        url: 'https://raw.githubusercontent.com/lab9k/ParkCoin/master/data/Parkeertariefzones.kml',
        suppressInfoWindows: true,
        clickable : false
    });

    georssLayer.setMap(map);

    let input = document.getElementById('pac-input');

    let autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    let infowindow = new google.maps.InfoWindow();
    // let infowindowContent = document.getElementById('infowindow-content');
    // infowindow.setContent(infowindowContent);

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        // marker.setVisible(false);
        let place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        placeMarkerAndPanTo(place.geometry.location, map);

        // marker.setPosition(place.geometry.location);
        // marker.setVisible(true);

        let address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        // infowindowContent.children['place-icon'].src = place.icon;
        // infowindowContent.children['place-name'].textContent = place.name;
        // infowindowContent.children['place-address'].textContent = address;
        // infowindow.open(map, marker);
    });

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