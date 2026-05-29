import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productSchema = new mongoose.Schema({}, { strict: false });

async function run() {
  await mongoose.connect(process.env.AR_HOUSE_DB_URI);

  const Product =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema, "Products");

  console.log("Fetching Cloudinary images...");

  const result = await cloudinary.search
    .expression("resource_type:image")
    .max_results(500)
    .execute();

  const imageMap = {};

  result.resources.forEach((img) => {
    imageMap[img.public_id.toLowerCase()] = img.secure_url;
  });

  const products = await Product.find();

  let updated = 0;

  for (const product of products) {
    if (!product.image) continue;

    const filename = product.image
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "")
      .toLowerCase();

    if (imageMap[filename]) {
      //   product.image = imageMap[filename];
      //   await product.save();
      await Product.updateOne(
        { _id: product._id },
        { $set: { image: imageMap[filename] } },
      );
      updated++;

      console.log(`Updated: ${product.name}`);
    } else {
      console.log(`❌ Missing: ${product.name} -> ${filename}`);
    }
  }

  console.log(`\nDone. Updated ${updated} products.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
