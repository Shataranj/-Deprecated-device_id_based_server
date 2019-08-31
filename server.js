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

app.patch("/makeMove", async (req, res) => {
    const {from, to} = req.body;
    try{
        await game.movePiece(from, to);
        const aiMove = await game.moveAIPiece();
        res.send(aiMove);
    } catch(err){
        res.status(500).send(err.toString());
    }
    
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});