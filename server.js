const Express = require("express");
const app = new Express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const ProxyClient = require("./src/ProxyClient");
const proxyClient = new ProxyClient();
const games = {};

const PORT = process.env.PORT || 8080;

app.use(logger("dev"));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/create", async (req, res) => {
    const deviceId = req.headers["device-id"];
    
    const gameId = await proxyClient.create();

    if(!Object.keys(games).includes(deviceId)){
        games[deviceId]= [];
    }
    
    games[deviceId].push(gameId);
    res.status(201).send({gameId});
});

app.patch("/makeMove", async (req, res) => {
    const {from, to} = req.body;
    const deviceId = req.headers["device-id"];

    const gameId = games[deviceId].slice(-1);

    try{
        await proxyClient.with(gameId).movePiece(from, to);
        const aiMove = await proxyClient.with(gameId).moveAIPiece();
        res.send(aiMove);
    } catch(err){
        res.status(500).send(err.toString());
    }
    
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});