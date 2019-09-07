# This is a server for play chess

## Installation

```
* Clone this repo
* Run `npm install`
* Run your mongo daemon
* Set the following details in env variables
  ** port in PORT
  ** DB Uri in env variable DB_URL
  ** collection or table name in TABLE
  ** database name in DB_NAME
* Run `npm start`
```

## This has two endpoints open
**Note: you need to send a custom header called device id with the request**

* create
  - http://<server_url>/create will give you game id in response 
* makeMove
  - http://<server_url>/makeMove post `from=<cell_no>&to=<cell_no>` to the url will give you the ai move in response

