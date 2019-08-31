const Express = require("express");
const app = new Express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const Game = require("./src/Game");
const game = new Game();

const PORT = process.env.PORT || 8080;

app.use(logger("dev"));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/create", async (req, res) => {
    const gameId = await game.create();
    res.status(201).send({gameId});
});

app.post("/makeMove", async (req, res) => {
    const {from, to} = req.body;
    await game.movePiece(from, to);
    await game.moveAIPiece();
    res.send(await game.getFen());
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});