import { pool } from "../db.js";

const items = [
  ["Coffee beans", 24],
  ["Paper cups", 300],
  ["Oat milk", 18],
  ["Sugar sachets", 450],
];

for (const [name, quantity] of items) {
  await pool.query(
    "insert into items (name, quantity) values ($1, $2) on conflict (name) do nothing",
    [name, quantity],
  );
}
console.log(`Seeded ${items.length} items`);
await pool.end();
