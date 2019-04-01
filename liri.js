// Get API key variables
require("dotenv").config();

// Get spotify information and store in object
var keys = require("./keys.js");

// Create spotify variable
var spotify = new Spotify(keys.spotify);

// File system variable for file I/O
var fs = require("fs");

// Get user choice and search item
var userChoice = process.env[2];
var searchItem = "";
for (var i = 3; i < process.env.length; i++){
    searchItem+=process.env[i]+((i+1)==process.env.length ? "" : " ");
}

// Call function based on user choice
switch (userChoice) {
    case "help":
        console.log("The following options are valid:");
        console.log("----------------------------------------------------------------------------------");
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
        console.log("You gave me '" + userChoice + "' which is not a valid option. Enter 'liri help' to display valid options.");
}

