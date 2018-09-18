// Initialize Firebase
var config = {
  apiKey: "AIzaSyBr7PYXR84QY9No_Dh15D7hWWY2BH7CH9A",
  authDomain: "ganymede-station.firebaseapp.com",
  databaseURL: "https://ganymede-station.firebaseio.com",
  projectId: "ganymede-station",
  storageBucket: "ganymede-station.appspot.com",
  messagingSenderId: "918415747120"
};
firebase.initializeApp(config);

// set variable to refernce firebase
var database = firebase.database();

// variables for temporary schedule info
var vesssel = "";
var vDestination = "";
var vFirstArrival = "";
var vFrequency = "";
var nArrival = "";
var tRemaining = "";

$("#submit").on("click", function () {

  // clear form
  function clearForm(){
    $("#v-name").val("");
    $("#v-destination").val("");
    $("#v-first-arrival").val("");
    $("#v-frequency").val("");
  }

  // store inputs
  vessel = $("#v-name").val().trim();
  vDestination = $("#v-destination").val().trim();
  vFirstArrival = $("#v-first-arrival").val().trim();
  vFrequency = $("#v-frequency").val().trim();
  // nArrival = vFirstArrival + vFrequency; I'll need moment.js to do these calculations

  console.log(vessel);
  console.log(vDestination);
  console.log(vFirstArrival);
  console.log(vFrequency);

  // put input values into database
  database.ref().push({
    vessel: vessel,
    destination: vDestination,
    firstArrival: vFirstArrival,
    frequency: vFrequency
  });
  clearForm();
});