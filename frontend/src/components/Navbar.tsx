"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { id: "hero", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Navbar({
  activeSection,
  onNavigate
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    onNavigate(id);
    setIsMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${
        isScrolled 
          ? "glass-strong py-4 border-[rgba(255,255,255,0.05)] shadow-lg" 
          : "py-6 border-transparent bg-transparent"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo("hero")}
          className="text-xl font-bold tracking-tight cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <span className="gradient-text">&lt;</span>
          <span style={{ color: "var(--text-primary)" }}>Dev</span>
          <span className="gradient-text">/&gt;</span>
        </motion.button>

        {/* Desktop links */}
        <div className="hidden xl:flex lg:flex md:flex items-center gap-8">
          <div className="flex items-center justify-end gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-2 text-sm md:text-base font-semibold tracking-wide rounded-lg transition-all cursor-pointer relative ${
                  activeSection === link.id ? "nav-active" : ""
                }`}
                style={{
                  color: activeSection === link.id ? "var(--accent-cyan)" : "var(--text-secondary)",
                }}
                whileHover={{
                  color: "#00f5ff",
                  backgroundColor: "rgba(0, 245, 255, 0.05)",
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </div>
          <div className="w-px h-6 bg-[rgba(255,255,255,0.1)]"></div>
          <a
            href={`${API}/api/resume/download`}
            target="_blank"
            className="px-5 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-[0_0_15px_rgba(0,245,255,0.4)]"
            style={{
              background: "rgba(0, 245, 255, 0.15)",
              color: "var(--accent-cyan)",
              border: "1px solid rgba(0, 245, 255, 0.2)",
            }}
          >
            Download CV
          </a>
          <Link
            href="/admin/login"
            className="px-5 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            style={{
              background: "rgba(168, 85, 247, 0.15)",
              color: "var(--accent-purple)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
            }}
          >
            Admin
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <motion.span
            animate={{
              rotate: isMobileOpen ? 45 : 0,
              y: isMobileOpen ? 8 : 0,
            }}
            className="block w-6 h-0.5 rounded"
            style={{ background: "var(--accent-cyan)" }}
          />
          <motion.span
            animate={{ opacity: isMobileOpen ? 0 : 1 }}
            className="block w-6 h-0.5 rounded"
            style={{ background: "var(--accent-cyan)" }}
          />
          <motion.span
            animate={{
              rotate: isMobileOpen ? -45 : 0,
              y: isMobileOpen ? -8 : 0,
            }}
            className="block w-6 h-0.5 rounded"
            style={{ background: "var(--accent-cyan)" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="py-3 px-4 text-left text-sm font-medium rounded-lg transition-all cursor-pointer"
                  style={{
                    color:
                      activeSection === link.id
                        ? "var(--accent-cyan)"
                        : "var(--text-secondary)",
                    background:
                      activeSection === link.id
                        ? "rgba(0, 245, 255, 0.05)"
                        : "transparent",
                  }}
                >
                  {link.label}
                </button>
              ))}
              <a
                href={`${API}/api/resume/download`}
                target="_blank"
                className="py-3 px-4 text-left text-sm font-medium rounded-lg"
                style={{
                  color: "var(--accent-cyan)",
                  background: "rgba(0, 245, 255, 0.1)",
                }}
              >
                Download CV
              </a>
              <Link
                href="/admin/login"
                className="py-3 px-4 text-left text-sm font-medium rounded-lg"
                style={{
                  color: "var(--accent-purple)",
                  background: "rgba(168, 85, 247, 0.1)",
                }}
              >
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
