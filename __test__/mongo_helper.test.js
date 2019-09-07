const DatabaseHelper = require("../src/mongo_helper");

describe("helper", () => {
	let connect;
	let db;
	let mockClient;
	let dbHelper;

	beforeAll(async () => {
		connect = jest.fn();
		db = jest.fn();
		mockClient = { connect, db };
		connect.mockImplementation(() => mockClient);
		db.mockImplementation(() => mockClient);
		dbHelper = new DatabaseHelper(mockClient, "__MOCK_URL__");
		await dbHelper.connect();
	});

	describe("connect", () => {
		test("connect to have been called with specified args", () => {
			const options = {
				useNewUrlParser: true,
				useUnifiedTopology: true
			};
			expect(connect).toHaveBeenCalledWith("__MOCK_URL__", options);
		});

		test("db to have been called with specified args", () => {
			expect(db).toHaveBeenCalledWith("chess");
		});
	});

	describe("insert", () => {
		let collection;
		let insert;

		beforeAll(async () => {
			collection = jest.fn();
			insert = jest.fn();
			dbHelper.db = { collection, insert };
			collection.mockImplementation(() => dbHelper.db);
			insert.mockImplementation(() => dbHelper.db);
			await dbHelper.insert("__DEVICE_ID__", "__GAME_ID__");
		});

		test("collection to have been called with devices", () => {
			expect(collection).toHaveBeenCalledWith("devices");
		});

		test("insert to have been called with devices", () => {
			expect(insert).toHaveBeenCalledWith({
				deviceId: "__DEVICE_ID__",
				gameId: "__GAME_ID__"
			});
		});
	});

	describe("getActiveGameId", () => {
		let collection;
		let find;
		let sort;
    let limit;
    let result;

		beforeAll(async () => {
			collection = jest.fn();
			find = jest.fn();
			sort = jest.fn();
      limit = jest.fn();
      toArray = jest.fn();
      dbHelper.db = { collection, find, sort, limit };
      result = {toArray};
			collection.mockImplementation(() => dbHelper.db);
			find.mockImplementation(() => dbHelper.db);
			sort.mockImplementation(() => dbHelper.db);
			limit.mockImplementation(() => result);
			toArray.mockImplementation(() => [{gameId:"__GAME_ID__"}]);
			await dbHelper.getActiveGameId("__DEVICE_ID__");
		});

		test("collection to have been called with devices", () => {
			expect(collection).toHaveBeenCalledWith("devices");
		});

		test("find to have been called with deviceID", () => {
			expect(find).toHaveBeenCalledWith({ deviceId: "__DEVICE_ID__" });
    });
    
		test("sort to have been called with _id", () => {
			expect(sort).toHaveBeenCalledWith({ _id: -1 });
    });
    
		test("limit to have been called with 1", () => {
			expect(limit).toHaveBeenCalledWith(1);
    });
    
		test("should return the game id", () => {
			expect(dbHelper.getActiveGameId()).resolves.toBe("__GAME_ID__");
		});
	});
});
