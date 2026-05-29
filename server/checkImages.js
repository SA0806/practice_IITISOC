import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const schema = new mongoose.Schema({}, { strict: false });

async function run() {
  await mongoose.connect(process.env.AR_HOUSE_DB_URI);

  const Product =
    mongoose.models.Product ||
    mongoose.model("Product", schema, "Products");

  const docs = await Product.find({
    image: { $regex: "^/assets/images/" }
  });

  console.log("Remaining:", docs.length);

  docs.forEach(doc => {
    console.log(doc.name);
    console.log(doc.image);
    console.log("-----");
  });

  process.exit(0);
}

run();