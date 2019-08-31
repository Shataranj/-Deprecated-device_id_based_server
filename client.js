const request = require("request-promise");


class Game {
    constructor() {}

    async create() {
        const response = await request.get('http://chess-api-chess.herokuapp.com/api/v1/chess/one');
        this.gameId = JSON.parse(response)["game_id"];
    };

    async movePiece(from, to) {
        const options = {
            "url": "http://chess-api-chess.herokuapp.com/api/v1/chess/one/move/player",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": `from=${from}&to=${to}&game_id=${this.gameId}`
        };
        const response = JSON.parse(await request.post(options));
        if (response.status !== "figure moved") {
            throw new Error(response.status);
        }
    }

    async moveAIPiece() {
        const options = {
            "url": "http://chess-api-chess.herokuapp.com/api/v1/chess/one/move/ai",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": `game_id=${this.gameId}`
        };
        const response = JSON.parse(await request.post(options));
        if (response.status !== "AI moved!") {
            throw new Error(response.status);
        }
    }

    async getFen() {
        const options = {
            "url": "http://chess-api-chess.herokuapp.com/api/v1/chess/one/fen",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": `game_id=${this.gameId}`
        };
        const response = JSON.parse(await request.post(options));
        return response["fen_string"];
    }
}

module.exports = Game;
