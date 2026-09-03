"use client";

import { FormEvent, useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [buyerType, setBuyerType] = useState<"individual" | "company">("individual");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const selected = String(data.get("product") || "");
      const match = PRODUCTS.find((p) => p.id === selected);
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          buyerType,
          companyName: buyerType === "company" ? data.get("companyName") : "",
          product: match?.name || selected,
          productId: match?.id || "",
          message: data.get("message"),
          origin: window.location.origin,
          website: data.get("website"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not send.");
      setStatus("sent");
      setBuyerType("individual");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send.");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-white border border-metallic-silver p-8 lg:p-12 text-center">
        <span className="material-symbols-outlined text-primary text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
          mark_email_read
        </span>
        <h2 className="font-display text-title-md mb-3">Message delivered</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          Your inquiry was sent. We will respond shortly.
        </p>
        <button type="button" className="text-primary font-mono uppercase" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-metallic-silver p-5 md:p-8 lg:p-12">
      <h2 className="font-display text-title-md mb-6 text-primary uppercase tracking-tight">Inquiry Form</h2>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-caption text-steel-blue uppercase">Full Name</span>
            <input required name="name" className={field} placeholder="Your Name" type="text" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-caption text-steel-blue uppercase">Email Address</span>
            <input name="email" className={field} placeholder="email@company.com" type="email" />
          </label>
        </div>
        <fieldset>
          <legend className="font-mono text-caption text-steel-blue uppercase mb-2">Enquiry as</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["individual", "Individual"],
                ["company", "Company"],
              ] as const
            ).map(([value, label]) => {
              const active = buyerType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setBuyerType(value)}
                  className={`min-h-12 font-mono text-xs uppercase tracking-widest border ${active ? "bg-primary text-white border-primary" : "border-metallic-silver text-on-surface-variant bg-white hover:border-primary"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
        {buyerType === "company" ? (
          <label className="flex flex-col gap-2">
            <span className="font-mono text-caption text-steel-blue uppercase">Company Name</span>
            <input required name="companyName" className={field} placeholder="Enter company name" type="text" autoComplete="organization" />
          </label>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-caption text-steel-blue uppercase">Phone Number</span>
            <input required name="phone" className={field} placeholder="+91 00000 00000" type="tel" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-caption text-steel-blue uppercase">Product Interest</span>
            <select name="product" className={`${field} appearance-none`}>
              <option value="">Select Product</option>
              {CATEGORIES.map((c) => (
                <optgroup key={c} label={c}>
                  {PRODUCTS.filter((p) => p.category === c).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.price}
                    </option>
                  ))}
                </optgroup>
              ))}
              {CATEGORIES.map((c) => (
                <option key={`cat-${c}`} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-caption text-steel-blue uppercase">Message / Requirements</span>
          <textarea name="message" className={field} placeholder="Briefly describe your requirements..." rows={4} />
        </label>
        <input tabIndex={-1} autoComplete="off" name="website" className="hidden" />
        {status === "error" ? <p className="text-sm text-error">{error}</p> : null}
        <button
          disabled={status === "sending"}
          className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary font-mono text-body-md uppercase hover:bg-primary-container transition-all flex items-center justify-center gap-3 disabled:opacity-60 min-h-12"
          type="submit"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
}

const field =
  "w-full border border-steel-blue bg-white px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-none outline-none min-h-12";
