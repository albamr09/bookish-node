const { MongoMemoryServer } = require('mongodb-memory-server-core');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(error => console.log(error));
});


afterAll(async () => {
    await mongoServer.stop();
    await mongoose.connection.close();
});
