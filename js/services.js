"use strict";

const USERS = "users_key";
const USER = "user_key";
const INDEX = "index_key";

let utility = {

  airport_div: document.querySelector(".airportDiv"),

  shedule_div: document.querySelector(".schedule-div"),

  airport_select: document.querySelector("#airport-select"),

  map_btns: document.querySelector(".map-btns"),

  plan_summary_container: document.querySelector(".plan-summary-container"),

  map_container: document.querySelector(".map-container"),

  domesticAirportNames: [],

  domesticAirports: [],

  uniqueDomesticRoutes: [],

  showAirPortNames(airportObjectList) {
    this.domesticAirports = airportObjectList;

    for (let i = 0; i < airportObjectList.length; i++) {
      this.domesticAirportNames.push(airportObjectList[i].name);
    }

    let option_set = `<option value="">--</option>`;
    for (let i = 0; i < this.domesticAirportNames.length; i++) {
      let option_element = `<option value="${this.domesticAirportNames[i]}">${this.domesticAirportNames[i]}</option>`;
      option_set += option_element;
    }
    this.airport_select.innerHTML = option_set;
  },

  hideAirportDiv() {
    this.airport_div.style.display = "none";
  },

  hideMapBtns() {
    this.map_btns.style.display = "none";
  },

  showMapBtns() {
    this.map_btns.style.display = "block";
  },

  hideSummaryContainer(){

    this.plan_summary_container.style.display = "none";
  },
  
  showSummary(){

    this.map_container.style.display = "none";
    this.plan_summary_container.style.display = "block";
    this.map_btns.style.display = "none";
    utility.plan_summary_container.style.display = "block";
    session.showSummary();
  },

  showAirportDiv() {
    this.airport_div.style.display = "flex";
    this.shedule_div.style.display = "none";
  },

  getAirportObj() {
    for (let i = 0; i < this.domesticAirports.length; i++) {
      if (this.domesticAirports[i].name == this.airport_select.value) {
        // console.log(this.domesticAirports[i].airportId);
        return this.domesticAirports[i];
      }
    }
  },
  checkDomesticRoutes(routeAirportId) {
    for (let i = 0; i < this.domesticAirports.length; i++) {
      if (this.domesticAirports[i].airportId == routeAirportId) {
        return true;
      }
    }
    return false
  },
  
  filterUniqueDomesticRoutes(routeObjectList) {
    console.log("Current test")
    console.log(routeObjectList)
    console.log(this.domesticAirports[0].airportId);
    let dom_routes = [];
    let dom_routes_id = [];
    // console.log(routeObjectList);
    // console.log(this.domesticAirports)
    for (let i = 0; i < routeObjectList.length; i++) {
      if (this.checkDomesticRoutes(routeObjectList[i].destinationAirportId) && !dom_routes_id.includes(routeObjectList[i].destinationAirportId)) {
        dom_routes.push(routeObjectList[i]);
        dom_routes_id.push(routeObjectList[i].destinationAirportId)
      }
     
    }
    console.log(dom_routes)
     return dom_routes;
  },
  getAirportObjById(route) {
    for (let i = 0; i < this.domesticAirports.length; i++) {
      if (this.domesticAirports[i].airportId == route.destinationAirportId) {
        return this.domesticAirports[i];
      }
    }
  },

  getDestinationAirports(uniqueDomesticRoutes) {
    let destinationAirportArr = [];
    for (let i = 0; i < uniqueDomesticRoutes.length; i++) {
      destinationAirportArr.push(
        this.getAirportObjById(uniqueDomesticRoutes[i])
      );
    }
    return destinationAirportArr;
  },

  getDestinationMarkers(destinations) {
    let coordinate_list = [];

    for (let i = 0; i < destinations.length; i++) {
      let destination_marker = {
        lng: null,
        lat: null,
      };

      destination_marker.lng = destinations[i].longitude;
      destination_marker.lat = destinations[i].latitude;
      coordinate_list.push(destination_marker);
    }
    return coordinate_list;
  },

  extractData(airport) {
   
    let data = {
      base_obj: null,
      base_marker: null,
      destinations: [],
      destination_markers: [],
    };

    data.base_obj = airport;
    data.base_marker = {
      lng: airport.longitude,
      lat: airport.latitude,
    };
    sendWebServiceRequestForRoutes(airport.airportId, "getRoutes"); // calls showAirportNames

    setTimeout(() => {
      console.log(this.uniqueDomesticRoutes);  
      let destinations = this.getDestinationAirports(this.uniqueDomesticRoutes);
      data.destinations = destinations;
      data.destination_markers = this.getDestinationMarkers(destinations);

      // console.log(data);
      session.addTour(data);
    //   console.log(user);
    }, 1500);
  },
};

//! First Executions
utility.hideAirportDiv();
utility.hideMapBtns();
utility.hideSummaryContainer();

let user = new User();
if (checkLSData(USER)) {
  user.fromData(retrieveLSData(USER));
}

let session = new Session(); //! Current global session object

function getAirports(airportObjectList) {
  utility.showAirPortNames(airportObjectList);
}

function getRoutes(routeObjectList) {
  // console.log(utility.filterUniqueDomesticRoutes(routeObjectList));
  
  utility.uniqueDomesticRoutes = utility.filterUniqueDomesticRoutes(routeObjectList); 
  console.log("filtered list")
  console.log( utility.uniqueDomesticRoutes);
    
  // console.log(utility.uniqueDomesticRoutes);
}

document.querySelector(".confirm-country").addEventListener("click", () => {
  let selected_country = document.getElementById("country-select").value;
  let selected_date = document.getElementById("date").value;
  let selected_time = document.getElementById("time").value;

  session.date = new Date(`${selected_date}T${selected_time}`);
  session.country = selected_country;

  //! Check
  // user.addSession(session); //? Should I add the session here?

  sendWebServiceRequestForAirports(session.country, "getAirports"); // calls showAirportNames

  utility.showAirportDiv();
});

document.querySelector(".confirm-airport").addEventListener("click", () => {
  let selected_airport = utility.getAirportObj();
  utility.extractData(selected_airport);
});

document.querySelector(".undo-btn").addEventListener("click", () => {

  session.popLastData(); 
});

document.querySelector(".map-confirm-btn").addEventListener("click", () => {

  
  utility.showSummary();
});

document.querySelector(".cancel").addEventListener("click", () => {

  window.location = "index.html";
});

document.querySelector(".save-exit").addEventListener("click", () => {

  user.addSession(session);
  let index = user.sessions.length-1;
  updateLSData(INDEX, index);
  updateLSData(USER, user);
  window.location = "detailed-info.html";
});