import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.AR_HOUSE_DB_URI);

  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  console.log(collections.map(c => c.name));
  process.exit(0);
}

run();