/**
 * Created by Tom Lauwaerts on 6/09/2017.
 */
"use strict";

function CoordTuple(lat, lng) {
    // Private fields
    /////////////////

    let self = this;
    let listeners = [];
    let latitude = lat;
    let longitude = lng;

    // Getters
    //////////

    self.getLatitude = function () {
        return latitude;
    };

    self.getLongitude = function () {
        return longitude;
    };

    // Setters
    //////////

    self.setLatitude = function (lat) {
        latitude = lat;
        self.trigger();
    };

    self.setLongitude = function (lng) {
        longitude = lng;
        self.trigger();
    };

    // Public methods
    /////////////////

    self.toPlainObject = function () {
        return {lat: latitude, lng: longitude};
    };

    // TODO: add inheritance and checking if listener is right type (has the update method. via prototype?)
    self.addPropertyListerner = function (listener) {
        listeners.push(listener);
    };

    self.trigger = function () {
        listeners.forEach((listener) => {
            listener.update(self.toPlainObject());
        });
    };
}