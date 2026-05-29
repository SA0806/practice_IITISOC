import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const schema = new mongoose.Schema({}, { strict: false });

async function run() {
  await mongoose.connect(process.env.AR_HOUSE_DB_URI);

  const Product =
    mongoose.models.Product ||
    mongoose.model("Product", schema, "Products");

  const products = await Product.find();

  let updated = 0;

  for (const product of products) {
    if (!product.model) continue;

    // Skip already-migrated URLs
    if (product.model.startsWith("http")) continue;

    const cdnUrl =
      `https://cdn.jsdelivr.net/gh/SA0806/practice_IITISOC@master/client/public${product.model}`;

    await Product.updateOne(
      { _id: product._id },
      { $set: { model: cdnUrl } }
    );

    console.log(`Updated: ${product.name}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated} models.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});