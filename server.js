const express = require('express');
const csv = require('csv-to-array');

const app = express();

let played_headers = ['home_team', 'home_score', 'away_team', 'away_score', 'tournament', 'start_time'];
let upcoming_headers = ['home_team', 'away_team', 'tournament', 'start_time', 'kickoff'];

let resultPlayed = [];
let upcomingPlayed = [];

let results = [];

//Get list of matches by team and status(optional)
app.get('/matches/team/:name', function (req, res) {
    getHandler(res, req, checkTeamName);
});

//Get list of matches by tournament and status(optional)
app.get('/matches/tournament/:name', function (req, res) {
    getHandler(res, req, checkTournamentName);
});

// Handles any requests that don't match the ones above
app.get('*', function (req, res) {
    res.status(400).send({error: "bad request"});
});


//Handler for the get requests
function getHandler(res, req, func) {
    //no filter by status
    if (req.query.status === undefined) {
        results = resultPlayed.filter(m => func(m,req.params.name)).
                    concat(upcomingPlayed.filter(m => func(m,req.params.name)));
    }
    //filter by status
    else if (req.query.status === 'played'){
        results = resultPlayed.filter(m => func(m,req.params.name));
    }
    else if (req.query.status === 'upcoming'){
        results = upcomingPlayed.filter(m => func(m,req.params.name));
    }

    sendResults(res);
}

//Checks whether matches were found ans sends an answer
function sendResults(res) {
    if (results.length === 0) {
        res.status(404).send({error: "no matches found"});
    } else {
        res.status(200).send(JSON.parse(JSON.stringify(results)));
    }
    results = [];
}

function checkTeamName(data, name) {
    return (data.home_team === name || data.away_team === name);
}

function checkTournamentName(data, name) {
    return data.tournament === name;
}

/*
this function reads the csv files into 2 arrays.
Since the files are not big and the data does not change i decided to load the data into the program.
The other option is to read the data from the files every get request.
Only after the 2 arrays are initialized  with the data the server start listening.
 */
function initAndStart (){
    csv({
        file: 'result_upcoming.csv',
        columns: upcoming_headers
    }, function (err, arr) {
        upcomingPlayed = arr;
        csv({
            file: 'result_played.csv',
            columns: played_headers
        }, function (err, arr) {
            resultPlayed = arr;
            app.listen(8080, () => {
                console.log('server started on port 8080\n' +
                    'API endpoints:\n' +
                    'http://localhost:8080/matches/team/team_name - get list of matches by team\n' +
                    'http://localhost:8080/matches/team/team_name/?status=status - get list of matches by team filtered by status\n' +
                    'http://localhost:8080/matches/tournament/tournament_name - get list of matches by tournament\n' +
                    'http://localhost:8080/matches/tournament/tournament_name?status=status - get list of matches by tournament filtered by status\n');
            });

        });
    });
}

initAndStart();
