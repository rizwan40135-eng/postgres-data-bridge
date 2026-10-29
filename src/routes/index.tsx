import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addItem, listItems, updateQuantity, usingSample, type Item } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stockroom — Inventory on PostgreSQL" },
      { name: "description", content: "View and update inventory stored in AWS RDS PostgreSQL." },
      { property: "og:title", content: "Stockroom — Inventory on PostgreSQL" },
      { property: "og:description", content: "View and update inventory stored in AWS RDS PostgreSQL." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("0");

  const load = () => listItems().then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const change = async (id: number, q: number) => {
    if (q < 0) return;
    try { await updateQuantity(id, q); load(); } catch (e) { setError((e as Error).message); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try { await addItem(name.trim(), Math.max(0, parseInt(qty) || 0)); setName(""); setQty("0"); load(); }
    catch (e) { setError((e as Error).message); }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {usingSample ? "Preview · sample data" : "Live · AWS RDS"}
      </p>
      <h1 className="mt-2 text-4xl font-semibold text-foreground">Stockroom</h1>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <ul className="mt-10 divide-y divide-border border-y border-border">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between py-4">
            <span className="text-foreground">{i.name}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => change(i.id, i.quantity - 1)}>−</Button>
              <span className="w-14 text-center font-mono tabular-nums">{i.quantity}</span>
              <Button variant="outline" size="sm" onClick={() => change(i.id, i.quantity + 1)}>+</Button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="mt-8 flex gap-2">
        <Input placeholder="New item" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} />
        <Input type="number" min={0} className="w-24" value={qty} onChange={(e) => setQty(e.target.value)} />
        <Button type="submit">Add</Button>
      </form>
    </main>
  );
}
