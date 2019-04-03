# liri-node-app

## Overview

The purpose of this program is to take various user input and utilize various API calls to gather the information for the user. If a command is received and it doesn't match to one of the below, inform the user. The following are valid commands for this application.

#### concert-this <artist>

**Purpose:** When provided an artist, use the Bands In Town API to retrieve the upcoming concerts for that artist. If no artist is provided, an alert will be printed.

**Usage:** node liri concert-this artist-to-search-for

#### spotify-this-song <song>

**Purpose:** When provided a song, use the Spotify API to retrieve the song information. If no song is provided, default to 'The Sign'.

**Usage:** node liri spotify-this-song song-to-search-for

#### movie-this <movie>

**Purpose:** When provided a movie, use the OMDB API to retrieve the movie information. If no movie is provided, default to 'Mr. Nobody'. If the movie could not be found, display a message to the user informing them it doesn't exist.

**Usage:** node liri movie-this movie-to-search-for

#### do-what-it-says

**Purpose:** Read the random.txt file and execute the command within. It will call the apprpriate API and retrieve the results.

**Usage:** node liri do-what-it-says

For a video demonstration, click [here](https://drive.google.com/open?id=1yyUgXU6Z42ZNnzYJvgHL3quRNa45ybuf).