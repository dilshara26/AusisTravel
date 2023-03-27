"use strict";

const USERS = "users_key";
const USER = "user_key";
const INDEX = "index_key";

let user = new User();
if (checkLSData(USER)) {
  user.fromData(retrieveLSData(USER));
}

console.log(user);

let index = 0;
if (checkLSData(INDEX)) {
  index = retrieveLSData(INDEX);
}

let currentSession = user.getSession(index);

currentSession.showSummary();
currentSession.showBasesMap(currentSession.getPoints());

let button_container = document.querySelector(".button-tab");

document.querySelector(".save-exit").addEventListener("click", () => {
  window.location = "view.html";
});

let present = new Date();

if (present.getTime() < currentSession.date.getTime()) {
  button_container.insertAdjacentHTML('beforeend',`<button type="button" class="trip-save mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect cancel-exit" style="color: rgba(63,99,252,1); background-color:rgb(255, 255, 255); margin-left:20px;  font-weight: 600; border-radius: 15px;">
  Delete and Exit
</button>`);

  document.querySelector(".cancel-exit").addEventListener("click", () => {
    user.sessions.splice(index, 1);
    updateLSData(USER, user);
    window.location = "index.html";
  });
}
