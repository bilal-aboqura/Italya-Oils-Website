import { MongoClient } from "mongodb";
import "dotenv/config";
const c = new MongoClient(process.env.DATABASE_URL);
await c.connect();
const products = await c.db().collection("products")
    .find({}, { projection: { name: 1, _id: 0 } })
    .sort({ name: 1 })
    .toArray();
products.forEach((p, i) => console.log(`${i + 1}. ${p.name}`));
console.log(`\nTotal: ${products.length}`);
await c.close();
