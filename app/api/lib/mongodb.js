/* eslint-disable no-undef */

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // En mode développement, utilisez une variable globale pour la connexion
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
  console.log("BDD connected");
} else {
  // En mode production, créez une nouvelle connexion
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
