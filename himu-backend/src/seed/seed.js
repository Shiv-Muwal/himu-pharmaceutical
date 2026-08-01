import { fileURLToPath } from "node:url";
import { connectDB, disconnectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { BlogPost } from "../models/BlogPost.js";
import { FAQ } from "../models/FAQ.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { Activity } from "../models/Activity.js";
import { Banner } from "../models/Banner.js";
import {
  seedProducts,
  seedCategories,
  seedBlogs,
  seedFaqs,
  seedOrders,
  seedBanners,
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

export async function runSeed({ clear = true } = {}) {
  if (clear) {
    console.log("Clearing existing data...");
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      BlogPost.deleteMany({}),
      FAQ.deleteMany({}),
      Order.deleteMany({}),
      User.deleteMany({}),
      Activity.deleteMany({}),
      Banner.deleteMany({}),
    ]);
  }

  console.log("Seeding categories...");
  await Category.insertMany(seedCategories);

  console.log("Seeding banners...");
  await Banner.insertMany(seedBanners);

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

  console.log("Creating demo customer...");
  await User.create({
    name: env.customerName,
    email: env.customerEmail,
    password: env.customerPassword,
    phone: env.customerPhone,
    role: "customer",
  });

  await Activity.create({
    activityId: "act_seed_ready",
    type: "system",
    message: "Database seeded and ready",
    at: new Date(),
  });

  console.log("Seed completed successfully!");
  console.log(`Admin login: ${env.adminEmail} / ${env.adminPassword}`);
  console.log(`Customer login: ${env.customerEmail} / ${env.customerPassword}`);
}

async function ensureDemoCustomer() {
  const email = String(env.customerEmail || "").toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) return;
  console.log("Demo customer missing — creating customer@himu.local...");
  await User.create({
    name: env.customerName,
    email: env.customerEmail,
    password: env.customerPassword,
    phone: env.customerPhone,
    role: "customer",
  });
}

export async function ensureSeeded() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log("Empty database detected — seeding defaults...");
    await runSeed({ clear: true });
    return true;
  }

  const bannerCount = await Banner.countDocuments();
  if (bannerCount === 0) {
    console.log("No banners found — seeding default homepage banners...");
    await Banner.insertMany(seedBanners);
  }

  await ensureDemoCustomer();
  return false;
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  connectDB()
    .then(() => runSeed({ clear: true }))
    .then(() => disconnectDB())
    .catch(async (err) => {
      console.error("Seed failed:", err);
      await disconnectDB();
      process.exit(1);
    });
}
