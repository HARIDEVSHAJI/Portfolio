"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/SectionWrapper";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description?: string;
  tech_stack?: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  featured?: boolean;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce with real-time inventory, payment processing, and admin dashboard.",
    tech_stack: "Next.js, FastAPI, PostgreSQL, Stripe",
    featured: true,
  },
  {
    id: 2,
    title: "AI Chat Application",
    description: "Real-time chat application powered by AI with natural language processing capabilities.",
    tech_stack: "React, Python, WebSocket, OpenAI",
    featured: true,
  },
  {
    id: 3,
    title: "Task Management System",
    description: "Kanban-style project management tool with team collaboration features.",
    tech_stack: "Next.js, Node.js, MongoDB, Socket.io",
    featured: false,
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) setProjects(data);
      })
      .catch(() => {});
  }, []);

  return (
    <SectionWrapper id="projects" title="Projects">
        {/* Project grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-2xl overflow-hidden card-hover"
            >
              {/* Image */}
              <div
                className="relative h-48 overflow-hidden"
                style={{
                  background: project.image_url
                    ? undefined
                    : `linear-gradient(135deg, rgba(0,245,255,0.1), rgba(168,85,247,0.1))`,
                }}
              >
                {project.image_url ? (
                  <img
                    src={`${API}${project.image_url}`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-30">💻</span>
                  </div>
                )}
                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3"
                  style={{ background: "rgba(10, 10, 15, 0.85)" }}
                >
                  <Link
                    href={`/project/${project.id}`}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider"
                    style={{
                      background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                      color: "#0a0a0f",
                    }}
                  >
                    View Details
                  </Link>
                  <div className="flex gap-2">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          color: "white",
                        }}
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          color: "white",
                        }}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                {/* Featured badge */}
                {project.featured && (
                  <div
                    className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase"
                    style={{
                      background: "rgba(0, 245, 255, 0.15)",
                      color: "var(--accent-cyan)",
                      border: "1px solid rgba(0, 245, 255, 0.2)",
                    }}
                  >
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.description}
                </p>
                {project.tech_stack && (
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.split(",").map((tech, ti) => (
                      <span
                        key={ti}
                        className="px-2 py-1 rounded-md text-[11px] font-medium"
                        style={{
                          background: "rgba(168, 85, 247, 0.1)",
                          color: "var(--accent-purple)",
                          border: "1px solid rgba(168, 85, 247, 0.15)",
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
    </SectionWrapper>
  );
}
