$(document).ready(function (){
    var config = {
    apiKey: "AIzaSyBqXOwlqTSlCHVo3MG4QzAdD0BON0EjVlc",
    authDomain: "trainschedule-7fa1c.firebaseapp.com",
    databaseURL: "https://trainschedule-7fa1c.firebaseio.com",
    projectId: "trainschedule-7fa1c",
    storageBucket: "trainschedule-7fa1c.appspot.com",
    messagingSenderId: "630397453957"
  };
  firebase.initializeApp(config);
    
    var database= firebase.database();
    
    //values 
    var name ="";
    var destination = "";
    var first = "";
    var frequency ="";
    var nextTrain = "";
    
    
    $("#add-train").on("click",function(event){
        event.preventDefault();
        name =$("#name-input").val().trim();
        destination =$("#destination-input").val().trim();
        first =$("#first-input").val().trim();
        frequency =$("#frequency-input").val().trim();
        
        
        database.ref().push({
            DbName: name,
            DbDestination: destination,
            DbFirst: first,
            DbFrequency: frequency,
            dateAdded:firebase.database.ServerValue.TIMESTAMP
        });

    
    
    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
        
        var tableRow = $("<tr>");
        var tdName = $("<td>");
        tdName.addClass("displayName");
        var tdDestination = $("<td>");
        tdDestination.addClass("displayDestination");
        var tdFrequency = $("<td>");
        tdFrequency.addClass("displayFrequency");
        var tdNextTrain = $("<td>");
        tdNextTrain.addClass("displayNextTrain");
        var tdMinutesAway = $("<td>");
        tdMinutesAway.addClass("displayNextTrain");
        
        // time logic
        var tFrequency = frequency ;
        console.log(frequency)
        var firstTime = first;
        console.log(firstTime)
        var currentTime = moment();
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log(diffTime)
        var tRemainder = diffTime % tFrequency;
        console.log("time remainder: " + tRemainder);
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        
        tdName.text(snapshot.val().DbName);
        tdDestination.text(snapshot.val().DbDestination);
        tdFrequency.text(snapshot.val().DbFrequency);
        tdNextTrain.text(moment(nextTrain).format("hh:mm"));
        tdMinutesAway.text(tMinutesTillTrain)
        console.log("Minutes away: " + tMinutesTillTrain)
        
        //append to the table
        tableRow.append(tdName);
        tableRow.append(tdDestination);
        tableRow.append(tdFrequency);
        tableRow.append(tdNextTrain);
        tableRow.append(tdMinutesAway);
        
        //append the rows to the table in html
        $("#tableBody").append(tableRow)
        })  

    });
    
    
    
})//end doc ready
    
    
    
    