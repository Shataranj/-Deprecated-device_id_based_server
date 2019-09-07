const Express = require("express");
const app = new Express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const ProxyClient = require("./src/ProxyClient");
const proxyClient = new ProxyClient();
const DatabaseHelper = require('./src/mongo_helper');
const MongoClient = require("mongodb").MongoClient;

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/chess";
const PORT = process.env.PORT || 8080;
const TABLE = process.env.TABLE || "devices";
const DB_NAME = process.env.DB_NAME || "chess";

const databaseHelper = new DatabaseHelper(MongoClient, DB_URL);

app.use(logger("dev"));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/create", async (req, res) => {
    const deviceId = req.headers["device-id"];
    const gameId = await proxyClient.create();

    await databaseHelper.insert(deviceId, gameId, TABLE);
    res.status(201).send({gameId});
});

app.patch("/makeMove", async (req, res) => {
    const {from, to} = req.body;
    const deviceId = req.headers["device-id"];

    const gameId = await databaseHelper.getActiveGameId(deviceId, TABLE);

    try{
        await proxyClient.with(gameId).movePiece(from, to);
        const aiMove = await proxyClient.with(gameId).moveAIPiece();
        res.send(aiMove);
    } catch(err){
        res.status(500).send(err.toString());
    }
});

app.listen(PORT, async () => {
    await databaseHelper.connect(DB_NAME);
    console.log(`listening on port ${PORT}`);
});