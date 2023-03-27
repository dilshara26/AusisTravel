"use strict";

/**
 * webServiceRequest function
 * Generic web service request function to call a web service that supports jsonp.
 * @param {string} url address of the web service
 * @param {object} data object containing querystring params as key:value. must contain callback/jsonp attribute for jsonp
 */
function webServiceRequest(url, data) {
  // Build URL parameters from data object.
  let params = "";
  // For each key in data object...
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (params.length == 0) {
        // First parameter starts with '?'
        params += "?";
      } else {
        // Subsequent parameter separated by '&'
        params += "&";
      }

      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(data[key]);

      params += encodedKey + "=" + encodedValue;
    }
  }
  let script = document.createElement("script");
  script.src = url + params;
  document.body.appendChild(script);
}

/**
 * sendXMLRequestForPlaces function
 * This is a wrapper to call the MapBox Search API for points of interest
 * @param {string} query category of search. The following categories are supported: attraction, lodging, food, gas station
 * @param {number} lng the longitude coordinates
 * @param {number} lat the latitude coordinates
 * @param {function} successCallback contains the name of the function (not as a string) to call as the callback function when this web service request resolves
 */
function sendXMLRequestForPlaces(query, lng, lat, successCallback) {
  let url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(query) +
    ".json?limit=10&proximity=" +
    lng +
    "," +
    lat +
    "&access_token=" +
    MAPBOX_KEY;
  let req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.onload = function () {
    successCallback(JSON.parse(req.response));
  };
  req.send();
}

/**
 * sendXMLRequestForRoute function
 * This is a wrapper to call the MapBox Direction API for driving routing directions.
 * @param {number} startLat the start point latitude coordinates
 * @param {number} startLng the start point longitude coordinates
 * @param {number} endLat the end point latitude coordinates
 * @param {number} endLng the end point longitude coordinates
 * @param {function} directionsCallback contains the name of the function (not as a string) to call as the callback function when this web services request resolves
 */
function sendXMLRequestForRoute(
  startLat,
  startLon,
  endLat,
  endLon,
  directionsCallback
) {
  let url =
    "https://api.mapbox.com/directions/v5/mapbox/driving/" +
    startLon +
    "," +
    startLat +
    ";" +
    endLon +
    "," +
    endLat +
    "?steps=true&geometries=geojson&access_token=" +
    MAPBOX_KEY;
  let req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.onload = function () {
    directionsCallback(JSON.parse(req.response));
  };
  req.send();
}

/**
 * sendWebServiceRequestForReverseGeocoding function
 * This is a wrapper to call the OpenCage Reverse Geocoder using the webServiceRequest function to obtain addresses from lat/lng coordinates
 * @param {number} lat the latitude coordinates
 * @param {number} lng the longitude coordinates
 * @param {string} callback contains the function name as a string to call as the callback function when this web services request resolves
 */
function sendWebServiceRequestForReverseGeocoding(lat, lng, callback) {
  let url = "https://api.opencagedata.com/geocode/v1/json";
  let data = {
    q: `${lat}+${lng}`,
    key: OPENCAGE_KEY,
    jsonp: callback,
  };
  webServiceRequest(url, data);
}

/**
 * sendWebServiceRequestForForwardGeocoding function
 * This is a wrapper to call the OpenCage Forward Geocoder using the webServiceRequest function to obtain lat/lng coordinates from an address
 * @param {string} location the address
 * @param {string} callback contains the function name as a string to call as the callback function when this web services request resolves
 */
function sendWebServiceRequestForForwardGeocoding(location, callback) {
  let url = "https://api.opencagedata.com/geocode/v1/json";
  let data = {
    q: `${location}`,
    key: OPENCAGE_KEY,
    jsonp: callback,
  };
  webServiceRequest(url, data);
}

/**
 * getUserCurrentLocationUsingGeolocation function
 * This is a wrapper to call the browser Geolocation API to request for the user's current location
 * @param {function} callback contains the name of the function (not as a string) to call as the callback function when this geolocation request resolves
 */
function getUserCurrentLocationUsingGeolocation(callback) {
  if ("geolocation" in navigator) {
    // geolocation is available
    navigator.geolocation.getCurrentPosition((position) => {
      callback(position.coords.latitude, position.coords.longitude);
    });
  } else {
    // geolocation IS NOT available
    console.log("Geolocation is not available");
  }
}

/**
 * checkLSData function
 * Used to check if any data in LS exists at a specific key
 * @param {string} key LS Key to be used
 * @returns true or false representing if data exists at key in LS
 */
function checkLSData(key) {
  if (localStorage.getItem(key) != null) {
    return true;
  }
  return false;
}

/**
 * retrieveLSData function
 * Used to retrieve data from LS at a specific key.
 * @param {string} key LS Key to be used
 * @returns data from LS in JS format
 */
function retrieveLSData(key) {
  let data = localStorage.getItem(key);
  try {
    data = JSON.parse(data);
  } catch (err) {
  } finally {
    return data;
  }
}

/**
 * updateLSData function
 * Used to store JS data in LS at a specific key
 * @param {string} key LS key to be used
 * @param {any} data data to be stored
 */
function updateLSData(key, data) {
  let json = JSON.stringify(data);
  localStorage.setItem(key, json);
}

/**
 * used to get the airports of the selected country
 * @param {String} country pass the selected country from country field
 * @param {String} callback the name of the function that needs to be called
 */
function sendWebServiceRequestForAirports(country, callback) {
  let url = "https://eng1003.monash/OpenFlights/airports/";
  let airportPara = {
    country: country,
    callback: callback,
  };
  webServiceRequest(url, airportPara);
}

/**
 * get the routes from the seelcted airport
 * @param {string} sourceAirport selected airport
 * @param {string} callback function name to get called by th3 server
 */
function sendWebServiceRequestForRoutes(sourceAirport, callback) {
  let url = "https://eng1003.monash/OpenFlights/routes/";
  let routePara = {
    sourceAirport: sourceAirport,
    callback: callback,
  };
  webServiceRequest(url, routePara);
}

/*--- Classes ---*/

class Users {
  constructor() {
    this._users = [];
  }

  addUser(user) {
    this._users.push(user);
  }

  newUser(user) {
    for (let i = 0; i < this._users.length; i++) {
      if (user.username === this.users[i].username) {
        return false;
      }
    }
    return true;
  }

  getUserByUsername(username) {
    for (let i = 0; i < this._users.length; i++) {
      if (username === this.users[i].username) {
        return this._users[i];
      }
    }
  }

  get users() {
    return this._users;
  }

  fromData(usersJson) {
    for (let i = 0; i < usersJson._users.length; i++) {
      let user = new User();
      user.fromData(usersJson._users[i]);
      this._users.push(user);
    }
  }
}

class User {
  constructor(username, password) {
    this._username = username;
    this._password = password;
    this._sessions = [];
  }

  get username() {
    return this._username;
  }

  get password() {
    return this._password;
  }

  set username(username) {
    this._username = username;
  }

  set password(password) {
    this._password = password;
  }

  get sessions() {
    return this._sessions;
  }

  addSession(session) {
    this._sessions.push(session);
  }

  getSession(index) {
    return this._sessions[index];
  }

  fromData(userJson) {
    this._username = userJson._username;
    this._password = userJson._password;
    for (let i = 0; i < userJson._sessions.length; i++) {
      let session = new Session();
      session.fromData(userJson._sessions[i]);
      this._sessions.push(session);
    }
  }
}

class Session {
  constructor() {
    this._date = null;
    this._country = null;

    this._base_airports = [];
    this._destinations = [];

    this._destination_markers = [];
    this._base_markers = [];

    this.num_destinations = 0;
  }

  fromData(sessionJson) {
    this._date = new Date(`${sessionJson._date}`);
    this._country = sessionJson._country;

    this._base_airports = sessionJson._base_airports;
    this._destinations = sessionJson._destinations;
    this._destinations = sessionJson._destinations;
    this.num_destinations = sessionJson.num_destinations;
    this._destination_markers = sessionJson._destination_markers;
    this._base_markers = sessionJson._base_markers;
  }

  getPoints() {
    let lines_arr = [];
    this.num_destinations =
      this._destination_markers[this._destination_markers.length - 1].length;
    for (
      let i = 0;
      i <
      this._destination_markers[this._destination_markers.length - 1].length;
      i++
    ) {
      let line_arr = [];
      line_arr.push(this._base_markers[this._base_markers.length - 1]);
      line_arr.push(
        this._destination_markers[this._destination_markers.length - 1][i]
      );
      lines_arr.push(line_arr);
    }

    for (let i = 0; i < this._base_markers.length - 1; i++) {
      let line_arr = [];
      line_arr.push(this._base_markers[i]);
      line_arr.push(this._base_markers[i + 1]);
      lines_arr.push(line_arr);
    }
    return lines_arr;
  }

  addTour(data) {
    console.log(data);
    this._base_airports.push(data.base_obj);
    this._base_markers.push(data.base_marker);
    this._destinations.push(data.destinations);
    this._destination_markers.push(data.destination_markers);
    // console.log(this.getPoints());
    let coord_pairs = this.getPoints();
    this.showTheMap(coord_pairs);
  }

  get base_airports() {
    return this._base_airports;
  }

  popLastData() {
    this._base_airports.pop();
    this._base_markers.pop();
    this._destinations.pop();
    this._destination_markers.pop();

    let coord_pairs = this.getPoints();
    this.showTheMap(coord_pairs);
  }

  showSummary() {
    console.log(this.base_airports);
    let path = "";
    for (let i = 0; i < this._base_airports.length; i++) {
      if (i == this._base_airports.length - 1) {
        path += this._base_airports[i].name;
      } else {
        path += this.base_airports[i].name + "➡️";
      }
    }
    console.log(path);

    let stops = this._base_airports.length - 2;
    if (stops < 0) {
      stops = 0;
    }
    document.getElementById("date-val").innerHTML =
      this._date.toLocaleDateString();
    document.getElementById("path-val").innerHTML = path;
    document.getElementById("time-val").innerHTML =
      this._date.toLocaleTimeString();
    document.getElementById("stops-val").innerHTML = stops;
  }

  showTheMap(coord_pairs) {
    let map = renderMap();
    map.on("load", () => {
      utility.hideAirportDiv();
      utility.showMapBtns();
      map
        .setZoom(4)
        .panTo([
          parseFloat(this._base_markers[0].lng),
          parseFloat(this._base_markers[0].lat),
        ]);

      //* Marker Generation
      for (let i = 0; i < this._base_markers.length; i++) {
        const marker = new mapboxgl.Marker()
          .setLngLat(this._base_markers[i])
          .setPopup(
            // add popup
            new mapboxgl.Popup().setHTML(
              `<p style="color: black !important; margin:0; padding:0 !important;">${this._base_airports[i].name}</p>`
            )
          )
          .addTo(map)
          .togglePopup()
          .getElement()
          .addEventListener("click", (e) => {
            // console.log(this._base_airports[i]);
            // utility.extractData(this._base_airports[i]);
          });
      }

      for (let i = 0; i < this._destination_markers.at(-1).length; i++) {
        const marker = new mapboxgl.Marker()
          .setLngLat(this._destination_markers.at(-1)[i])
          .setPopup(
            // add popup
            new mapboxgl.Popup().setHTML(
              `<p style="color: black !important; margin:0; padding:0 !important;">${
                this._destinations.at(-1)[i].name
              }</p>`
            )
          )
          .addTo(map)
          .togglePopup()
          .getElement()
          .addEventListener("click", (e) => {
            // console.log(this._destinations.at(-1)[i]);
            utility.extractData(this._destinations.at(-1)[i]);
          });
      }

      //* Line Generation

      for (let i = 0; i < coord_pairs.length; i++) {
        //! [{}, {}]
        //* coord_pairs[i]
        let [m, n] = coord_pairs[i];

        map.addSource(`route-${i}`, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [m.lng, m.lat],
                [n.lng, n.lat],
              ],
            },
          },
        });

        let color = "#ff0000";

        if (i < this.num_destinations) {
          color = "#000000";
        }

        map.addLayer({
          id: `route-${i}`,
          type: "line",
          source: `route-${i}`,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": `${color}`,
            "line-width": 2,
          },
        });
      }
    });
  }

  showBasesMap(coord_pairs) {
    let map = renderMap();
    map.on("load", () => {
      map
        .setZoom(4)
        .panTo([
          parseFloat(this._base_markers[0].lng),
          parseFloat(this._base_markers[0].lat),
        ]);

      //* Marker Generation
      for (let i = 0; i < this._base_markers.length; i++) {
        const marker = new mapboxgl.Marker()
          .setLngLat(this._base_markers[i])
          .setPopup(
            // add popup
            new mapboxgl.Popup().setHTML(
              `<p style="color: black !important; margin:0; padding:0 !important;">${this._base_airports[i].name}</p>`
            )
          )
          .addTo(map)
          .togglePopup()
          .getElement()
          .addEventListener("click", (e) => {
            // console.log(this._base_airports[i]);
            // utility.extractData(this._base_airports[i]);
          });
      }

      //* Line Generation

      for (let i = this.num_destinations; i < coord_pairs.length; i++) {
        //! [{}, {}]
        //* coord_pairs[i]
        let [m, n] = coord_pairs[i];

        map.addSource(`route-${i}`, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [m.lng, m.lat],
                [n.lng, n.lat],
              ],
            },
          },
        });

        let color = "#ff0000";

        map.addLayer({
          id: `route-${i}`,
          type: "line",
          source: `route-${i}`,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": `${color}`,
            "line-width": 2,
          },
        });
      }

    });
  }

  get country() {
    return this._country;
  }

  set country(country) {
    this._country = country;
  }

  get date() {

    return this._date;
  }

  set date(date) {
    this._date = date;
  }

  get base_airports() {
    return this._base_airports;
  }
}

function renderMap() {
  document.querySelector(".map-container").innerHTML =
    "<div id='map' style='width: 1200px; height: 600px;'></div>";

  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFudXBhLXMiLCJhIjoiY2wyaHQxM2ZlMGgxYzNrbXhjYTh4bGt4NyJ9.E6lcnFeyr4FBuim4IKp6jw";

  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
  });

  map.on("click", function (e) {
    console.log(e.lngLat);
    let { lng, lat } = e.lngLat;
    map.panTo([lng, lat]);
  });

  return map;
}
