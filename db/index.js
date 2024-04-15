const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI,{
    dbName: 'realEstateApp'
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    // const realEstateAppCollection = mongoose.connection.db.collection('realEstateApp');

  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });