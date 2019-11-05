# Football Games Service

to run the app:

1. Clone this repo
2. `npm install`
3. `npm start`

###### Get list of matches by team and status(optional):

* URL: /matches/team/:name
* URL PARAMS: <name>(required)
* QUERY PARAMS: status=<status>(optional)
* Response:
    - Success : code: 200, content : [{match1},{match1}...]
    - Error: code: 404, content: {error: "no matches found"}
* Example: http://localhost:8080/matches/team/Manchester City
    

###### Get list of matches by tournament and status(optional):

* URL: /matches/tournament/:name
* URL PARAMS: <name>(required)
* QUERY PARAMS: status=<status>(optional)
* Response:
    - Success : code: 200, content : [{match1},{match1}...]
    - Error: code: 404, content: {error: "no matches found"}
* Example: http://localhost:8080/matches/tournament/fa?status=played
