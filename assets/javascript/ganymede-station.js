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

// Using Moment.js to set up scheduler
var expanseTime;
var now = setInterval(timeStamp, 1000);

// Roll time in the jumbotron
function timeStamp() {
  currentTime = moment();
  expanseTime = moment(currentTime)
    .add(340, "year")
    .format("MMMM Do YYYY, HH:mm:ss");
  $("#time-clock").html(expanseTime);
}

// variables for temporary schedule info
var vesssel = "";
var vDestination = "";
var vFirstArrival = "";
var vFrequency = "";
var nArrival = "";
var tRemaining = "";

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
    // nextArrival: nArrival,
    // timeRemaining: tRemaining
  });
  clearForm();
});

// update display data once every minute // needs tweaking to work properly
// var update = setInterval(autoUpdate, 1000 * 60);

// function autoUpdate() {
// display existing data in schdule display
database.ref().on("child_added", function(snapshot) {
  var entry = snapshot.val();

  var firstArrival = entry.firstArrival;
  console.log(`Ship's first arrival is at ${firstArrival}`);

  var convertedFirstArrival = moment(firstArrival, "HH:mm").subtract(1, "year");

  var frequency = moment.duration(entry.frequency).asMinutes();
  // var frequency = moment.duration(entry.frequency);
  console.log(`Ship arrives every ${frequency} minutes.`);

  var thisMoment = moment();
  console.log(`Current Station Time: ${moment(thisMoment).format("HH:mm")}`);

  var diff = moment().diff(moment(convertedFirstArrival), "minutes");
  console.log(`Time Difference: ${diff}`);

  var remainder = diff % frequency;
  console.log(`Remainder: ${remainder}`);

  var nextArrivalMinutes = frequency - remainder;
  console.log(`Minutes Until Next Arrival: ${nextArrivalMinutes}`);

  var nextArrivalHours = hhmm(nextArrivalMinutes);
  console.log(`Ship's Next Arrival in: ${nextArrivalHours}`);

  var nextArrivalTime = moment().add(nextArrivalMinutes, "minutes");
  console.log(
    `Ship's Next Arrival at: ${moment(nextArrivalTime).format("HH:mm")}`
  );

  // Display updated data
  var nRow = $("<tr>");
  var nCell = $(
    `<td>${entry.vessel}</td>
       <td>${entry.destination}</td>
       <td>${entry.frequency}</td>
       <td>${moment(nextArrivalTime).format("HH:mm")}</td>
       <td>${nextArrivalHours}</td>
      `
  );

  $("#entries").append(nRow);
  $(nRow).append(nCell);
});
// } // closes the autoUpdate function

// functions to format minutes to hh:mm // surprised that moment doesn't handle this natively!
function pad(num) {
  return ("0" + num).slice(-2);
}

function hhmm(minutes) {
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return pad(hours) + ":" + pad(minutes);
}

// var myMinutes = 121;
// console.log(hhmm(myMinutes));
