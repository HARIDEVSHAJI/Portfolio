"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";

interface AboutData {
  title?: string;
  description?: string;
  subtitle?: string;
  years_experience?: number;
  projects_completed?: number;
  happy_clients?: number;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function About() {
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch(`${API}/api/about`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const stats = [
    {
      value: data?.years_experience ?? 3,
      label: "Years Experience",
      icon: "📅",
    },
    {
      value: data?.projects_completed ?? 15,
      label: "Projects Completed",
      icon: "🚀",
    },
    { value: data?.happy_clients ?? 10, label: "Happy Clients", icon: "😊" },
  ];

  return (
    <SectionWrapper id="about" title="About">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass rounded-2xl p-8">
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--accent-cyan)" }}
              >
                {data?.title || "Full Stack Developer"}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "var(--accent-purple)" }}
              >
                {data?.subtitle || "I build things for the web"}
              </p>
              <p
                className="leading-relaxed text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {data?.description ||
                  "Passionate developer with expertise in building modern web applications. I love crafting beautiful user interfaces and building robust backend systems. My goal is to create software that makes a difference."}
              </p>
            </div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-xl p-6 card-hover flex items-center gap-5"
              >
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: "var(--accent-cyan)" }}
                  >
                    {stat.value}+
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
    </SectionWrapper>
  );
}
