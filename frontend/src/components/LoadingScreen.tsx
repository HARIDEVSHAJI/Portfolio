"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const codeLines = [
  "$ initializing portfolio...",
  "Loading modules ████████░░ 80%",
  "import { creativity } from 'mind';",
  "import { passion } from 'heart';",
  "const developer = new FullStack();",
  "await developer.initialize();",
  "Loading modules ██████████ 100%",
  "✓ Portfolio ready.",
];

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLine >= codeLines.length) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }

    const line = codeLines[currentLine];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= line.length) {
        setDisplayedText(line.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setCompletedLines((prev) => [...prev, line]);
        setDisplayedText("");
        setCurrentLine((prev) => prev + 1);
        setProgress(((currentLine + 1) / codeLines.length) * 100);
      }
    }, 25);

    return () => clearInterval(typeInterval);
  }, [currentLine, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "#0a0a0f" }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? "#00f5ff" : "#a855f7",
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i % 5) * 0.4,
            }}
          />
        ))}

        <div className="relative w-full max-w-2xl px-6">
          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(0, 245, 255, 0.15)" }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span
                className="ml-3 text-xs"
                style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                portfolio@dev:~
              </span>
            </div>

            {/* Terminal body */}
            <div
              ref={containerRef}
              className="p-5 min-h-[280px] max-h-[280px] overflow-hidden"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }}
            >
              {completedLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-1"
                  style={{
                    color: line.startsWith("✓")
                      ? "#10b981"
                      : line.startsWith("$")
                      ? "#00f5ff"
                      : line.startsWith("import")
                      ? "#a855f7"
                      : "var(--text-secondary)",
                  }}
                >
                  {line}
                </motion.div>
              ))}
              {currentLine < codeLines.length && (
                <div className="flex items-center">
                  <span
                    style={{
                      color: codeLines[currentLine]?.startsWith("$")
                        ? "#00f5ff"
                        : "var(--text-secondary)",
                    }}
                  >
                    {displayedText}
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ color: "#00f5ff" }}
                  >
                    █
                  </motion.span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="px-5 pb-4">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span>Loading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
