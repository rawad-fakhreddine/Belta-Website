"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";

export default function Home() {
  const [lang, setLang] = useState<"en" | "ar">("en");

  return (
    <>
      <AnnouncementBar lang={lang} />
      <Navbar lang={lang} onLangChange={setLang} />
      <main style={{ background: "var(--bg)" }}>
        <Hero lang={lang} />
        <ProductGrid lang={lang} />
        <InstagramFeed lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
