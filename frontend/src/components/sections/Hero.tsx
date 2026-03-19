"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Hero({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [phrases, setPhrases] = useState<string[]>([
    "Tech Enthusiast",
    "Backend Developer",
    "AI Developer",
    "AI/ML Engineer",
  ]);

  useEffect(() => {
    import("@/lib/api").then(({ getRoles, getAbout }) => {
      getRoles()
        .then((roles) => {
          if (roles && roles.length > 0) {
            setPhrases(roles.map((r: any) => r.name));
          }
        })
        .catch(() => {});
        
      getAbout()
        .then((about) => {
          if (about?.avatar_url) setAvatarUrl(about.avatar_url);
        })
        .catch(() => {});
    });
  }, []);

  // Typing effect
  useEffect(() => {
    const phrase = phrases[currentPhraseIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setTypedText(phrase.substring(0, typedText.length + 1));
          if (typedText === phrase) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setTypedText(phrase.substring(0, typedText.length - 1));
          if (typedText === "") {
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? 20 : 50
    );
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhraseIndex, phrases]);


  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm" style={{ color: "#10b981" }}>
                Available for opportunities
              </span>
            </motion.div>

            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg mb-4"
              style={{
                color: "var(--accent-cyan)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Hello, World! I&apos;m
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="gradient-text">Haridev Shaji</span>
            </motion.h1>

            {/* Typing role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl md:text-3xl font-light mb-8 h-10"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{typedText}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block ml-1"
                style={{ color: "var(--accent-cyan)" }}
              >
                |
              </motion.span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              I craft modern, performant web experiences with cutting-edge
              technologies. Passionate about clean code, beautiful design, and
              innovative solutions.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <motion.button
                onClick={() => onNavigate?.("projects")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                  color: "#0a0a0f",
                  boxShadow: "0 0 30px rgba(0, 245, 255, 0.3)",
                }}
              >
                View My Work
              </motion.button>
              <motion.button
                onClick={() => onNavigate?.("contact")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
                style={{
                  background: "transparent",
                  color: "var(--accent-cyan)",
                  border: "1px solid rgba(0, 245, 255, 0.3)",
                }}
              >
                Get In Touch
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Profile Image */}
          <div className="flex justify-center lg:justify-end mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-2xl p-2 shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-[#0a0a0f]">
                {avatarUrl ? (
                  <img
                    src={`${API}${avatarUrl}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl opacity-20" style={{ filter: "grayscale(100%)" }}>👨‍💻</div>
                )}
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full flex justify-center pt-2"
          style={{ border: "2px solid rgba(0, 245, 255, 0.3)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0], y: [0, 12] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full"
            style={{ background: "var(--accent-cyan)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
