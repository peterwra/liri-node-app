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

// Moment library
var moment = require("moment");

// Log file to store commands and results
var logFile = "./log.txt";

// Function to write out log file and console.log data
function writeLog(data) {
    console.log(data);
    fs.appendFileSync(logFile, data+"\n");
}

// Get user choice and search item
if (process.argv[2]==undefined){
    writeLog("You didn't give me a command");
    return 0;
}
var userChoice = process.argv[2].toLowerCase();
var searchItem = "";
for (var i = 3; i < process.argv.length; i++) {
    searchItem += process.argv[i] + ((i + 1) == process.argv.length ? "" : " ");
}

// Call function based on user choice
function userSelection() {
    writeLog("Selection: " + userChoice);
    writeLog("Search Item: " + searchItem);
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
            writeLog("You gave me '" + userChoice + "' which is not a valid option. Enter 'node liri help' to display valid options.");
    }
}

// Look up the concert information for the artist
function doConcertThis(artist) {
    if (artist=="") {
        writeLog("You didn't provide an artist.");
        return 0;
    }
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl)
        .then(function (response) {
            var data = response.data;
            if (data == "\n{warn=Not found}\n") {
                // Artist not found
                writeLog("We're sorry, artist '" + artist + "' doesn't seem to exist.");
            } else if (data.length == 0) {
                // No planned concerts
                writeLog("We're sorry, '" + artist + "' does not have any planned concerts right now.")
            } else {
                // Print concert information
                for (var i = 0; i < data.length; i++) {
                    var concertDate = moment(data[i].datetime).format("MM/DD/YYYY");
                    writeLog("------------------------------------");
                    writeLog("Venue Name: " + data[i].venue.name);
                    writeLog("Venue Location: " + data[i].venue.city + ", " + data[i].venue.country);
                    writeLog("Event Date: " + concertDate);
                }
            }
        })
        .catch(function (error) {
            writeLog(error);
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
            writeLog("------------------------------------");
            writeLog("Artist: " + artist);
            writeLog("Song Name: " + songName);
            writeLog("Spotify Preview Link: " + previewLink);
            writeLog("Album: " + album);
        }
    });
}

// Get movie information from OMDB
function doMovieThis(movie) {
    // If no movie provided, default to Mr. Nobody
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + (movie == "" ? "Mr. Nobody" : movie);
    axios.get(queryUrl)
        .then(function (response) {
            var data = response.data;
            if (data.Response == "False") {
                // Movie not found
                writeLog("We're sorry, the movie '" + movie + "' doesn't seem to exist.");
            } else {
                // Print movie information
                writeLog("------------------------------------");
                writeLog("Title: " + data.Title);
                writeLog("Release Year: " + data.Year);
                writeLog("IMDB Rating: " + data.Ratings[0].Value);
                writeLog("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
                writeLog("Produced in: " + data.Country);
                writeLog("Language: " + data.Language);
                writeLog("Plot: " + data.Plot);
                writeLog("Actors and Actresses: " + data.Actors);
            }
        })
        .catch(function (error) {
            writeLog(error);
        });
}

// Read from random.txt file
function doWhatItSays() {
    fs.readFile("./random.txt", "utf8", function (error, contents) {
        if (error) {
            return console.log("There was a problem reading the file.");
        }
        // Write the contents of the file for debugging purposes
        writeLog(contents);

        // Split the data into separat pieces
        var dataArray = contents.split(",");

        // First entry is the user selection
        userChoice = dataArray[0];

        // Search item is the second element in the data array
        searchItem = dataArray[1];

        // Call the user selection function to process the data
        userSelection();
    })
}

// Call the user selection function to process the information
userSelection();