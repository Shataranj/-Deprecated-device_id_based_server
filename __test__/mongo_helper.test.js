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
		const dbName = "__DB_NAME__";
		const mockUrl = "__MOCK_URL__";
		connect.mockImplementation(() => mockClient);
		db.mockImplementation(() => mockClient);
		dbHelper = new DatabaseHelper(mockClient, mockUrl);
		await dbHelper.connect(dbName);
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
			expect(db).toHaveBeenCalledWith("__DB_NAME__");
		});
	});

	describe("insert", () => {
		let collection;
		let insert;

		beforeAll(async () => {
			collection = jest.fn();
			insert = jest.fn();
			dbHelper.db = { collection, insert };
			const table = "__TABLE__";
			const deviceId = "__DEVICE_ID__";
			const gameId = "__GAME_ID__";
			collection.mockImplementation(() => dbHelper.db);
			insert.mockImplementation(() => dbHelper.db);
			await dbHelper.insert(deviceId, gameId, table);
		});

		test("collection to have been called with devices", () => {
			expect(collection).toHaveBeenCalledWith("__TABLE__");
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
			const table = "__TABLE__";
			const gameId = "__GAME_ID__";
			const deviceId = "__DEVICE_ID__";
			collection.mockImplementation(() => dbHelper.db);
			find.mockImplementation(() => dbHelper.db);
			sort.mockImplementation(() => dbHelper.db);
			limit.mockImplementation(() => result);
			toArray.mockImplementation(() => [{gameId}]);
			await dbHelper.getActiveGameId(deviceId, table);
		});

		test("collection to have been called with devices", () => {
			expect(collection).toHaveBeenCalledWith("__TABLE__");
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
