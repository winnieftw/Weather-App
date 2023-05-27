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


app.listen(portNum);



