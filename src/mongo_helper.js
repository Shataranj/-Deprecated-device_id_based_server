module.exports = class {
	constructor(mongoClient, url) {
		this.url = url;
    this.db = null;
    this.mongoClient = mongoClient;
	}

	async connect(dbName) {
    this.db = (await this.mongoClient.connect(this.url, {
      useNewUrlParser: true,
			useUnifiedTopology: true
    })).db(dbName);
		console.log("Database connected");
  }
  
  async insert(deviceId, gameId, table){
    await this.db.collection(table).insert({deviceId, gameId});  
  }

  async getActiveGameId(deviceId, table){
    const result = await this.db.collection(table).find({deviceId}).sort({"_id":-1}).limit(1);
    const gameId = (await result.toArray())[0].gameId;
    return gameId;
  }
};