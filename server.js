const Express = require("express");
const app = new Express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const ProxyClient = require("./src/ProxyClient");
const proxyClient = new ProxyClient();
const DatabaseHelper = require('./src/mongo_helper');
const games = {};

const PORT = process.env.PORT || 8080;
const databaseHelper = new DatabaseHelper();

app.use(logger("dev"));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/create", async (req, res) => {
    const deviceId = req.headers["device-id"];
    const gameId = await proxyClient.create();

    await databaseHelper.insert(deviceId, gameId);
    res.status(201).send({gameId});
});

app.patch("/makeMove", async (req, res) => {
    const {from, to} = req.body;
    const deviceId = req.headers["device-id"];

    const gameId = await databaseHelper.getActiveGameId(deviceId);

    try{
        await proxyClient.with(gameId).movePiece(from, to);
        const aiMove = await proxyClient.with(gameId).moveAIPiece();
        res.send(aiMove);
    } catch(err){
        res.status(500).send(err.toString());
    }
});

app.listen(PORT, async () => {
    await databaseHelper.connect();
    console.log(`listening on port ${PORT}`);
});