const Express = require("express");
const app = new Express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const Game = require("./client");
const game = new Game();

app.use(logger("dev"));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/create", async (req, res) => {
    await game.create();
    res.send();
});

app.post("/makeMove", async (req, res) => {
    const {from, to} = req.body;
    await game.movePiece(from, to);
    await game.moveAIPiece();
    res.send(await game.getFen());
});

app.listen(8080, () => {
    console.log("listening on port 8080")
});