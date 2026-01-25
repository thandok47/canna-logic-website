// app/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

type Ad = {
  id: number;
  store_id: number;
  name?: string;
  logo_url?: string;
  tagline?: string;
  distance?: string | null;
};

type EventItem = {
  id: number;
  title: string;
  start_at: string;
  location?: string;
  image_url?: string;
  rsvp_link?: string;
};

type Product = {
  id: number;
  name: string;
  image_url?: string;
  price?: number;
  tags?: string[] | null;
  stock?: number;
};

type Promo = {
  id: number;
  title: string;
  image_url?: string;
  details?: string;
};

type Mention = {
  id: number;
  title: string;
  excerpt?: string;
  image_url?: string;
};

type EduBubble = {
  id: number;
  title?: string;
  text?: string;
  link?: string;
};

export default function Page(): React.ReactElement {
  const [user, setUser] = useState<any | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [eduBubbles, setEduBubbles] = useState<EduBubble[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eduDismissed, setEduDismissed] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("eduDismissed") || "[]");
    } catch {
      return [];
    }
  });

  const [slideIndex, setSlideIndex] = useState(0);
  const slideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Initial data fetch
    (async function fetchInitial() {
      try {
        const [adsRes, eventsRes, productsRes, promosRes, mentionsRes, eduRes] = await Promise.all([
          supabase.from("ads").select("id,store_id,name,logo_url,tagline,distance").order("priority", { ascending: false }).limit(12),
          supabase.from("events").select("id,title,start_at,location,image_url,rsvp_link").order("start_at", { ascending: true }).limit(6),
          supabase.from("products").select("id,name,image_url,price,tags,stock").order("trending_score", { ascending: false }).limit(10),
          supabase.from("promotions").select("id,title,image_url,details").order("start_at", { ascending: false }).limit(6),
          supabase.from("posts").select("id,title,excerpt,image_url").eq("type", "mention").order("published_at", { ascending: false }).limit(10),
          supabase.from("edu_bubbles").select("id,title,text,link").order("priority", { ascending: false }).limit(10),
        ]);

        if (adsRes.data) setAds(adsRes.data as Ad[]);
        if (eventsRes.data) setEvents(eventsRes.data as EventItem[]);
        if (productsRes.data) setProducts(productsRes.data as Product[]);
        if (promosRes.data) setPromos(promosRes.data as Promo[]);
        if (mentionsRes.data) setMentions(mentionsRes.data as Mention[]);
        if (eduRes.data) setEduBubbles(eduRes.data as EduBubble[]);
      } catch (err) {
        // keep silent in UI; log for debugging
        // eslint-disable-next-line no-console
        console.error("Initial fetch error", err);
      }
    })();

    // Auto-advance slider
    slideTimerRef.current = window.setInterval(() => {
      setSlideIndex((s) => (s + 1) % Math.max(1, products.length));
    }, 5000);

    return () => {
      subscription?.unsubscribe();
      if (slideTimerRef.current) window.clearInterval(slideTimerRef.current);
    };
  }, [products.length]);

  useEffect(() => {
    try {
      localStorage.setItem("eduDismissed", JSON.stringify(eduDismissed));
    } catch {}
  }, [eduDismissed]);

  // Auth handlers
  async function handleSignUp(e?: React.FormEvent) {
    e?.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
    alert("Check your email to verify your account.");
    setShowAuth(false);
  }

  async function handleSignIn(e?: React.FormEvent) {
    e?.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
    setShowAuth(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function requireAuth(action: () => void) {
    if (!user) {
      setShowAuth(true);
      setAuthMode("signin");
      return;
    }
    action();
  }

  function addToCart(product: Product) {
    requireAuth(() => {
      alert(`Added ${product.name} to cart`);
    });
  }

  function dismissBubble(id: number) {
    setEduDismissed((prev) => [...prev, id]);
  }

  function prevSlide() {
    setSlideIndex((s) => (s - 1 + products.length) % products.length);
  }
  function nextSlide() {
    setSlideIndex((s) => (s + 1) % products.length);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white font-bold">CL</div>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold">Canna Logic</h1>
                <p className="text-xs text-gray-600">Trusted retailers • Community • Education</p>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <input aria-label="Search stores and products" className="px-3 py-2 border rounded-md w-72" placeholder="Search stores, products, events" />
            </div>

            <button onClick={() => document.getElementById("cart")?.scrollIntoView()} className="px-3 py-2 rounded-md hover:bg-gray-100">
              Cart
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden sm:inline">Signed in</span>
                <button onClick={handleSignOut} className="px-3 py-2 bg-red-500 text-white rounded-md">Sign out</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuth(true); setAuthMode("signin"); }} className="px-4 py-2 bg-green-600 text-white rounded-md">Sign in</button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative h-[56vh] md:h-[64vh] bg-[url('/hero.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>
          <div className="container mx-auto relative z-10 h-full flex items-center px-4">
            <div className="max-w-2xl text-white">
              <h2 className="text-3xl md:text-5xl font-extrabold">Find trusted cannabis retailers, learn safely, and join our community</h2>
              <p className="mt-4 text-lg md:text-xl text-gray-100">Local stores. Expert guidance. Events and promotions near you.</p>
              <div className="mt-6 flex gap-3">
                <a href="/stores" className="px-5 py-3 bg-green-600 hover:bg-green-700 rounded text-white font-medium">Explore Stores</a>
                <button onClick={() => document.getElementById("trending")?.scrollIntoView()} className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded text-white">Top 10 Trending</button>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Ads Carousel */}
        <section className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-semibold mb-4">Featured Retail Partners</h3>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {ads.map((ad) => (
                <a key={ad.id} href={`/stores/${ad.store_id}`} className="min-w-[260px] bg-white rounded-lg shadow p-4 flex-shrink-0 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    {ad.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ad.logo_url} alt={ad.name ?? "store logo"} className="w-14 h-14 object-cover rounded" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded" />
                    )}
                    <div>
                      <h4 className="font-medium">{ad.name}</h4>
                      <p className="text-sm text-gray-500">{ad.tagline}</p>
                      <p className="text-xs text-gray-400 mt-1">{ad.distance ?? ""}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Educational bubbles */}
        <section className="container mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto">
            {eduBubbles.map((b) => !eduDismissed.includes(b.id) && (
              <div key={b.id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow min-w-[220px]">
                <div className="flex-1">
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-sm text-gray-600">{b.text}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <a href={b.link} className="text-xs text-green-600">Read</a>
                  <button onClick={() => dismissBubble(b.id)} className="text-xs text-gray-400">Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events and Highlights */}
        <section className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white p-4 rounded-lg shadow flex gap-4">
                  {ev.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.image_url} alt={ev.title} className="w-28 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-28 h-20 bg-gray-100 rounded" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{ev.title}</h4>
                    <p className="text-sm text-gray-500">{new Date(ev.start_at).toLocaleString()}</p>
                    <p className="text-sm mt-2 text-gray-700">{ev.location}</p>
                    <div className="mt-3">
                      <button onClick={() => requireAuth(() => { if (ev.rsvp_link) window.location.href = ev.rsvp_link; })} className="px-3 py-2 bg-green-600 text-white rounded">RSVP</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Highlights</h3>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="space-y-3">
                {mentions.map((m) => (
                  <div key={m.id} className="flex gap-3 items-start">
                    {m.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image_url} alt={m.title} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded" />
                    )}
                    <div>
                      <p className="font-medium">{m.title}</p>
                      <p className="text-sm text-gray-600">{m.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trending products slideshow */}
        <section id="trending" className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Top 10 Trending Products</h3>
            <div className="flex gap-2">
              <button onClick={prevSlide} className="px-3 py-2 bg-white rounded shadow">Prev</button>
              <button onClick={nextSlide} className="px-3 py-2 bg-white rounded shadow">Next</button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.slice(slideIndex, slideIndex + 3).map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow p-4">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover rounded" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded" />
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{p.name}</h4>
                      <p className="text-sm text-gray-500">{p.tags?.join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">R{p.price}</div>
                      <button onClick={() => addToCart(p)} className="mt-2 px-3 py-1 bg-green-600 text-white rounded">Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promotions and Sponsorships */}
        <section className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-semibold mb-4">Promotions & Sponsorships</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promos.map((pr) => (
              <div key={pr.id} className="bg-white rounded-lg shadow p-4">
                {pr.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pr.image_url} alt={pr.title} className="w-full h-36 object-cover rounded" />
                ) : (
                  <div className="w-full h-36 bg-gray-100 rounded" />
                )}
                <div className="mt-3">
                  <p className="font-medium">{pr.title} <span className="text-xs text-gray-400">Sponsored</span></p>
                  <p className="text-sm text-gray-600">{pr.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Memorable mentions ticker */}
        <section className="bg-white border-t border-b py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6 overflow-x-auto">
              {mentions.map((m) => (
                <div key={m.id} className="flex-shrink-0 text-sm text-gray-700 px-4">{m.title}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / Sign up CTA */}
        <section className="container mx-auto px-4 py-10">
          <div className="bg-green-600 text-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-2xl font-semibold">Join our community</h4>
              <p className="mt-1">Create an account with your email and get 10% off your first order.</p>
            </div>
            <div className="flex gap-3">
              <input aria-label="email" className="px-3 py-2 rounded" placeholder="you@example.com" />
              <button onClick={() => { setShowAuth(true); setAuthMode("signup"); }} className="px-4 py-2 bg-white text-green-600 rounded">Create Account</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-200 py-8">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold">Canna Logic</h5>
              <p className="text-sm text-gray-400 mt-2">For adults only. Consume responsibly.</p>
            </div>

            <div>
              <h5 className="font-semibold">Links</h5>
              <ul className="mt-2 text-sm text-gray-400 space-y-1">
                <li><a href="/about">About</a></li>
                <li><a href="/stores">Stores</a></li>
                <li><a href="/events">Events</a></li>
                <li><a href="/education">Education</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold">Follow</h5>
              <div className="flex gap-3 mt-2">
                <a href="#" aria-label="Instagram" className="text-gray-300">Instagram</a>
                <a href="#" aria-label="X" className="text-gray-300">X</a>
                <a href="#" aria-label="Telegram" className="text-gray-300">Telegram</a>
                <a href="#" aria-label="Facebook" className="text-gray-300">Facebook</a>
                <a href="#" aria-label="WhatsApp" className="text-gray-300">WhatsApp</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Auth modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">{authMode === "signin" ? "Sign in" : "Create account"}</h4>
              <button onClick={() => setShowAuth(false)} className="text-gray-500">Close</button>
            </div>

            <form onSubmit={authMode === "signin" ? handleSignIn : handleSignUp} className="mt-4 space-y-3">
              <label className="block">
                <span className="text-sm">Email</span>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" />
              </label>

              <label className="block">
                <span className="text-sm">Password</span>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded" />
              </label>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">We’ll never sell your email.</div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")} className="text-sm text-green-600">
                    {authMode === "signin" ? "Create account" : "Have an account? Sign in"}
                  </button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                    {authMode === "signin" ? "Sign in" : "Sign up"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
