'use strict'

// using a Promises-wrapped version of sqlite3
const db = require('./sqlWrap');

// SQL commands for ActivityTable
const insertDB = "insert into ActivityTable (activity, date, amount) values (?,?,?)"
const getOneDB = "select * from ActivityTable where activity = ? and date = ? and amount = ?";
const allDB = "select * from ActivityTable where activity = ?";

async function testDB () {

  // for testing, always use today's date
  let today = new Date();
  today.setHours(0, 0, 0, 0)
  today = today.getTime();


  // all DB commands are called using await

  // empty out database - probably you don't want to do this in your program
  await db.deleteEverything();
  
  const DATEOFFSET = 1000*24*3600;

  //await db.run(insertDB,["Run",today - DATEOFFSET*1,-1]);
  await db.run(insertDB,["Basketball",today-DATEOFFSET*3,2]); 
  //await db.run(insertDB,["Swim",today-DATEOFFSET*1,-1]);
 // await db.run(insertDB,["Basketball",today-DATEOFFSET*1,-1]);
  /*(await db.run(insertDB,["Yoga",today,-1]);
  await db.run(insertDB,["Soccer",today+DATEOFFSET*3,-1]);
  await db.run(insertDB,["Basketball",today - DATEOFFSET*3,2]);
  //await db.run(insertDB,["Basketball",today-DATEOFFSET*1,3]);
  await db.run(insertDB,["Yoga",today-DATEOFFSET*2,4]);
  await db.run(insertDB,["Bike",today-DATEOFFSET*1,4]);
  await db.run(insertDB,["Swim",today-DATEOFFSET*1,2]);
  await db.run(insertDB,["Bike",today-DATEOFFSET*7,4]);*/
  
  
  console.log("inserted two items");

  // look at the item we just inserted
  let result = await db.get(getOneDB,["running",today,2.4]);
  console.log(result);

  // get multiple items as a list
  result = await db.all(allDB);
  console.log(result);

}

async function inputData(postData) {
  let activityData = await JSON.parse(postData);
  await db.run(insertDB, [activityData.activity, activityData.date, activityData.amount]);
}

async function getRecentWeeklyActivity(postData) {
  /*
  let result = await db.all("select * from ActivityTable");
  console.log(result);
  */
  const WEEKINMILLISECONDS = 1000*60*60*24*6;
  let activityData = await JSON.parse(postData);
  console.log("length of activites is :", activityData.activity.length);
  if (activityData.activity.length == 0){
    //change the request for activity
    let activity =  await db.get("select * from ActivityTable ORDER BY rowIdNum DESC LIMIT 1");
    if (activity == undefined){
      console.log("There is no activity");
      return JSON.stringify({"weeklyActivities": [], "activity": "Walk"});
    }

    let weeklyActivities = await db.all("select * from ActivityTable WHERE (amount > 0) AND (activity = ?) AND date BETWEEN ? AND ?", [activity.activity ,activityData.date - WEEKINMILLISECONDS, activityData.date]);
    console.log("I am recieving the date xx to the date xx",activityData.date - WEEKINMILLISECONDS, activityData.date )
    let obj = {"weeklyActivities": weeklyActivities, "activity":activity};
    console.log ("fsdf ", obj);
    return await JSON.stringify(obj);

  } else {
    console.log("Am I really getting here?");
    let weeklyActivities = await db.all("select * from ActivityTable WHERE amount > 0 AND activity = ? AND date BETWEEN ? AND ?", [activityData.activity, activityData.date - WEEKINMILLISECONDS, activityData.date]);
    let obj = {"weeklyActivities": weeklyActivities, "activity":activityData.activity};
    return await JSON.stringify(obj);
  }
}

async function getRecentActivity() {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  today = today.getTime();
  
  let recentActivity = await db.get("select * from ActivityTable WHERE date < ? ORDER BY date DESC", [today]);
  
  // could have just returned recentActivity
  if (recentActivity != undefined) {
    await db.all("delete from ActivityTable WHERE date < ? AND amount = -1 AND rowIdNum != ?", [today, recentActivity.rowIdNum]);
    recentActivity = await JSON.stringify(
      { "activity": recentActivity.activity,
        "date": recentActivity.date,
        "amount": recentActivity.amount
    });
  }
  console.log("Server sends: ",recentActivity);
  return recentActivity;
}

module.exports.testDB = testDB;
module.exports.inputData = inputData;
module.exports.getRecentActivity = getRecentActivity;
module.exports.getRecentWeeklyActivity = getRecentWeeklyActivity;
