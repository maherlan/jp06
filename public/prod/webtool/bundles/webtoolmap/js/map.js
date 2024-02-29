"use strict";

/* global google */
if ("undefined" !== typeof google) {
    (function($) {
        var panorama, orientation, streetViewService, geocoderService, directionsService, directionsRenderer;

        function getStreetViewService() {
            if (!streetViewService) {
                streetViewService = new google.maps.StreetViewService();
            }

            return streetViewService;
        }

        function getGeocoderService() {
            if (!geocoderService) {
                geocoderService = new google.maps.Geocoder();
            }

            return geocoderService;
        }

        function getDirectionsService() {
            if (!directionsService) {
                directionsService = new google.maps.DirectionsService();
            }

            return directionsService;
        }

        function getDirectionsRenderer() {
            if (!directionsRenderer) {
                directionsRenderer = new google.maps.DirectionsRenderer();
            }

            return directionsRenderer;
        }

        function initializeMaps() {
            $(".map-canvas").each(function (index, mapCanvas) {
                var $mapCanvas = $(mapCanvas);
                var $mapContainerInstance = $mapCanvas.closest('div[id^="wt-container-instance"]');
                var address = $mapContainerInstance.find("input.arrival").val();
                var geocode = $mapContainerInstance.find("input.geocode").val();
                var departureLatLng = {};

                switch ($mapCanvas.attr("data-type")) {
                    case "map.map":
                        codeAddress(address, geocode, mapCanvas);
                        break;

                    case "map.route":
                        codeAddress(address, geocode, mapCanvas);
                        getDirectionsRenderer().setPanel($mapContainerInstance.find(".directions-panel")[0]);
                        break;

                    case "map.street_view":
                        orientation = parseInt($mapContainerInstance.find("input.orientation").val());
                        panorama = new google.maps.StreetViewPanorama(mapCanvas, {
                            clickToGo: false,
                            disableDefaultUI: false,
                            disableDoubleClickZoom: false,
                            position: departureLatLng,
                            pov: {heading: orientation, pitch: 0},
                            scroolwheel: false,
                            enableCloseButton: true,
                            visible: true
                        });

                        getGeocoderService().geocode({"address": address}, function (results, status) {
                            if (geocode && status === google.maps.GeocoderStatus.OK) {
                                departureLatLng = results[0].geometry.location;
                                var request = {
                                    origin: address,
                                    destination: address,
                                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                                };
                                getDirectionsService().route(request, directionsCallback);
                            } else if (!geocode) {
                                var ltlng = address.split(",");
                                departureLatLng = {lat: parseFloat(ltlng[0]), lng: parseFloat(ltlng[1])};
                            }
                        });
                        codeAddress(address, geocode, mapCanvas, false);
                        break;
                }
            });
        }

        function processSVData(data, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                panorama.setPano(data.location.pano);
                panorama.setPov({
                    heading: orientation,
                    pitch: 0,
                    zoom: 1
                });
                panorama.setVisible(true);
            }
        }

        function directionsCallback(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                getStreetViewService().getPanoramaByLocation(
                    response.routes[0].legs[0].start_location,
                    50,
                    processSVData
                );
            }
        }

        /*
         * This function sets departure marker on the map, regardless of the address format
         *
         * @param {String|Array} address
         * @param {Bool}         geocode
         * @param {Object}       mapCanvas
         * @param {Bool}         markerEnabled
         */
        function codeAddress(address, geocode, mapCanvas, markerEnabled) {
            var $mapContainerInstance = $(mapCanvas).closest('div[id^="wt-container-instance"]');
            var departureLatLng;

            if (undefined === markerEnabled) {
                markerEnabled = true;
            }

            var map = new google.maps.Map(mapCanvas, {
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            getGeocoderService().geocode({"address": address}, function (results, status) {
                var isGeocode = false !== geocode && 'false' !== geocode;
                if (isGeocode && status === google.maps.GeocoderStatus.OK) {
                    departureLatLng = results[0].geometry.location;
                    map.setCenter(departureLatLng);
                } else if (!isGeocode) {
                    var ltlng = address.split(',');
                    departureLatLng = {
                        lat: parseFloat(ltlng[0]),
                        lng: parseFloat(ltlng[1])
                    };
                    map.setCenter(departureLatLng);
                } else {
                    // @TODO : create sentry log
                }

                if (markerEnabled) {
                    var mapMarker = new google.maps.Marker({
                        position: departureLatLng,
                        map: map,
                        title: address
                    });
                    var $companyMapBox = $mapContainerInstance.find(".company-map-box");
                    if ($companyMapBox.length) {
                        var myInfoWindow = new google.maps.InfoWindow({
                            content: $companyMapBox[0]
                        });
                        $companyMapBox.css('display', 'block');
                        myInfoWindow.open({
                            anchor: mapMarker,
                            map,
                            shouldFocus: false,
                        });
                    }
                }
            });
        }

        $("form.destination-form").submit(function (event) {
            var $mapContainerInstance = $(event.target).closest('div[id^="wt-container-instance"]');
            var start = $mapContainerInstance.find('input.departure').val();
            var address = $mapContainerInstance.find("input.arrival").val();
            var request = {
                origin: start,
                destination: address,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            getDirectionsService().route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    getDirectionsRenderer().setDirections(response);
                }
            });

            return false;
        });

        $(function () {
            $(".directions-panel").bind("DOMSubtreeModified", function () {
                $(".adp").removeClass("adp");
            });
        });

        google.maps.event.addDomListener(window, "load", initializeMaps);
    })(jQuery);
} else {
    // TODO : create sentry log
}
