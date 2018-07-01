$(document).ready(function (){
    //firebase configuration
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
    
    //add train click function, logs to database
    $("#add-train").on("click",function(event){
        event.preventDefault();
        name =$("#name-input").val().trim();
        destination =$("#destination-input").val().trim();
        first =$("#first-input").val().trim();
        frequency =$("#frequency-input").val().trim();
        
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
        var printTrain = moment(nextTrain).format("hh:mm");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        console.log("minutes away " + tMinutesTillTrain)
        
        database.ref().push({
            DbName: name,
            DbDestination: destination,
            DbFirst: first,
            DbFrequency: frequency,
            DbArrivalMinute: tMinutesTillTrain,
            DbMinutes: printTrain,
            dateAdded:firebase.database.ServerValue.TIMESTAMP
        });

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#first-input").val("");
        $("#frequency-input").val("");
    
    
        //references Database, upon reload append the last child, arrival time changes due to change in actual time
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
            


            tdName.text(snapshot.val().DbName);
            tdDestination.text(snapshot.val().DbDestination);
            tdFrequency.text(snapshot.val().DbFrequency);
            tdNextTrain.text(snapshot.val().DbMinutes);
            tdMinutesAway.text(snapshot.val().DbArrivalMinute)
            console.log("Minutes away: " + tMinutesTillTrain)
            
            //append to the table
            tableRow.append(tdName);
            tableRow.append(tdDestination);
            tableRow.append(tdFrequency);
            tableRow.append(tdNextTrain);
            tableRow.append(tdMinutesAway);
            
            //append the rows to the table in html
            $("#tableBody").append(tableRow);
        
        });  
        tdNextTrain.empty();
        tdMinutesAway.empty()
    });
});//end doc ready
    
    
    
    