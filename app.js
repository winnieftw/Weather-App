// Import libraries
const express = require("express");
const path = require("path");
const fs = require("fs");
const http = require("http");

// Express Setup
const app = express();
const bodyParser = require("body-parser");
let portNum = 5000;


process.stdin.setEncoding("utf-8");

const httpURL = `http://localhost:${portNum}`;
console.log(`Web server has started and running at ${httpURL}`);

const stopPrompt = "Type Stop to shutdown server: ";
process.stdout.write(stopPrompt);

// Start and Stop server upon request
process.stdin.on("readable", function(){
    let input = process.stdin.read();
    if(input !== null) {
        let command = input.trim();
        if (command === "Stop" || command === "stop") {
            console.log("Shutting down server");
            process.exit(0);
        } else {
            console.log("Invalid command.");
        }
        process.stdout.write(stopPrompt);
        process.stdin.resume();

    }
});


/*
    Mongo Setup
*/
const databaseAndCollection = {db: "WeatherApp", collection: "searchHistory"};
const {MongoClient, ServerApiVersion} = require('mongodb');
const uri = `URI`;  // REMOVED URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



/*
    Server Side
*/
app.set("views", path.resolve(__dirname, "./"));

app.set("view engine", "ejs");
const statusCode = 200;

/* Initializes request.body with post information */
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) =>{

    const variables = {httpURL: `http://localhost:${portNum}/weather`};
    response.render("weather", variables);
});

app.get("/weather", (request, response) => {
    const variables = {httpURL: `http://localhost:${portNum}/weather`};
    response.render("weather", variables);
});

app.get('/history', async (request, response) => {
    let arr = await retrieveSearches(client, databaseAndCollection);
    
    //Store html string
    let weatherCard = "";

    
    //If there is search history, display cities
    if(arr.length > 0) {
        //iterate through search history
        for(let element of arr) {
            let imageIcon = "https://openweathermap.org/img/wn/" + element.icon + ".png";
            weatherCard += '<div class="card">';
            // weatherCard += element.city;
            weatherCard += '<h2>' + element.city + '</h2>';
            weatherCard += '<img src="' + imageIcon + '" alt="Weather Icon"><br>';
            // weatherCard += '<p class="innerCard>';
            weatherCard += "Description: " + element.description + "<br>";
            weatherCard += 'H: ' + element.temp_max + '&deg;F&nbsp;';
            weatherCard += 'L: ' + element.temp_min + '&deg;F';
            // weatherCard += '</p>';
            weatherCard += '</div>';
        }
    } else {
        weatherCard = '<div class="card">';
        weatherCard += "No Searches"
        weatherCard += '</div>';
    }

    response.render("history", {weatherCard});
});

app.post("/weather", async (request, response) => {
    const {city} = request.body;

    apiKey = "KEY";     // REMOVED KEY
    let apiLink = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(
        apiLink
    )
    .then((response) => {
        if(!response.ok) {
            throw new Error("No weather found.");
        }
        return response.json();
    })
    .then(data => {
        const {temp, feels_like, temp_min, temp_max} = data.main;
        const {speed} = data.wind;
        const {description, icon} = data.weather[0];

        let imageIcon = "https://openweathermap.org/img/wn/" + icon + ".png";
        const variables = {
            city: city,
            temp: temp,
            feels_like: feels_like,
            temp_max: temp_max,
            temp_min: temp_min,
            speed: speed,
            description: description,
            icon: icon,
            imageIcon: imageIcon
        }

        //adding into mongo database
        addData(variables);
        //rendering results page
        response.render("searchResults", variables);

    });

});

//Add info into search history database
async function addData(info){
    try{
        await client.connect();
        await insertInfo(client, databaseAndCollection, info);
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// Helper to addData
async function insertInfo(client, databaseAndCollection, info){
    const result = await client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .insertOne(info);
}

app.listen(portNum);



//Retrieve Search History
async function retrieveSearches(client, databaseAndCollection){
    try{
        await client.connect();
        let filter = {};
        const cursor = client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .find(filter);

        const result = await cursor.toArray();
        return result;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

