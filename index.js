'use strict'

// A server that uses a database. 

// express provides basic server functions
const express = require("express");

// our database operations
const dbo = require('./databaseOps');

// object that provides interface for express
const app = express();

// use this instead of the older body-parser
app.use(express.json());

// make all the files in 'public' available on the Web
app.use(express.static('public'))

// when there is nothing following the slash in the url, return the main page of the app.
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");

});

// handle pastActivity post requests
app.post('/store', function(request, response, next) {
  console.log(
    "Server recieved a post request for /store with body: ",
    request.body
  );
  let data = JSON.stringify(request.body);
  dbo.inputData(data).catch(
    function(error) {
      console.log("error:", error);
    }
  );

  response.send({
    message: "I recieved your POST request at /store"
  });
});

app.get('/reminder', function(request, response, next){
  dbo.getRecentActivity()
    .then(recentActivity => {
      response.send(recentActivity);
      console.log("sent from get", recentActivity);
    })
    .catch(
    function(error) {
      console.log("error:", error);
    }
  );
});

app.get('/week', function(request, response, next) {
  let activities = ['Walk', 'Run', 'Bike', 'Swim', 'Yoga', 'Soccer', 'Basketball'];


  let today = new Date();
  today.setHours(0, 0, 0, 0);
  today = today.getTime() - 1000*60*60*24;

  console.log("SERVER get time ", today);
  const WEEKINMILLISECONDS = 1000*60*60*24*7;

  let date = parseInt(request.query.date);
  let activity = request.query.activity;
  console.log("date is : ? activity is: ? server date : ", date, activity, today);
  if (typeof date == 'number' && ( activities.includes(activity) || typeof activity == 'string')) {
    // if the date is at least a week ago
    if(date < today) {
      console.log("My date is, my today is", date, today);
      let data = JSON.stringify({"date": date, "activity": activity});

      dbo.getRecentWeeklyActivity(data)
      .then( weeklyActivities => {
        weeklyActivities = JSON.parse(weeklyActivities);
       
        if(weeklyActivities.weeklyActivities.length == 0){
          console.log(weeklyActivities, "should be here I think?");
          let obj = {"date":date,"activity":weeklyActivities.activity, "weeklyActivity":weeklyActivities.weeklyActivities, "message":"No data"}
          response.send(obj);
          console.log("sent week:", obj);
        }
        else{
          let obj = {"date":date,"activity": weeklyActivities.activity, "weeklyActivity":weeklyActivities.weeklyActivities, "message":"all Good"};
          response.send(obj);
          console.log("sent week:", obj);
        }
      
      })
      .catch(
        function(error) {
        console.log("error:", error);
        }
      );
      // ask server for activity
    } else {
      response.send({
        "message": "Your input is too late"
      });
    }
  } else {
      response.send({
        "message": "Invalid input type"
      });
    }
});


// This is where the server recieves and responds to POST requests
app.post('*', function(request, response, next) {
  console.log("Server recieved a post request at", request.url);
  // console.log("body",request.body);
  response.send({message: "I got your POST request"});
});

app.all("*", function(request,response)
  {response.send("File not fount");});


// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});


// call the async test function for the database
// this is an example showing how the database is used
// you will eventually delete this call.
/*
dbo.testDB().catch(
  function (error) {
    console.log("error:",error);}
);*/


