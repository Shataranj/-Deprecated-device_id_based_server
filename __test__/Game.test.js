const Game = require("../src/Game");
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const spies = require('chai-spies');
chai.use(chaiAsPromised);
chai.use(spies);
const expect = chai.expect;

describe("Game", () => {
	describe("create", () => {
		let httpClient;
		let game;

		beforeEach(() => {
			httpClient = { get: chai.spy(() => '{ "game_id": "__GAME_ID__" }') };
			game = new Game(httpClient);
		});

		test("makes call to chess api for creating game", async () => {
      await game.create();
			expect(httpClient.get).to.have.been.called();
		});

		test("returns game id", async () => {
			await expect(game.create()).to.eventually.be.equal('__GAME_ID__');
		});
	});

	describe("movePiece", () => {
		let httpClient;
		let game;

		beforeEach(() => {
			httpClient = { post: chai.spy(() => '{"status":"figure moved"}') };
			game = new Game(httpClient);
		});

		test("makes call to chess api for moving piece", async () => {
			await game.movePiece();
			expect(httpClient.post).to.have.been.called();
		});

    test("throws error if status is not figure moved", async () => {
      httpClient = { post: chai.spy(() => '{"status":"invalid move"}') };
			game = new Game(httpClient);
			await expect(game.movePiece()).to.eventually.be.rejected.and.be.equal('invalid move');
    });
    
		test("does not throw error if status is figure moved", async () => {
			await expect(game.movePiece()).to.be.fulfilled;
		});
  });
  
	describe("moveAIPiece", () => {
		let httpClient;
		let game;

		beforeEach(() => {
			httpClient = { post: chai.spy(() => '{"status":"AI moved!","from":"d2","to":"d4"}') };
			game = new Game(httpClient);
		});

		test("makes call to chess api for moving piece", async () => {
			await game.moveAIPiece();
			expect(httpClient.post).to.have.been.called();
		});

    test("throws error if status is not AI moved!", async () => {
      httpClient = { post: chai.spy(() => '{"status":"invalid move"}') };
			game = new Game(httpClient);
			await expect(game.moveAIPiece()).to.eventually.be.rejected.and.be.equal('invalid move');
    });
    
		test("does not throw error if status is figure moved", async () => {
			await expect(game.moveAIPiece()).to.be.fulfilled;
		});
  });
  
	describe("getFen", () => {
		let httpClient;
		let game;

    beforeEach(() => {
      httpClient = { post: chai.spy(() => '{"fen_string":"__FEN_STRING__"}') };
      game = new Game(httpClient);
		});

		test("makes call to chess api for fen string", async () => {
			await game.getFen();
			expect(httpClient.post).to.have.been.called();
		});
    
		test("returns the fen string", async () => {
			await expect(game.getFen()).to.eventually.be.equal('__FEN_STRING__');
		});
	});
});