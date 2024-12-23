const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
const options = {};

let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = mongoose.connect(uri, options).then((mongoose) => {
      console.log("Database connected successfully");
      return mongoose;
    }).catch((err) => {
      console.error("Failed to connect to the database", err);
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = mongoose.connect(uri, options).then((mongoose) => {
    console.log("Database connected successfully");
    return mongoose;
  }).catch((err) => {
    console.error("Failed to connect to the database", err);
  });
}

module.exports = clientPromise;