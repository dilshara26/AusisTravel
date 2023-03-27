"use strict";

const USERS = "users_key";
const USER = "user_key";
const INDEX = "index_key";

let user = new User();
if (checkLSData(USER)) {
  user.fromData(retrieveLSData(USER));
}

console.log(user);

let upcoming_container = document.querySelector(".upcoming-trip-div");
let completed_container = document.querySelector(".completed-trips-div");

let present = new Date();

let upcoming_divs = "";
let completed_divs = "";

for (let i = 0; i < user.sessions.length; i++) {
  console.log(user.sessions[i]);

  let start = user.sessions[i].base_airports[0].name;
  let end = user.sessions[i].base_airports.at(-1).name;

  let date = user.sessions[i].date.toLocaleDateString();
  let time = user.sessions[i].date.toLocaleTimeString();

  if (present.getTime() < user.sessions[i].date.getTime()) {
    console.log("upcoming");

    let upcoming_div = `<div class="demo-card-event mdl-card mdl-shadow--2dp trips">
    <div class="mdl-card__title mdl-card--expand">
      <h4>
        ${start}<br />
        ${end}<br />
        ${date}<br />
        ${time}
      </h4>
    </div>
    <div class="mdl-card__actions mdl-card--border">
      <a
        class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="showTripDetails(${i})"
      >
        View Trip
      </a>
      <div class="mdl-layout-spacer"></div>
      <i class="material-icons">event</i>
    </div>
  </div>`;

    upcoming_divs += upcoming_div;
  } else {
    console.log("completed");

    let completed_div = `<div class="demo-card-event mdl-card mdl-shadow--2dp trips">
    <div class="mdl-card__title mdl-card--expand">
      <h4>
        ${start}<br />
        ${end}<br />
        ${date}<br />
        ${time}
      </h4>
    </div>
    <div class="mdl-card__actions mdl-card--border">
      <a
        class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="showTripDetails(${i})"
      >
        View Trip
      </a>
      <div class="mdl-layout-spacer"></div>
      <i class="material-icons">event</i>
    </div>
  </div>`;

    completed_divs += completed_div;
  }
}

upcoming_container.innerHTML = upcoming_divs;
completed_container.innerHTML = completed_divs;

function showTripDetails(index) {
  console.log(user.sessions[index]);
  updateLSData(INDEX, index);
  updateLSData(USER, user);
  window.location = "detailed-info.html";
}
