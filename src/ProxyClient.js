const request = require("request-promise");

class ProxyClient {
    constructor(httpClient = request){
      this.httpClient = httpClient;
    }

    async create() {
        const response = await this.httpClient.get('http://chess-api-chess.herokuapp.com/api/v1/chess/one');
        return JSON.parse(response)["game_id"];
    };

    with(gameId){
        this.gameId = gameId;
        return this;
    }

    async movePiece(from, to) {
        const options = {
            "url": "http://chess-api-chess.herokuapp.com/api/v1/chess/one/move/player",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": `from=${from}&to=${to}&game_id=${this.gameId}`
        };
        const response = JSON.parse(await this.httpClient.post(options));
        if (response.status !== "figure moved") {
            throw response.status;
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
        const response = JSON.parse(await this.httpClient.post(options));
        if (response.status !== "AI moved!") {
            throw response.status;
        }
        return {from: response.from, to: response.to};
    }

    async getFen() {
        const options = {
            "url": "http://chess-api-chess.herokuapp.com/api/v1/chess/one/fen",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "body": `game_id=${this.gameId}`
        };
        const response = JSON.parse(await this.httpClient.post(options));
        return response["fen_string"];
    }
}

module.exports = ProxyClient;
