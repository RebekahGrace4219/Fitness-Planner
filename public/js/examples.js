const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

//import barchart from './barchart.js'

barchart.init('chart', 350, 200);
//Lines 2-11 are borrowed from the student example on replit for ECS 162. 
async function sendPostRequest(url, data) {
  console.log(data);
  console.log("Post Request sending");
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });
  return response.text();
}


async function getRequest(url) {
  let response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.text();
}

//Checks if a date is in the past
function pastDate(givenDate) {
  let today = new Date();
  if (givenDate.substr(0, 4) < today.getFullYear()) {
    return true;
  }
  else if (givenDate.substr(0, 4) == today.getFullYear()) {
    if (givenDate.substr(5, 2) < (today.getMonth() + 1)) {
      return true;
    }
    else if (givenDate.substr(5, 2) == today.getMonth() + 1) {
      if (givenDate.substr(8, 2) <= today.getDate()) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

//Check if a date is in the past
function futureDate(givenDate) {
  let today = new Date();
  //If it fails the past date, it must be in the future
  if (!pastDate(givenDate)) {
    return true;
  }
  //It could still be today
  if (today.getFullYear() == givenDate.substr(0, 4)) {
    if (today.getMonth() + 1 == givenDate.substr(5, 2)) {
      if (today.getDate() == givenDate.substr(8, 2)) {
        return true;
      }
    }
  }

  //If not, definitely in the past
  return false;
}

// When the pastActiviy Button is clicked, it should disappear and invite the data information set 
let pastActivityAdd = function() {
  document.getElementById("pastActivityAddNew").style.display = "none";
  document.getElementById("pastText").style.display = "none";
  let all = document.getElementsByClassName("pastInputInfo");
  for (let i = 0; i < all.length; i++) {
    all[i].style.display = "block";
  }
}
document.getElementById("pastActivityAddNew").addEventListener("click", pastActivityAdd);



document.getElementById("futureActivityAddNew").addEventListener("click", futureActivityAdd)
// When the futureActivity Button is clicked, it should disappear and invite the data information set
function futureActivityAdd() {
  document.getElementById("futureActivityAddNew").style.display = "none";
  let all = document.getElementsByClassName("futureInputInfo");
  document.getElementById("textFuture").style.display = "none";
  for (let i = 0; i < all.length; i++) {
    all[i].style.display = "block";
  }
}

// When the submitPast Button is clicked, the input must be checked
// Scenario 1: it is not clean, and an alert is set.  
// Scenario 2: it is clean and we switch to the add new pastActivity
document.getElementById("pastActivityButton").addEventListener("click", submitPast);
function submitPast() {
  let givenDate = document.getElementById("pastActivityDate").value;
  let valueNumber = document.getElementById("pastActivityNumber").value;
  //If the date is past, let it through

  if (givenDate == "") {
    alert("Hello, please fill in a valid date.");
    return;
  }
  else if (!pastDate(givenDate)) {
    alert("Hello, please fill in a valid date.");
    return;
  }
  else if (valueNumber <= 0) {
    alert("Hello, please fill in a valid distance/time.");
    return;
  }
  //Turn off the buttons that need to disappear
  let all = document.getElementsByClassName("pastInputInfo");
  for (let i = 0; i < all.length; i++) {
    all[i].style.display = "none";
  }
  //Fill the display that needs to appear
  let sport = document.getElementById("pastActivityChoice").value;
  let number = document.getElementById("pastActivityNumber").value;
  let unit = document.getElementById("pastActivityUnits").value;

  givenDate = new Date(Number(givenDate.substr(0, 4)), Number(givenDate.substr(5, 2)) - 1, Number(givenDate.substr(8, 2))).getTime();
  let timeOff = new Date();
  let timezoneOffset = timeOff.getTimezoneOffset();
  console.log("I am reading my time zone as: ", givenDate);
  givenDate = givenDate - timezoneOffset * 60 * 1000;
  console.log("I am reading the submittal as: ", givenDate);

  let jsonT = { "activity": sport, "amount": number, "date": givenDate };
  let data = JSON.stringify(jsonT);


  //Print to the console the information it wants
  console.log("Past Activity Post:");

  //Lines 117-124 are borrowed from the student example on replit for ECS 162
  sendPostRequest("/store", data)
    .then(function(data) {
      console.log("got back the following string");
      console.log(data);
    })
    .catch(function(error) {
      console.error('Error:', error);
    });


  if (unit == "") {
    unit = "km";
  }

  let val = "";
  //Control for having only 1 of something
  if (number == 1) {
    if (unit == "Laps") {
      val = sport + " for " + number + " Lap";
    }
    else if (unit == "Minutes") {
      val = sport + " for " + number + " Minute";
    }
    else {
      val = sport + " for " + number + " km";
    }
  }
  else {
    val = sport + " for " + number + " " + unit;
  }
  document.getElementById("pastSpan").innerText = val;
  //Turn on the display that needs to appear
  document.getElementById("pastText").style.display = "block";
  document.getElementById("pastActivityAddNew").style.display = "block";
}

// When the submitFuture Button is clicked, the input must be checked
// Scenario 1: it is not clean, and an alert is set.  
// Scenario 2: it is clean and we switch to the add new futureActivity
document.getElementById("futureActivityButton").addEventListener("click", submitFuture);
function submitFuture() {
  let givenDate = document.getElementById("futureActivityDate").value;

  if (givenDate == "") {
    alert("Hello, please fill in a valid date");
    return;
  }
  else if (!futureDate(givenDate)) {
    alert("Hello, please fill in a valid date");
    return;
  }

  //change givenDate to a time in milliseconds, transfer the meet UTC
  givenDate = new Date(Number(givenDate.substr(0, 4)), Number(givenDate.substr(5, 2)) - 1, Number(givenDate.substr(8, 2))).getTime();

  let timeZ = new Date();
  let timezoneOffset = timeZ.getTimezoneOffset();
  givenDate = givenDate - timezoneOffset * 60 * 1000;

  document.getElementById("textFuture").style.display = "block";
  document.getElementById("futureActivityAddNew").style.display = "block";

  sport = document.getElementById("futureActivityChoice").value;
  date = document.getElementById("futureActivityDate").value;

  let jsonT = { "activity": sport, "amount": -1, "date": givenDate };
  let data = JSON.stringify(jsonT);


  //Print to the console the information it wants
  console.log("Future Plans Post:");
  //Lines 182-189 are borrowed from the student example on replit for ECS 162
  sendPostRequest("/store", data)
    .then(function(data) {
      console.log("got back the following string");
      console.log(data);
    })
    .catch(function(error) {
      console.error('Error:', error);
    });



  //Change the date to the desired format
  newDate = date.substr(5, 2) + "/" + date.substr(8, 2) + "/" + date.substr(2, 2);

  document.getElementById("futureUserInput").innerText = sport + " on " + newDate;
  let all = document.getElementsByClassName("futureInputInfo");
  for (let i = 0; i < all.length; i++) {
    all[i].style.display = "none";
  }
}

// When the pastActivity dropdown is selected, the units must update in turn
document.getElementById("pastActivityChoice").addEventListener("change", dropdownSelect);
function dropdownSelect() {
  let choice = document.getElementById("pastActivityChoice").value;
  if (choice == "Walk" || choice == "Run" || choice == "Bike") {
    document.getElementById("pastActivityUnits").value = "km";
  }
  else if (choice == "Swim") {
    document.getElementById("pastActivityUnits").value = "Laps";
  }
  else if (choice == "Yoga" || choice == "Soccer" || choice == "Basketball") {
    document.getElementById("pastActivityUnits").value = "Minutes";
  }
}

//When the no button is clicked, close the reminder box
document.getElementById("noButton").addEventListener("click", noButtonClick)
function noButtonClick() {
  let reminderBox = document.getElementById("reminderBox");
  reminderBox.style.display = "none";
}

//Return UTC Midnight
function todayAtMidnight() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  //timezone offset 
  let timeZoneOffset = today.getTimezoneOffset();
  //The date should be today in the UTC at midnight - shift everything over to UTC to match server
  return today.getTime() - timeZoneOffset * 60 * 1000;
}

//Determine whether a date in milliseconds happened yesterday
//If not, give the day of the week it happened on
function dayName(date) {

  //Get Today's midnight in Client timezone
  let comparisonTime = new Date();
  comparisonTime.setHours(0, 0, 0, 0);
  comparisonTime = comparisonTime.getTime();

  //Convert incoming date from UTC to client timezone
  let dateT = new Date();
  let timeZoneOffset = dateT.getTimezoneOffset();
  let temp = date;
  console.log(timeZoneOffset);
  temp = temp + timeZoneOffset * 60 * 1000;

  console.log(comparisonTime, temp);

  //If date is less than comparison time, but not more than a day away
  if (comparisonTime - temp > 0 && comparisonTime - temp <= MILLISECONDS_IN_DAY) {
    //If the milliseconds are too close, it happened yesterday
    return "yesterday";
  }
  else {
    let index = new Date(temp).getDay();
    let arr = ["on Sunday", "on Monday", "on Tuesday", "on Wednesday", "on Thursday", "on Friday", "on Saturday"];
    return arr[index];
  }
}

//When the yes button is clicked, gather the relevant information and prefill it out
document.getElementById("yesButton").addEventListener("click", yesButtonClick);

function yesButtonClick() {
  //First move from the Add New Activity Button to the display of all the other items
  document.getElementById("pastActivityAddNew").style.display = "none";
  document.getElementById("pastText").style.display = "none";

  let all = document.getElementsByClassName("pastInputInfo");
  for (let i = 0; i < all.length; i++) {
    all[i].style.display = "block";
  }

  let yesActivity = globalVarForReminder;
  document.getElementById("pastActivityChoice").value = yesActivity.activity;

  //Build the date string
  let dateTypes = new Date(yesActivity.date);
  dateTypes = new Date(dateTypes.getTime() + dateTypes.getTimezoneOffset()*60*1000);
  let dateString = dateTypes.getFullYear() + "-";

  if ((dateTypes.getMonth() + 1) < 10) {
    dateString += "0" + (dateTypes.getMonth() + 1) + "-";
  }
  else {
    dateString += (dateTypes.getMonth() + 1) + "-";
  }

  if ((dateTypes.getDate()) < 10) {
    dateString += "0" + dateTypes.getDate();
  }
  else {
    dateString += dateTypes.getDate();
  }

  document.getElementById("pastActivityDate").value = dateString;
}

function dateWithinTime(activityObj) {
  //Get Today's midnight in Client timezone
  let comparisonTime = new Date();
  comparisonTime.setHours(0, 0, 0, 0);
  comparisonTime = comparisonTime.getTime();

  
  //Convert incoming date from UTC to client timezone
  let dateT = new Date();
  let timeZoneOffset = dateT.getTimezoneOffset();
  let time = activityObj.date;
  time = time + timeZoneOffset * 60 * 1000;

  let timeDifference = comparisonTime - time;
  console.log("Date within time: ", comparisonTime, time);
  //The date is at least yesterday, but could also be up to six days prior
  if (timeDifference > 0 && timeDifference <= 6 * MILLISECONDS_IN_DAY) {
    return true;
  }
  return false;
}

//Establish the dark blue reminder box
function formReminder() {
  console.log("Empty", globalVarForReminder);
  let reminderBox = document.getElementById("reminderBox");

  if (globalVarForReminder == "") {
    //If no value returned at all
    reminderBox.style.display = "none";
  }
  else if (!dateWithinTime(globalVarForReminder)) {
    //If the value is not from yesterday to seven days prior
    reminderBox.style.display = "none";
  }
  else {
    //Else, the date is in fact valid, so display the information
    reminderBox.style.display = "flex";
    let questionSpan = document.getElementById("questionSpan");

    let activityReminder = globalVarForReminder.activity;
    let dateReminder = globalVarForReminder.date;
    let dayNameReminder = dayName(dateReminder);

    if (activityReminder.toLowerCase() == "soccer" || activityReminder.toLowerCase() == "basketball") {
      questionSpan.innerText = "play " + activityReminder + " " + dayNameReminder;
    }
    else if (activityReminder.toLowerCase() == "yoga") {
      questionSpan.innerText = "do " + activityReminder + " " + dayNameReminder;
    }
    else {
      questionSpan.innerText = activityReminder + " " + dayNameReminder;
    }

  }
}
var globalVarForReminder = "";

function start_up() {
  getRequest('/reminder').then(function(activityObj2) {
    if (activityObj2.length != 0){
      console.log("here");
      globalVarForReminder = JSON.parse(activityObj2);
      console.log(typeof globalVarForReminder);
      formReminder();
    }
  }).catch(function(error) {
    console.error('Error:', error);
  });

}
start_up();

/*Find the object that should be given in the reminder*/

function chartYAxis(activity) {
  if (activity.toLowerCase() == "walk") {
    return "Kilometers Walked";
  }
  else if (activity.toLowerCase() == "run") {
    return "Kilometers Run";
  }
  else if (activity.toLowerCase() == "swim") {
    return "Laps Swam";
  }
  else if (activity.toLowerCase() == "bike") {
    return "Kilometers Biked";
  }
  else if (activity.toLowerCase() == "yoga") {
    return "Minutes of Yoga";
  }
  else if (activity.toLowerCase() == "soccer") {
    return "Minutes of Soccer";
  }
  else if (activity.toLowerCase() == "basketball") {
    return "Minutes of Basketball";
  }
  else {
    return "Kilometers Run";
  }

}

document.getElementById("viewProgress").addEventListener("click", viewProgress);

//Returns the dataset to be used by the chart
function viewProgressReaction(chartData) {
  console.log(chartData);
  let chartDataObj = JSON.parse(chartData);


  console.log("HERE 1");

  if (chartDataObj.message == "Your input is too late") {
    alert("Your inputed date is too late. Please choose a date yesterday or earlier.");
    return -1;
  }
  else if (chartDataObj.message == "Invalid Input Type") {
    alert("You have given invalid input. Please check again.");
    return -1;
  }
  else if (chartDataObj.message == "No data") {
    //Keep the UTC date, but make sure its midnight
    let activity = chartDataObj.activity;
    if(typeof activity != "string"){
      activity = activity.activity;
    }
    let date = chartDataObj.date;
    console.log("The week ends in this date", date);
    let setDate = new Date(date);
    setDate.setHours(0, 0, 0, 0);
    let dateMidnight = setDate.getTime();

    let yAxis = chartYAxis(activity);
    let xAxis = "Day of the Week";
    let data = [];
    for (let i = 6; i >= 0; i--) {
      let calculatedDate = dateMidnight - i * MILLISECONDS_IN_DAY;
      data.push(
        {
          "date": calculatedDate,
          "value": 0
        }
      );
    }
    console.log("I got not data and returned this", [data, yAxis, xAxis]);


     let dateObjTime = new Date();
    let timeZoneOffset = dateObjTime.getTimezoneOffset();
    //Get the data set to with bar chart
    for(let i = 0;i<7; i++){
      console.log("First date: ", data[i].date);
      data[i].date = data[i].date + ((timeZoneOffset)+24*60)*60*1000;
      console.log("Second date: ", data[i].date);

    }

    return [data, yAxis, xAxis];
  }
  else {
    console.log("HERE 3");
    //Get the activity and end date
    let activity = chartDataObj.weeklyActivity[0].activity;
    console.log(chartDataObj);
    let date = chartDataObj.date;
    
    console.log("The week ends in this date", date);
    let yAxis = chartYAxis(activity);
    let xAxis = "Day of the Week";

    let setDate = new Date(date);
    setDate.setHours(0, 0, 0, 0);
    let dateMidnight = setDate.getTime();


    //Set up the blank array
    let data = [];
    for (let i = 6; i >= 0; i--) {
      let calculatedDate = dateMidnight - i * MILLISECONDS_IN_DAY;
      data.push({
        "date": calculatedDate,
        "value": 0
      });
    }

    //For every item in the chart, figure out where its value should be added
    for (let i = 0; i < chartDataObj.weeklyActivity.length; i++) {
      newDate = new Date(chartDataObj.weeklyActivity[i].date);
      newDate.setHours(0, 0, 0, 0);
      for (let j = 0; j < 7; j++) {
        if (data[j].date == newDate.getTime()) {
          data[j].value = data[j].value + chartDataObj.weeklyActivity[i].amount;
          break;
        }
      }
    }
    console.log("I have gotten data and am returning this: ", [data, yAxis, xAxis]);
  
    let dateObjTime = new Date();
    let timeZoneOffset = dateObjTime.getTimezoneOffset();
    //Get the data set to with bar chart
    for(let i = 0;i<7; i++){
      console.log("First date: ", data[i].date);
      data[i].date = data[i].date + ((timeZoneOffset)+24*60)*60*1000;
      console.log("Second date: ", data[i].date);

    }

    return [data, yAxis, xAxis];
  }
}

function viewProgress() {
  //Find yesterday's time in UTC
  let yesterday = todayAtMidnight() - MILLISECONDS_IN_DAY ;
  let getString = "/week?date=" + yesterday + "&activity=";

  console.log("yesterday", yesterday);
  console.log(getString);

  getRequest(getString).then(function(chartData) {
    dataSet = viewProgressReaction(chartData);
    let chartDataItem = JSON.parse(chartData);
    console.log("What view progres got back: ", chartDataItem);

    overlayOn();

    //Get parent width and height:
    let parent = document.getElementById("poppup");
    let width = parent.clientWidth;
    console.log(width);
    let calclatedWidth = 0.7*width;

    let height = parent.clientHeight;
    let calculatedHeight = 0.7*height;

  if (typeof chartDataItem.activity != "string"){
    document.getElementById("selectChart").value = chartDataItem.activity.activity;
  }
  else{
    document.getElementById("selectChart").value = chartDataItem.activity;
  }
    //Parse date
    let item = new Date();
    let timeZoneOffset = item.getTimezoneOffset();
    let dateT = chartDataItem.date + timeZoneOffset*60*1000;
    let dateObj = new Date(dateT) ;
    let dateString = dateObj.getFullYear() + "-";

    if ((dateObj.getMonth() + 1) < 10) {
    dateString += "0" + (dateObj.getMonth() + 1) + "-";
    }
    else {
      dateString += (dateObj.getMonth() + 1) + "-";
    }

    if ((dateObj.getDate()) < 10) {
      dateString += "0" + dateObj.getDate();
    }
    else {
      dateString += dateObj.getDate();
    }

    document.getElementById("chartDate").value = dateString;


    console.log("Data time now: ", dataSet[0]);
    barchart.render(dataSet[0], dataSet[1], dataSet[2]);
  }).catch(function(error) {
    console.error('Error:', error);
  });
}

function overlayOn(){
  document.getElementById("popupWrapper").style.display = "block";
}

function overlayOff(){
  document.getElementById("popupWrapper").style.display = "none";
}

document.getElementById("closeButton").addEventListener("click", closeButton);

function closeButton(){
  overlayOff();
}

document.getElementById("goButton").addEventListener("click", goButton);

function goButton(){
  let date = document.getElementById("chartDate").value;
  let givenDate = new Date(Number(date.substr(0, 4)), Number(date.substr(5, 2)) - 1, Number(date.substr(8, 2)));
  let timeZoneOffset = givenDate.getTimezoneOffset();
  let utcDate = new Date(givenDate.getTime()- timeZoneOffset*60*1000);
  utcDate = utcDate.getTime();
  
  let activity = document.getElementById("selectChart").value;

  //let activity = ;
  let getString = "/week?date=" + utcDate + "&activity="+activity;
  getRequest(getString).then(function(chartData) {

    dataSet = viewProgressReaction(chartData);
    if (dataSet != -1){
      barchart.render(dataSet[0], dataSet[1], dataSet[2]);
    }
  }).catch(function(error) {
    console.error('Error:', error);
  });
}

