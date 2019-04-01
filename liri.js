// Get API key variables
require("dotenv").config();

// Get spotify information and store in object
var keys = require("./keys.js");

// Create spotify variable
// var spotify = new Spotify(keys.spotify);

// File system variable for file I/O
var fs = require("fs");

// Axios variable
var axios = require("axios");

// Get user choice and search item
var userChoice = process.argv[2].toLowerCase();
var searchItem = "";
for (var i = 3; i < process.argv.length; i++) {
    searchItem += process.argv[i] + ((i + 1) == process.argv.length ? "" : " ");
}
console.log("'" + searchItem + "'");

// Call function based on user choice
switch (userChoice) {
    case "help":
        console.log("The following options are valid:");
        console.log("-----------------------------------------------------------------------");
        console.log("'node liri concert-this <artist>' --> search bandsintown for the artist");
        console.log("'node liri spotify-this-song <song>' --> search spotify for the song");
        console.log("'node liri movie-this <movie>' --> search omdb for the movie");
        console.log("'node liri do-what-it-says' --> read commands from the random.txt file and execute");
        break;
    case "concert-this":
        doConcertThis(searchItem);
        break;
    case "spotify-this-song":
        doSpotifyThisSong(searchItem);
        break;
    case "movie-this":
        doMovieThis(searchItem);
        break;
    case "do-what-it-says":
        doWhatItSays(searchItem);
        break;
    default:
        console.log("You gave me '" + userChoice + "' which is not a valid option. Enter 'node liri help' to display valid options.");
}

function doConcertThis(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl)
        .then(function (response) {
            var data = response.data;
            if (data=="\n{warn=Not found}\n") {
                console.log("We're sorry, artist '" + artist + "' doesn't seem to exist.");
            } else if (data.length==0) {
                console.log("We're sorry, '" + artist + "' does not have any planned concerts right now.")
            } else {
                for (var i = 0; i < data.length; i++) {
                    console.log("------------------------------------");
                    console.log("Venue Name: " + data[i].venue.name);
                    console.log("Venue Location: " + data[i].venue.city + ", " + data[i].venue.country);
                    console.log("Event Date: " + data[i].datetime);
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}