"use strict";

import { MongoClient } from "mongodb";

// Get the MongoDB URI from environment variables
const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

// Throw an error if the Mongo URI is not defined
if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// In development mode, use a global variable to preserve the MongoClient instance across module reloads caused by HMR (Hot Module Replacement)
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the client promise
export default clientPromise;