const mongoose = require("mongoose");


const MONGO_URL = "mongodb+srv://nasa-api:KF9zFREF24gWukNI@nasa-cluster.trgkm.mongodb.net/?retryWrites=true&w=majority&appName=NASA-Cluster";

mongoose.connection.once('open', () => {
    console.log("MongoDB connection ready!");
  });
  
  mongoose.connection.on('error', (err) => {
    console.log(err);
  });

  async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
  }

  async function mongoDisconnect() {
    await mongoose.disconnect();
  }

  module.exports = {
    mongoConnect,
    mongoDisconnect
  }