"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, COMPANY, PRODUCTS, type Product } from "@/lib/data";
import { useQuote, type InquiryItem } from "./QuoteProvider";

type Status = "idle" | "sending" | "sent" | "error";

function parseIds(value?: string) {
  return (value || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function QuoteModal() {
  const { isOpen, closeQuote, prefill, clearItems, removeItem, items } = useQuote();
  const [catalog, setCatalog] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [buyerType, setBuyerType] = useState<"individual" | "company">("individual");
  const [companyName, setCompanyName] = useState("");
  const [product, setProduct] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.products) && d.products.length) setCatalog(d.products);
        if (Array.isArray(d.categories) && d.categories.length) setCategories(d.categories);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const ids = parseIds(prefill.productId);
    if (ids.length > 1) {
      const matches = ids
        .map((id) => catalog.find((p) => p.id === id) || items.find((item) => item.id === id))
        .filter((item): item is Product | InquiryItem => Boolean(item));
      setProduct(matches.map((p) => p.name).join(", ") || prefill.product || "");
      setProductId(ids.join(","));
    } else {
      const match =
        catalog.find((p) => p.id === prefill.productId || (prefill.product && p.name === prefill.product)) ||
        items.find((item) => item.id === prefill.productId || (prefill.product && item.name === prefill.product));
      setProduct(match?.name || prefill.product || "");
      setProductId(match?.id || prefill.productId || "");
    }
    setQuantity(prefill.quantity || "");
    setMessage(prefill.message || "");
    setBuyerType("individual");
    setCompanyName("");
    setStatus("idle");
    setError("");
    const t = setTimeout(() => nameRef.current?.focus(), 50);
    return () => clearTimeout(t);
    // catalog/items are used only to resolve names; do not reset the form when they load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prefill]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuote();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeQuote]);

  const selectProducts = useMemo(() => {
    const list = [...catalog];
    if (productId && !productId.includes(",") && !list.some((p) => p.id === productId)) {
      const fromInquiry = items.find((item) => item.id === productId);
      list.push({
        id: productId,
        name: fromInquiry?.name || product || productId,
        category: "Selected product",
        image: fromInquiry?.image || "",
        specs: [],
        price: fromInquiry?.price || "",
        description: "",
      });
    }
    return list;
  }, [catalog, productId, product, items]);

  const selectCategories = useMemo(() => {
    const cats = [...categories];
    for (const item of selectProducts) {
      if (item.category && !cats.includes(item.category)) cats.push(item.category);
    }
    return cats;
  }, [categories, selectProducts]);

  if (!isOpen) return null;

  const inquiryList = parseIds(productId)
    .map((id) => catalog.find((p) => p.id === id) || items.find((item) => item.id === id))
    .filter((item): item is Product | InquiryItem => Boolean(item));
  const isMulti = inquiryList.length > 1;

  const selectedSingle =
    !isMulti && productId
      ? catalog.find((p) => p.id === productId) ||
        items.find((item) => item.id === productId) ||
        selectProducts.find((p) => p.id === productId)
      : undefined;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          buyerType,
          companyName: buyerType === "company" ? companyName : "",
          product,
          productId,
          quantity,
          message,
          origin: window.location.origin,
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send quote.");
      setStatus("sent");
      setName("");
      setPhone("");
      setEmail("");
      setBuyerType("individual");
      setCompanyName("");
      if (isMulti) clearItems();
      else if (productId) removeItem(productId);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send quote.");
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center p-0 md:p-6">
      <button type="button" aria-label="Close quote form" className="absolute inset-0 bg-on-background/70" onClick={closeQuote} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        className="relative z-10 w-full max-w-xl bg-white border border-metallic-silver flex flex-col max-h-[min(92dvh,100%)] md:max-h-[90vh]"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 bg-surface-variant border-b border-metallic-silver shrink-0">
          <div className="min-w-0">
            <p className="font-mono text-caption text-primary uppercase tracking-widest">Get a quote</p>
            <h2 id="quote-title" className="font-display text-lg md:text-title-md text-on-background">
              Send your requirement
            </h2>
            <p className="text-caption text-steel-blue mt-1">We will call you on {COMPANY.phoneDisplay}</p>
          </div>
          <button type="button" onClick={closeQuote} className="text-steel-blue hover:text-primary min-h-11 min-w-11 shrink-0" aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
          {status === "sent" ? (
            <div className="p-8 md:p-10 text-center">
              <span className="material-symbols-outlined text-primary text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                mark_email_read
              </span>
              <h3 className="font-display text-headline-lg-mobile mb-3">Requirement received</h3>
              <p className="text-body-md text-on-surface-variant mb-8">
                Your enquiry was sent to {COMPANY.name}. The team will call you shortly.
              </p>
              <button
                type="button"
                onClick={closeQuote}
                className="bg-primary text-white px-8 py-3 font-mono text-label-mono uppercase tracking-widest hover:bg-primary-container"
              >
                Close
              </button>
            </div>
          ) : (
            <form id="quote-form" className="p-5 md:p-8 space-y-4" onSubmit={onSubmit}>
              <p className="text-sm text-on-surface-variant">
                Share the tin size, quantity, and printing you need. We will call you back shortly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Your Name">
                  <input ref={nameRef} required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Enter name" autoComplete="name" />
                </Field>
                <Field label="Phone Number">
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+91" type="tel" autoComplete="tel" />
                </Field>
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
                <Field label="Company Name">
                  <input
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={inputClass}
                    placeholder="Enter company name"
                    autoComplete="organization"
                  />
                </Field>
              ) : null}
              <Field label="Email Address">
                <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="email@company.com" type="email" autoComplete="email" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isMulti ? (
                  <div className="sm:col-span-2">
                    <p className="font-mono text-caption text-steel-blue uppercase mb-2">Tins in this inquiry</p>
                    <ul className="border border-metallic-silver divide-y divide-industrial-gray">
                      {inquiryList.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 px-3 py-2">
                          <img src={item.image} alt="" className="w-10 h-10 object-contain bg-surface-container-low" />
                          <span className="text-sm text-on-background min-w-0 truncate">{item.name}</span>
                          <span className="ml-auto font-mono text-[11px] text-steel-blue shrink-0">{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Field label="Product Interest">
                    {selectedSingle ? (
                      <div className="flex items-center gap-3 border border-metallic-silver px-3 py-2 mb-2">
                        {selectedSingle.image ? (
                          <img src={selectedSingle.image} alt="" className="w-12 h-12 object-contain bg-surface-container-low" />
                        ) : null}
                        <div className="min-w-0">
                          <p className="text-sm text-on-background truncate">{selectedSingle.name}</p>
                          {"price" in selectedSingle && selectedSingle.price ? (
                            <p className="font-mono text-[11px] text-steel-blue">{selectedSingle.price}</p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                    <select
                      value={productId || product}
                      onChange={(e) => {
                        const value = e.target.value;
                        const match = selectProducts.find((p) => p.id === value);
                        if (match) {
                          setProductId(match.id);
                          setProduct(match.name);
                        } else {
                          setProductId("");
                          setProduct(value);
                        }
                      }}
                      className={inputClass}
                    >
                      <option value="">Select product</option>
                      {selectCategories.map((c) => (
                        <optgroup key={c} label={c}>
                          {selectProducts
                            .filter((p) => p.category === c)
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.price ? `${p.name} · ${p.price}` : p.name}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                      <optgroup label="Category enquiry">
                        {selectCategories.map((c) => (
                          <option key={`cat-${c}`} value={c}>
                            {c}
                          </option>
                        ))}
                      </optgroup>
                      {product && !productId && !selectCategories.includes(product) ? (
                        <option value={product}>{product}</option>
                      ) : null}
                    </select>
                  </Field>
                )}
                <Field label="Quantity">
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={inputClass}
                    placeholder={isMulti ? "e.g. 5000 pcs each" : "e.g. 5000 pcs"}
                  />
                </Field>
              </div>
              <Field label="Requirement details">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={inputClass}
                  rows={2}
                  placeholder="Sizes, printing, delivery city..."
                />
              </Field>
              <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" name="website" />
              {status === "error" ? <p className="text-sm text-error">{error}</p> : null}
            </form>
          )}
        </div>
        {status !== "sent" ? (
          <div className="shrink-0 p-4 border-t border-metallic-silver bg-white">
            <button
              form="quote-form"
              disabled={status === "sending"}
              className="w-full bg-primary text-white py-4 font-mono text-label-mono uppercase tracking-widest hover:bg-primary-container disabled:opacity-60 flex items-center justify-center gap-2 min-h-12"
              type="submit"
            >
              <span className="material-symbols-outlined">{status === "sending" ? "progress_activity" : "send"}</span>
              {status === "sending" ? "Sending..." : "Submit Requirement"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const inputClass =
  "w-full border border-metallic-silver bg-white px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary rounded-none outline-none font-body text-body-md min-h-12";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-caption text-steel-blue uppercase">{label}</span>
      {children}
    </label>
  );
}
