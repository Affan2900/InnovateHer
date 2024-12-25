import { MongoClient } from "mongodb"

if (!process.env.MONGO_URI){
  throw new Error("Mongo URI not found")
}

const client = new MongoClient(process.env.MONGO_URI);

async function getDB(dbName){
  try{
    await client.connect()
    console.log("Connected to DB")
    return client.db(dbName)
  } catch(err){
    console.log(err)
  }
}

export async function getCollection(collectionName){
  const db = await getDB('innovateHer')
  if (db) return db.collection(collectionName)
  else return null
  }