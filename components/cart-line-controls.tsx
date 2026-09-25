"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function CartLineControls({
  itemId,
  quantity,
  stock,
}: {
  itemId: string;
  quantity: number;
  stock: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: Number(form.get("quantity")) }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      await fetch(`/api/cart/${encodeURIComponent(itemId)}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <form onSubmit={update} className="flex items-center gap-2 text-sm">
        <input type="hidden" name="itemId" value={itemId} />
        <label htmlFor={`qty-${itemId}`}>Qty</label>
        <select
          id={`qty-${itemId}`}
          name="quantity"
          key={quantity}
          defaultValue={quantity}
          className="h-9 rounded-md border border-[#888] bg-white px-2"
        >
          {Array.from({ length: Math.max(quantity, Math.min(stock, 20)) }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <button type="submit" className="text-[#1a5276]">
          Update
        </button>
      </form>
      <form onSubmit={remove}>
        <input type="hidden" name="itemId" value={itemId} />
        <button type="submit" className="text-sm text-[#1a5276]">
          Delete
        </button>
      </form>
    </div>
  );
}
