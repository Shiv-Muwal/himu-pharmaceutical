import { connectDB, disconnectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { BlogPost } from "../models/BlogPost.js";
import { FAQ } from "../models/FAQ.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import {
  seedProducts,
  seedCategories,
  seedBlogs,
  seedFaqs,
  seedOrders,
} from "./seedData.js";

async function updateRelatedSlugs() {
  const products = await Product.find().lean();
  for (const product of products) {
    let related = products
      .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
      .slice(0, 4)
      .map((p) => p.slug);

    if (related.length < 4) {
      const extras = products
        .filter((p) => p.slug !== product.slug && !related.includes(p.slug))
        .slice(0, 4 - related.length)
        .map((p) => p.slug);
      related = [...related, ...extras];
    }

    await Product.updateOne({ _id: product._id }, { $set: { relatedSlugs: related } });
  }
}

async function seed() {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    BlogPost.deleteMany({}),
    FAQ.deleteMany({}),
    Order.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("Seeding categories...");
  await Category.insertMany(seedCategories);

  console.log("Seeding products...");
  await Product.insertMany(seedProducts);
  await updateRelatedSlugs();

  console.log("Seeding blogs...");
  await BlogPost.insertMany(seedBlogs);

  console.log("Seeding FAQs...");
  await FAQ.insertMany(seedFaqs);

  console.log("Seeding orders...");
  await Order.insertMany(seedOrders);

  console.log("Creating admin user...");
  await User.create({
    name: "HIMU Admin",
    email: env.adminEmail,
    password: env.adminPassword,
    role: "admin",
  });

  console.log("Seed completed successfully!");
  console.log(`Admin login: ${env.adminEmail} / ${env.adminPassword}`);

  await disconnectDB();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await disconnectDB();
  process.exit(1);
});
