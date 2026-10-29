import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));

app.get("/api/health", async (_req, res) => {
  await pool.query("select 1");
  res.json({ ok: true });
});

app.get("/api/items", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "select id, name, quantity, updated_at from items order by id",
    );
    res.json(rows);
  } catch (e) { next(e); }
});

app.post("/api/items", async (req, res, next) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const quantity = Number.parseInt(req.body?.quantity ?? 0, 10);
    if (!name || name.length > 100 || !Number.isInteger(quantity) || quantity < 0)
      return res.status(400).json({ error: "Invalid name or quantity" });
    const { rows } = await pool.query(
      "insert into items (name, quantity) values ($1, $2) returning id, name, quantity, updated_at",
      [name, quantity],
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

app.patch("/api/items/:id", async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const quantity = Number.parseInt(req.body?.quantity, 10);
    if (!Number.isInteger(id) || !Number.isInteger(quantity) || quantity < 0)
      return res.status(400).json({ error: "Invalid id or quantity" });
    const { rows } = await pool.query(
      "update items set quantity = $1, updated_at = now() where id = $2 returning id, name, quantity, updated_at",
      [quantity, id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// Optionally serve the built frontend (run `npm run build` in the project root first).
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist/client");
app.use(express.static(dist));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, "0.0.0.0", () => console.log(`API listening on :${port}`));
