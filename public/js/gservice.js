// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
  .factory('gservice', function($rootScope, $http) {

    // Initialize Variables
    // -------------------------------------------------------------
    // Service our factory will return
    var googleMapService = {};

    // Array of locations obtained from API calls
    var locations = [];

    // Selected Location (initialize to center of America)
    var selectedLat = 39.50;
    var selectedLong = -98.35;

    // Handling Clicks and location selection
    googleMapService.clickLat = 0;
    googleMapService.clickLong = 0;

    // Functions
    // --------------------------------------------------------------

    // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
    googleMapService.refresh = function(latitude, longitude, filteredResults) {

      // Clears the holding array of locations
      locations = [];

      // Set the selected lat and long equal to the ones provided on the refresh() call
      selectedLat = latitude;
      selectedLong = longitude;

      // If filtered results are provided in the refresh() call...
      if (filteredResults) {

        // Then convert the filtered results into map points.
        locations = convertToMapPoints(filteredResults);

        // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
        initialize(latitude, longitude, true);
      }

      // If no filter is provided in the refresh() call...
      else {

        // Perform an AJAX call to get all of the records in the db.
        $http.get('/users').success(function(response) {

          // Then convert the results into map points
          locations = convertToMapPoints(response);

          // Then initialize the map -- noting that no filter was used.
          initialize(latitude, longitude, false);
        }).error(function() {});
      }
    };

    // Private Inner Functions
    // --------------------------------------------------------------
    // Convert a JSON of users into map points
    var convertToMapPoints = function(response) {

      // Clear the locations holder
      var locations = [];

      // Loop through all of the JSON entries provided in the response
      for (var i = 0; i < response.length; i++) {
        var user = response[i];

        // Create popup windows for each record
        var contentString =
          '<p><b>Username</b>: ' + user.username +
          '<br><b>Age</b>: ' + user.age +
          '<br><b>Gender</b>: ' + user.gender +
          '<br><b>Favorite Language</b>: ' + user.favlang +
          '</p>';

        // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
        locations.push({
          latlon: new google.maps.LatLng(user.location[1], user.location[0]),
          message: new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 320
          }),
          username: user.username,
          gender: user.gender,
          age: user.age,
          favlang: user.favlang
        });
      }
      // location is now an array populated with records in Google Maps format
      return locations;
    };

    // Initializes the map
    var initialize = function(latitude, longitude, filter) {

      // Uses the selected lat, long as starting point
      var myLatLng = {
        lat: selectedLat,
        lng: selectedLong
      };

      // If map has not been created...
      if (!map) {

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
          center: myLatLng,
          zoom: 3,
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.DEFAULT,
          },
          disableDoubleClickZoom: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          },
          scaleControl: true,
          scrollwheel: true,
          panControl: true,
          streetViewControl: false,
          draggable: true,
          overviewMapControl: true,
          overviewMapControlOptions: {
            opened: false,
          },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#aee2e0"
            }]
          }, {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#abce83"
            }]
          }, {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#769E72"
            }]
          }, {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#7B8758"
            }]
          }, {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [{
              "color": "#EBF4A4"
            }]
          }, {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
              "visibility": "simplified"
            }, {
              "color": "#8dab68"
            }]
          }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
              "visibility": "simplified"
            }]
          }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#5B5B3F"
            }]
          }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{
              "color": "#ABCE83"
            }]
          }, {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
              "color": "#A4C67D"
            }]
          }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
              "color": "#9BBF72"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
              "color": "#EBF4A4"
            }]
          }, {
            "featureType": "transit",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#87ae79"
            }]
          }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#7f2200"
            }, {
              "visibility": "off"
            }]
          }, {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [{
              "color": "#ffffff"
            }, {
              "visibility": "on"
            }, {
              "weight": 4.1
            }]
          }, {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
              "color": "#495421"
            }]
          }, {
            "featureType": "administrative.neighborhood",
            "elementType": "labels",
            "stylers": [{
              "visibility": "off"
            }]
          }],
        });
      }

      // If a filter was used set the icons yellow, otherwise blue
      if (filter) {
        icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      } else {
        icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      }

      // Loop through each location in the array and place a marker
      locations.forEach(function(n, i) {
        var marker = new google.maps.Marker({
          position: n.latlon,
          map: map,
          title: "Big Map",
          icon: icon,
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e) {

          // When clicked, open the selected marker's message
          currentSelectedMarker = n;
          n.message.open(map, marker);
        });
      });

      // Set initial location as a bouncing red marker
      var initialLocation = new google.maps.LatLng(latitude, longitude);
      var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
      lastMarker = marker;

      // Function for moving to a selected location
      map.panTo(new google.maps.LatLng(latitude, longitude));

      // Clicking on the Map moves the bouncing red marker
      google.maps.event.addListener(map, 'click', function(e) {
        var marker = new google.maps.Marker({
          position: e.latLng,
          animation: google.maps.Animation.BOUNCE,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red bouncing marker
        if (lastMarker) {
          lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
      });
    };

    // Refresh the page upon window load. Use the initial latitude and longitude
    var map;
    google.maps.event.addDomListener(window, 'load',
      googleMapService.refresh(selectedLat, selectedLong));

    // google.maps.event.addDomListener(window, 'load', init);
    // function init() {
    //   googleMapService.refresh(selectedLat, selectedLong);
    //   var mapOptions = {
    //     center: new google.maps.LatLng(38.902389, -77.020055),
    //     zoom: 12,
    //     zoomControl: true,
    //     zoomControlOptions: {
    //       style: google.maps.ZoomControlStyle.DEFAULT,
    //     },
    //     disableDoubleClickZoom: true,
    //     mapTypeControl: true,
    //     mapTypeControlOptions: {
    //       style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    //     },
    //     scaleControl: true,
    //     scrollwheel: true,
    //     panControl: true,
    //     streetViewControl: false,
    //     draggable: true,
    //     overviewMapControl: true,
    //     overviewMapControlOptions: {
    //       opened: false,
    //     },
    //     mapTypeId: google.maps.MapTypeId.ROADMAP,
    //     styles: [{
    //       "featureType": "water",
    //       "elementType": "geometry",
    //       "stylers": [{
    //         "visibility": "on"
    //       }, {
    //         "color": "#aee2e0"
    //       }]
    //     }, {
    //       "featureType": "landscape",
    //       "elementType": "geometry.fill",
    //       "stylers": [{
    //         "color": "#abce83"
    //       }]
    //     }, {
    //       "featureType": "poi",
    //       "elementType": "geometry.fill",
    //       "stylers": [{
    //         "color": "#769E72"
    //       }]
    //     }, {
    //       "featureType": "poi",
    //       "elementType": "labels.text.fill",
    //       "stylers": [{
    //         "color": "#7B8758"
    //       }]
    //     }, {
    //       "featureType": "poi",
    //       "elementType": "labels.text.stroke",
    //       "stylers": [{
    //         "color": "#EBF4A4"
    //       }]
    //     }, {
    //       "featureType": "poi.park",
    //       "elementType": "geometry",
    //       "stylers": [{
    //         "visibility": "simplified"
    //       }, {
    //         "color": "#8dab68"
    //       }]
    //     }, {
    //       "featureType": "road",
    //       "elementType": "geometry.fill",
    //       "stylers": [{
    //         "visibility": "simplified"
    //       }]
    //     }, {
    //       "featureType": "road",
    //       "elementType": "labels.text.fill",
    //       "stylers": [{
    //         "color": "#5B5B3F"
    //       }]
    //     }, {
    //       "featureType": "road",
    //       "elementType": "labels.text.stroke",
    //       "stylers": [{
    //         "color": "#ABCE83"
    //       }]
    //     }, {
    //       "featureType": "road",
    //       "elementType": "labels.icon",
    //       "stylers": [{
    //         "visibility": "off"
    //       }]
    //     }, {
    //       "featureType": "road.local",
    //       "elementType": "geometry",
    //       "stylers": [{
    //         "color": "#A4C67D"
    //       }]
    //     }, {
    //       "featureType": "road.arterial",
    //       "elementType": "geometry",
    //       "stylers": [{
    //         "color": "#9BBF72"
    //       }]
    //     }, {
    //       "featureType": "road.highway",
    //       "elementType": "geometry",
    //       "stylers": [{
    //         "color": "#EBF4A4"
    //       }]
    //     }, {
    //       "featureType": "transit",
    //       "stylers": [{
    //         "visibility": "off"
    //       }]
    //     }, {
    //       "featureType": "administrative",
    //       "elementType": "geometry.stroke",
    //       "stylers": [{
    //         "visibility": "on"
    //       }, {
    //         "color": "#87ae79"
    //       }]
    //     }, {
    //       "featureType": "administrative",
    //       "elementType": "geometry.fill",
    //       "stylers": [{
    //         "color": "#7f2200"
    //       }, {
    //         "visibility": "off"
    //       }]
    //     }, {
    //       "featureType": "administrative",
    //       "elementType": "labels.text.stroke",
    //       "stylers": [{
    //         "color": "#ffffff"
    //       }, {
    //         "visibility": "on"
    //       }, {
    //         "weight": 4.1
    //       }]
    //     }, {
    //       "featureType": "administrative",
    //       "elementType": "labels.text.fill",
    //       "stylers": [{
    //         "color": "#495421"
    //       }]
    //     }, {
    //       "featureType": "administrative.neighborhood",
    //       "elementType": "labels",
    //       "stylers": [{
    //         "visibility": "off"
    //       }]
    //     }],
    //   };
    //   var mapElement = document.getElementById('map');
    //   var map = new google.maps.Map(mapElement, mapOptions);
    //   var locations = [
    //
    //   ];
    //   for (i = 0; i < locations.length; i++) {
    //     if (locations[i][1] == 'undefined') {
    //       description = '';
    //     } else {
    //       description = locations[i][1];
    //     }
    //     if (locations[i][2] == 'undefined') {
    //       telephone = '';
    //     } else {
    //       telephone = locations[i][2];
    //     }
    //     if (locations[i][3] == 'undefined') {
    //       email = '';
    //     } else {
    //       email = locations[i][3];
    //     }
    //     if (locations[i][4] == 'undefined') {
    //       web = '';
    //     } else {
    //       web = locations[i][4];
    //     }
    //     if (locations[i][7] == 'undefined') {
    //       markericon = '';
    //     } else {
    //       markericon = locations[i][7];
    //     }
    //     marker = new google.maps.Marker({
    //       icon: markericon,
    //       position: new google.maps.LatLng(locations[i][5], locations[i][6]),
    //       map: map,
    //       title: locations[i][0],
    //       desc: description,
    //       tel: telephone,
    //       email: email,
    //       web: web
    //     });
    //     link = '';
    //   }
    //
    // }

    return googleMapService;
  });
