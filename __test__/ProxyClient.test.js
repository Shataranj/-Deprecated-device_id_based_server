const ProxyClient = require("../src/ProxyClient");
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const spies = require('chai-spies');
chai.use(chaiAsPromised);
chai.use(spies);
const expect = chai.expect;

describe("Game", () => {
	describe("create", () => {
		let httpClient;
		let proxyClient;

		beforeEach(() => {
			httpClient = { get: chai.spy(() => '{ "game_id": "__GAME_ID__" }') };
			proxyClient = new ProxyClient(httpClient);
		});

		test("makes call to chess api for creating game", async () => {
      await proxyClient.create();
			expect(httpClient.get).to.have.been.called();
		});

		test("returns game id", async () => {
			await expect(proxyClient.create()).to.eventually.be.equal('__GAME_ID__');
		});
	});

	describe("movePiece", () => {
		let httpClient;
		let proxyClient;

		beforeEach(() => {
			httpClient = { post: chai.spy(() => '{"status":"figure moved"}') };
			proxyClient = new ProxyClient(httpClient);
		});

		test("makes call to chess api for moving piece", async () => {
			await proxyClient.movePiece();
			expect(httpClient.post).to.have.been.called();
		});

    test("throws error if status is not figure moved", async () => {
      httpClient = { post: chai.spy(() => '{"status":"invalid move"}') };
			proxyClient = new ProxyClient(httpClient);
			await expect(proxyClient.movePiece()).to.eventually.be.rejected.and.be.equal('invalid move');
    });
    
		test("does not throw error if status is figure moved", async () => {
			await expect(proxyClient.movePiece()).to.be.fulfilled;
		});
  });
  
	describe("moveAIPiece", () => {
		let httpClient;
		let proxyClient;

		beforeEach(() => {
			httpClient = { post: chai.spy(() => '{"status":"AI moved!","from":"d2","to":"d4"}') };
			proxyClient = new ProxyClient(httpClient);
		});

		test("makes call to chess api for moving piece", async () => {
			await proxyClient.moveAIPiece();
			expect(httpClient.post).to.have.been.called();
		});

    test("throws error if status is not AI moved!", async () => {
      httpClient = { post: chai.spy(() => '{"status":"invalid move"}') };
			proxyClient = new ProxyClient(httpClient);
			await expect(proxyClient.moveAIPiece()).to.eventually.be.rejected.and.be.equal('invalid move');
    });
    
		test("does not throw error if status is figure moved", async () => {
			await expect(proxyClient.moveAIPiece()).to.be.fulfilled;
		});
  });
  
	describe("getFen", () => {
		let httpClient;
		let proxyClient;

    beforeEach(() => {
      httpClient = { post: chai.spy(() => '{"fen_string":"__FEN_STRING__"}') };
      proxyClient = new ProxyClient(httpClient);
		});

		test("makes call to chess api for fen string", async () => {
			await proxyClient.getFen();
			expect(httpClient.post).to.have.been.called();
		});
    
		test("returns the fen string", async () => {
			await expect(proxyClient.getFen()).to.eventually.be.equal('__FEN_STRING__');
		});
	});

	describe('with', () => {
		it('should return the game with the game id', () => {
			const proxyClient = new ProxyClient();
			const proxyClientWithGameId = proxyClient.with('game-id');
			expect(proxyClientWithGameId.gameId).to.be.equal('game-id');
			expect(proxyClient).to.be.equal(proxyClientWithGameId);
		})
	})
});