/* global $, Hogan, algoliasearch, algoliasearchHelper, google */

$(document).ready(function () {
  // INITIALIZATION
  // ==============
  var APPLICATION_ID = 'S4KUBACX2X';
  var SEARCH_ONLY_API_KEY = '2aabd9cca0f6d44c667055c31647e5d1';
  var INDEX_NAME = 'routes';
  var PARAMS = {hitsPerPage: 60};

  // Client + Helper initialization
  var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);
  var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, PARAMS);
  algoliaHelper.setQueryParameter('getRankingInfo', true);

  // DOM and Templates binding
  var $map = $('#map');
  var $hits = $('#hits');
  var $searchInput = $('#search-input');
  var hitsTemplate = Hogan.compile($('#hits-template').text());
  var noResultsTemplate = Hogan.compile($('#no-results-template').text());
  var edit_mode=false;
  // Map initialization
  var map = new google.maps.Map($map.get(0), {
    streetViewControl: true,
    mapTypeControl: true,
    zoom: 3,
    minZoom: 3,
    maxZoom: 12,
    styles: [{stylers: [{hue: '#3596D2'}]}]
  });
  var fitMapToMarkersAutomatically = true;
  var markers = [];
  var boundingBox;
  var boundingBoxListeners = [];

  // Page states
  var PAGE_STATES = {
    LOAD: 0,
    BOUNDING_BOX_RECTANGLE: 1,
    AROUND_IP: 2,
    EDIT_OPTION: 3
    // AROUND_NYC: 5,
    // AROUND_LONDON: 6,
    // AROUND_SYDNEY: 7
  };
  var pageState = PAGE_STATES.LOAD;
  setPageState(PAGE_STATES.BOUNDING_BOX_RECTANGLE);

  // PAGE STATES
  // ===========
  function setPageState(state) {
        console.log(state);
    resetPageState();
    beginPageState(state);
  }

  function beginPageState(state) {

    pageState = state;

    switch (state) {
      case PAGE_STATES.BOUNDING_BOX_RECTANGLE:
        boundingBox = new google.maps.Rectangle({
          bounds: {north: 60, south: 40, east: 16, west: -4},
          strokeColor: '#EF5362',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#EF5362',
          fillOpacity: 0.15,
          draggable: true,
          editable: true,
          geodesic: true,
          map: map
        });
        algoliaHelper.setQueryParameter('insideBoundingBox', rectangleToAlgoliaParams(boundingBox));
        boundingBoxListeners.push(google.maps.event.addListener(
          boundingBox,
          'bounds_changed',
          throttle(rectangleBoundsChanged, 150)
        ));
        break;
        case PAGE_STATES.AROUND_IP:
          algoliaHelper.setQueryParameter('aroundLatLngViaIP', true);
        break;

       case PAGE_STATES.EDIT_OPTION:
        break;
      // default:
        // No-op
    }

    fitMapToMarkersAutomatically = true;
    algoliaHelper.search();
  }

  function resetPageState() {
    if (edit_mode)
      edit_mode=false;

    if (boundingBox) boundingBox.setMap(null);
    for (var i = 0; i < boundingBoxListeners.length; ++i) {
      google.maps.event.removeListener(boundingBoxListeners[i]);
    }
    boundingBoxListeners = [];
    $searchInput.val('');
    algoliaHelper.setQuery('');
    algoliaHelper.setQueryParameter('insideBoundingBox', undefined);
    // algoliaHelper.setQueryParameter('insidePolygon', undefined);
    // algoliaHelper.setQueryParameter('aroundLatLng', undefined);
    algoliaHelper.setQueryParameter('aroundLatLngViaIP', undefined);
  }

  // TEXTUAL SEARCH
  // ===============
  $searchInput.on('input propertychange', function (e) {
    var query = e.currentTarget.value;
    console.log(query);
    if (pageState === PAGE_STATES.BOUNDING_BOX_RECTANGLE) {
      fitMapToMarkersAutomatically = false;
    }
    algoliaHelper.setQuery(query).search();
  });

  // DISPLAY RESULTS
  // ===============
  algoliaHelper.on('result', function (content) {
  	console.log(content)
    renderMap(content);
    renderHits(content);
  });

  algoliaHelper.on('error', function (error) {
    console.log(error);
  });

  function renderHits(content) {
    if (content.hits.length === 0) {
      $hits.html(noResultsTemplate.render());
      return;
    }
    content.hits = content.hits.slice(0, 20);
    for (var i = 0; i < content.hits.length; ++i) {
      var hit = content.hits[i];
      hit.displayCity = (hit.name === hit.city);
      if (hit._rankingInfo.matchedGeoLocation) {
        hit.distance = parseInt(hit._rankingInfo.matchedGeoLocation.distance / 1000, 10) + ' km';
      }
    }
    $hits.html(hitsTemplate.render(content));
  }

  function icon(hit){//color = #B45F04
    if (hit.activities.length>1)
      return "assets/icons/combo.png"
    else if (!hit.activities)
      return;
    else {
      switch (hit.activities[0]) {
         case 'hiking':
           return "assets/icons/hiking.png"
         break;
         case 'skitouring':
           return "assets/icons/skitouring.png"
         break;
         case 'snow_ice_mixed':
           return "assets/icons/snow_ice_mixed.png"
         break;
         case 'rock_climbing':
           return "assets/icons/rock_climbing.png"
         break;
         case 'mountain_biking':
           return "assets/icons/mountain_biking.png"
         break;
    }
  }

  }

  function renderMap(content) {
    removeMarkersFromMap();
    markers = [];


    for (var i = 0; i < content.hits.length; ++i) {
      var hit = content.hits[i];
      var marker = new google.maps.Marker({
        position: {lat: hit._geoloc.lat, lng: hit._geoloc.lng},
        map: map,
        route_id: hit.objectID,
        title: hit.title,
	      icon: icon(hit)
      });
      var markerContent="<div class='markerContent' >"+hit.title+'<br>'
      +"<button type='button'>Save</button>"
      +"</div>"

      // '<iframe width="560" height="315" src="https://www.youtube.com/embed/izGDYKD50lc" frameborder="0" allowfullscreen></iframe>'+'</div>';
      markers.push(marker);
      var infoWindowOptions = {
        content: markerContent
      };
      attachInfoWindow(marker,infoWindowOptions);
    }

    if (fitMapToMarkersAutomatically) fitMapToMarkers();
  }

  // edit event new latLnt
    // ==============

    google.maps.event.addListener(map, 'click', function( e ){
      if (edit_mode){
          //lat and lng is available in e object
          var latLng = {
            lat : e.latLng.lat(),
            lng : e.latLng.lng()
          }
          var marker = new google.maps.Marker({
            position: latLng,
            map: map
          });
          var markerContent="<div class='markerContent' >"
          +"latitude :"+latLng.lat+"<br>"
          +"longitude :"+latLng.lng+"<br>"
          +"<button type='button'>Save</button>"
          +"</div>"

          // '<iframe width="560" height="315" src="https://www.youtube.com/embed/izGDYKD50lc" frameborder="0" allowfullscreen></iframe>'+'</div>';
          markers.push(marker);
          var infoWindowOptions = {
            content: markerContent
          };
          attachInfoWindow(marker,infoWindowOptions);
      }
    });
  // EVENTS BINDING
  // ==============
   $('.change_page_state').on('click', function (e) {
     e.preventDefault();
     updateMenu($(this).data('state'), $(this).data('mode'));
     switch ($(this).data('state')) {
       case 'rectangle':
         setPageState(PAGE_STATES.BOUNDING_BOX_RECTANGLE);
      break;
      case 'edit':
          edit_mode=true;
        break;
       case 'ip':
         setPageState(PAGE_STATES.AROUND_IP);
         break;
  //     case 'nyc':
  //       setPageState(PAGE_STATES.AROUND_NYC);
  //       break;
  //     case 'london':
  //       setPageState(PAGE_STATES.AROUND_LONDON);
  //       break;
  //     case 'sydney':
  //       setPageState(PAGE_STATES.AROUND_SYDNEY);
  //       break;
  //     default:
  //       // No op
     }
   });

  // HELPER METHODS
  // ==============
  function updateMenu(stateClass, modeClass) {
    $('.change_page_state').removeClass('active');
    $('.change_page_state[data-state="' + stateClass + '"]').addClass('active');
    $('.page_mode').removeClass('active');
    $('.page_mode[data-mode="' + modeClass + '"]').addClass('active');
  }

  function fitMapToMarkers() {
    var mapBounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      mapBounds.extend(markers[i].getPosition());
    }
    map.fitBounds(mapBounds);
  }

  function removeMarkersFromMap() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  function rectangleBoundsChanged() {
    fitMapToMarkersAutomatically = false;
    algoliaHelper.setQueryParameter('insideBoundingBox', rectangleToAlgoliaParams(boundingBox)).search();
  }

  function rectangleToAlgoliaParams(rectangle) {
    var bounds = rectangle.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    return [ne.lat(), ne.lng(), sw.lat(), sw.lng()].join();
  }

  function attachInfoWindow(marker,infoWindowOptions) {

    var infowindow = new google.maps.InfoWindow(infoWindowOptions);
    marker.addListener('click', function () {
      infowindow.open(map,marker);
    //  setTimeout(function () {infowindow.close();}, 3000);
    });
  }

  function throttle(func, wait) {
    var context;
    var args;
    var result;
    var timeout = null;
    var previous = 0;
    function later() {
      previous = Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    }
    return function () {
      var now = Date.now();
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }
});
