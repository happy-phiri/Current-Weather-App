const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const https = require('https');
const ejs = require('ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

let country = "";
let tempreture = "";
let actualFeel = "";
let maxTempreture = "";
let minTempreture = "";
let humidity = "";
let windSpeed = "";
let mainConditions = "";
let weatherConditions = "";
let imageUrl = "";
let cityName = "";
let pressure = "";


app.get("/", function(req, res){
    res.render("index");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.post("/", function(req, res){
    cityName = _.upperFirst(req.body.city);
    const units = "metric";
    const apiKey = "cc007c13acd98828716466bd2afb57fd";
    const url ="https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + units + "&appid=" + apiKey;


    https.get(url, function(response){
        console.log(response.statusCode);

        response.on('data', function(data){
            const weatherInformation = JSON.parse(data);
            country = weatherInformation.sys.country;
            tempreture = weatherInformation.main.temp;
            actualFeel = weatherInformation.main.feels_like;
            maxTempreture = weatherInformation.main.temp_max;
            minTempreture = weatherInformation.main.temp_min;
            humidity = weatherInformation.main.humidity;
            pressure = weatherInformation.main.pressure;
            windSpeed = weatherInformation.wind.speed;
            weatherConditions = _.upperFirst(weatherInformation.weather[0].description);
            mainConditions = weatherInformation.weather[0].main;
            const currentWeatherIcon = weatherInformation.weather[0].icon;
            imageUrl = "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";
           
            res.redirect("/weather");
        });
    })
})

app.get("/weather", function(req, res){
    res.render("weather", {
        country: country,
        cityName: cityName,
        tempreture: tempreture,
        weatherConditions: weatherConditions, 
        imageUrl: imageUrl, 
        maxTempreture: maxTempreture, 
        minTempreture: minTempreture,
        humidity: humidity,
        windSpeed: windSpeed,
        actualFeel: actualFeel,
        mainConditions: mainConditions,
        pressure: pressure
    });
});





app.listen(3000, function(){
    console.log("Server is up and running");
});