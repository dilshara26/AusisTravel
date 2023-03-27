"use strict";

const USERS = 'users_key';
const USER = 'user_key';
let users = new Users();

if (checkLSData(USERS)) {
    users.fromData(retrieveLSData(USERS));
}

let signInBTN = document.querySelector('.sign-in');
let username_input = document.querySelector('#username');
let password_input = document.querySelector('#password');

signInBTN.addEventListener('click', function() {
    
  if (username.value !="" && password.value !="" ) {
    
    let user = new User(username_input.value, password_input.value);
    if (users.newUser(user)) {
        users.addUser(user);
    }else{
        user = users.getUserByUsername(username_input.value);
    }
    updateLSData(USER, user);
    updateLSData(USERS, users);
    
    window.location = "../html/index.html"
  }
  else{
      alert("Please enter your username and password!");
  }
});

