const MongoClient = require("mongodb").MongoClient;

module.exports = class {
	constructor(mongoClient = MongoClient, url = "mongodb://localhost:27017/chess") {
		this.url = url;
    this.db = null;
    this.mongoClient = mongoClient;
	}

	async connect() {
    this.db = (await this.mongoClient.connect(this.url, {
      useNewUrlParser: true,
			useUnifiedTopology: true
    })).db('chess');
		console.log("Database connected");
  }
  
  async insert(deviceId, gameId){
    await this.db.collection('devices').insert({deviceId, gameId});  
  }

  async getActiveGameId(deviceId){
    const result = await this.db.collection('devices').find({deviceId}).sort({"_id":-1}).limit(1);
    const gameId = (await result.toArray())[0].gameId;
    return gameId;
  }
};