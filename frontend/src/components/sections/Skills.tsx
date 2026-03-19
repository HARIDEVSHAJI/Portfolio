"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/SectionWrapper";
import { useEffect, useState } from "react";

interface Skill {
  id: number;
  name: string;
  category?: string;
  proficiency: number;
  icon?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const defaultSkills: Skill[] = [
  { id: 1, name: "React / Next.js", category: "Frontend", proficiency: 90, icon: "⚛️" },
  { id: 2, name: "TypeScript", category: "Frontend", proficiency: 85, icon: "📘" },
  { id: 3, name: "Python / FastAPI", category: "Backend", proficiency: 88, icon: "🐍" },
  { id: 4, name: "PostgreSQL", category: "Backend", proficiency: 80, icon: "🐘" },
  { id: 5, name: "Docker", category: "DevOps", proficiency: 75, icon: "🐳" },
  { id: 6, name: "Tailwind CSS", category: "Frontend", proficiency: 92, icon: "🎨" },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);

  useEffect(() => {
    fetch(`${API}/api/skills`)
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) setSkills(data);
      })
      .catch(() => {});
  }, []);

  // Group by category
  const categories = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <SectionWrapper id="skills" title="Skills">
        {/* Skills by category */}
        <div className="space-y-12">
          {Object.entries(categories).map(([category, catSkills], ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: ci * 0.1 }}
            >
              <h3
                className="text-lg font-semibold mb-6 flex items-center gap-2"
                style={{ color: "var(--accent-purple)" }}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                {category}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {catSkills.map((skill, si) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.1 + si * 0.05 }}
                    className="glass rounded-xl p-5 card-hover"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {skill.icon && (
                          <span className="text-xl">{skill.icon}</span>
                        )}
                        <span
                          className="font-medium text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {skill.name}
                        </span>
                      </div>
                      <span
                        className="text-sm font-mono font-bold"
                        style={{ color: "var(--accent-cyan)" }}
                      >
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <motion.div
                        className="skill-bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1.2,
                          delay: ci * 0.1 + si * 0.05 + 0.3,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
    </SectionWrapper>
  );
}
