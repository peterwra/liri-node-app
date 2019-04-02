// Get API key variables
require("dotenv").config();

// Get spotify information and store in object
var keys = require("./keys.js");

// Spotify variable
var Spotify = require("node-spotify-api");

// Create spotify variable object
var spotifyObj = new Spotify(keys.spotify);

// Axios variable
var axios = require("axios");

// File system variable for file I/O
var fs = require("fs");

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

// Look up the concert information for the artist
function doConcertThis(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl)
        .then(function (response) {
            var data = response.data;
            if (data == "\n{warn=Not found}\n") {
                // Artist not found
                console.log("We're sorry, artist '" + artist + "' doesn't seem to exist.");
            } else if (data.length == 0) {
                // No planned concerts
                console.log("We're sorry, '" + artist + "' does not have any planned concerts right now.")
            } else {
                // Print concert information
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

// Use Spotify to look up song information
function doSpotifyThisSong(song) {

    // If no song provided, default to 'The Sign' by Ace of Base
    var querySong = (song == "" ? "The Sign" : song)

    // Perform search
    spotifyObj.search({ type: 'track', query: querySong }, function (err, data) {
        if (err) {
            return console.log('Error occurred with node-spotify-api: ' + err);
        }
        var response = data.tracks.items;
        // Loop through and print the information
        for (var i = 0; i < response.length; i++) {
            var artist = response[i].artists[0].name;
            var songName = response[i].name;
            var previewLink = response[i].album.external_urls.spotify;
            var album = response[i].album.name;
            console.log("------------------------------------");
            console.log("Artist: " + artist);
            console.log("Song Name: " + songName);
            console.log("Spotify Preview Link: " + previewLink);
            console.log("Album: " + album);
        }
    });
}