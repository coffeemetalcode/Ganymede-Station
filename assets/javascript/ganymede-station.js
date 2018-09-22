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
var factor = 153750240000012;

// Using Moment.js to set up scheduler

// construct time display
var time = moment();
var currentMonth = moment(time).format("MMMM");
var currentWeekDay = moment(time).format("dddd");
var currentDay = moment(time).format("Do");
var currentYear = moment(time).format("YYYY");
var expanseYear = parseInt(currentYear) + 340;
var expanseDate =
  currentWeekDay + ", " + currentMonth + " " + currentDay + " " + expanseYear;
var currentTime = moment(time).format("HH:mm:ss");
var expanseDateTime = expanseDate + ", " + currentTime;

console.log("Current Date: " + expanseDateTime);
console.log("Current Time: " + currentTime);

var second;

function now() {
  var second = setInterval(timeClock, 1000);
}

function timeClock() {
  $("#time-clock").text(expanseDateTime);
}

$(document).ready(function() {
  now();
});

// having trouble getting the below to work
// now = function() {
//   setInterval($("#time-clock").text(expanseDateTime), 1000);
// };

// now();

// $("#time-clock").text(expanseDateTime);

$("#submit").on("click", function() {
  // clear form
  function clearForm() {
    $("#v-name").val("");
    $("#v-destination").val("");
    $("#v-first-arrival").val("");
    $("#v-frequency").val("");
  }

  // store inputs
  vessel = $("#v-name")
    .val()
    .trim();
  vDestination = $("#v-destination")
    .val()
    .trim();
  vFirstArrival = $("#v-first-arrival")
    .val()
    .trim();
  vFrequency = $("#v-frequency")
    .val()
    .trim();
  // nArrival = vFirstArrival + vFrequency; I'll need moment.js to do these calculations

  console.log("New Vessel Name: " + vessel);
  console.log("New Destination: " + vDestination);
  console.log("New First Arrival: " + vFirstArrival);
  console.log("New Frequency: " + vFrequency);

  // put input values into database
  database.ref().push({
    vessel: vessel,
    destination: vDestination,
    firstArrival: vFirstArrival,
    frequency: vFrequency
  });
  clearForm();
});

// display existing data in schdule display
database.ref().on("child_added", function(snapshot) {
  var entry = snapshot.val();

  console.log(entry.vessel);
  console.log(entry.destination);
  console.log(entry.firstArrival);
  console.log(entry.frequency);

  // Time Administration
  var sFrequency = entry.frequency;
  var cFirstArrival = moment(entry.firstArrival, "hh:mm").subtract(1, "years");
  console.log("first: " + moment(cFirstArrival).format("HH:mm"));
  console.log("first: " + cFirstArrival);
  currentTime = moment();
  diffTime = moment().diff(moment(cFirstArrival), "minutes");
  remainder = diffTime % sFrequency;
  tRemaining = sFrequency - remainder;
  fRemaining = moment(tRemaining, "HH:mm").format("HH:mm");
  console.log("remaining: " + fRemaining);
  nArrival = moment().add(tRemaining, "minutes");
  fArrival = moment(nArrival).format("HH:mm");
  console.log("next: " + moment(fArrival, "HH:mm").format("HH:mm"));


  // Display updated data
  var nRow = $("<tr>");
  var nCell = $(
    `<td>${entry.vessel}</td>
     <td>${entry.destination}</td>
     <td>${sFrequency}</td>
     <td>${fArrival}</td>
     <td>${fRemaining}</td>
     `
  );

  $("#entries").append(nRow);
  $(nRow).append(nCell);
});

// Still searching for the moment.js love. And, really would like to have the time in jubotron automatically tick on the second.