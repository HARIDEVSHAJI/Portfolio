"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["hero", "skills", "projects", "resume", "certificates", "contact"].includes(hash)) {
        setActiveSection(hash);
      }
    };
    handleHashChange(); // check on initial load
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <>
          <CustomCursor />

          <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
          <main className="relative z-10 min-h-screen pt-24 pb-12 max-w-7xl mx-auto px-6 lg:px-8 w-full">
            {activeSection === "hero" && (
              <>
                <Hero onNavigate={handleNavigate} />
                <About />
              </>
            )}
            {activeSection === "skills" && <Skills />}
            {activeSection === "projects" && <Projects />}
            {activeSection === "certificates" && <Certificates />}
            {activeSection === "contact" && <Contact />}
          </main>
        </>
      )}
    </>
  );
}
