"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show on desktop
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsVisible(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: isHovering
              ? "rgba(168, 85, 247, 0.8)"
              : "rgba(0, 245, 255, 0.8)",
            boxShadow: isHovering
              ? "0 0 20px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.2)"
              : "0 0 20px rgba(0, 245, 255, 0.6), 0 0 60px rgba(0, 245, 255, 0.2)",
          }}
        />
      </motion.div>

      {/* Trailing glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.8,
        }}
      >
        <div
          className="w-10 h-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 245, 255, 0.15), transparent 70%)",
          }}
        />
      </motion.div>
    </>
  );
}
