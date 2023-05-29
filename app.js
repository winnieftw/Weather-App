//import libraries
const express = require("express");
const path = require("path");
const fs = require("fs");
const http = require("http");

const app = express();
const bodyParser = require("body-parser");
let portNum = 5000;


process.stdin.setEncoding("utf-8");

const httpURL = `http://localhost:${portNum}`;
console.log(`Web server has started and running at ${httpURL}`);

const stopPrompt = "Type Stop to shutdown server: ";
process.stdout.write(stopPrompt);

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
        //keep asking user until vaiid input
        process.stdin.resume();

    }
});

app.set("views", path.resolve(__dirname, "./"));

app.set("view engine", "ejs");
const statusCode = 200;

/* Initializes request.body with post information */
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) => {
    response.render("index");
});


app.get("/weather", (request, response) =>{
    const variables = {httpURL: `http://localhost:${portNum}/weather`}
    response.render("weather", variables);
});

app.post("/weather", async (request, response) => {
    const {city} = request.body;

    apiKey = "aae9691330278bb23497a702fe05bc37";
    let apiLink = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(
        // "https://api.openweathermap.org/data/2.5/weather?q="
        // + city
        // + "&units=metric&appid="
        // + this.apiKey
        apiLink
    )
    .then((response) => {
        // console.log("API Link: " + apiLink);
        if(!response.ok) {
            throw new Error("No weather found.");
        }
        return response.json();
    })
    .then(data => {
        const {temp, feels_like, temp_min, temp_max} = data.main;
        const {speed} = data.wind;
        const {description} = data.weather[0];

        const variables = {
            city: city,
            temp: temp,
            feels_like: feels_like,
            temp_max: temp_max,
            temp_min: temp_min,
            speed: speed,
            description: description
        }
        // const { temp, humidity } = data.main;
        // console.log(`temp is: ${temp}`);
        response.render("searchResults", variables);

    });
    

});



app.listen(portNum);



