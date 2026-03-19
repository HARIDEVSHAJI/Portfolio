"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";

interface Project {
  id: number;
  title: string;
  description?: string;
  tech_stack?: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  featured?: boolean;
  images?: { id: number; image_url: string; order: number }[];
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    // In a real scenario, you would have a GET /api/projects/:id endpoint.
    // If you don't, you fetch all and filter.
    fetch(`${API}/api/projects`)
      .then((r) => r.json())
      .then((data: Project[]) => {
        const found = data.find((p) => String(p.id) === id);
        if (found) {
          setProject(found);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <CustomCursor />
        <div className="w-10 h-10 border-4 rounded-full animate-spin border-t-[var(--accent-cyan)] border-r-transparent border-b-transparent border-l-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen grid-bg flex flex-col items-center justify-center text-center">
        <CustomCursor />
        <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
        <Link href="/#projects" className="text-[var(--accent-cyan)] link-hover">
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg relative text-white pb-24">
      <CustomCursor />
      
      {/* Navbar Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-[100] glass-strong py-4 px-6 flex items-center justify-between">
        <Link href="/#projects" className="text-xl font-bold tracking-tight inline-flex items-center gap-2">
          <span className="text-[var(--text-secondary)]">←</span>
          <span className="gradient-text">&lt;</span>
          <span className="text-[var(--text-primary)]">Back</span>
          <span className="gradient-text">/&gt;</span>
        </Link>
      </nav>

      <main className="pt-32 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {project.featured && (
                <span className="inline-block mb-4 px-3 py-1 text-xs font-bold uppercase rounded-lg bg-[rgba(0,245,255,0.1)] text-[var(--accent-cyan)] border border-[rgba(0,245,255,0.2)]">
                  Featured Project
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-extrabold gradient-text tracking-tight mb-4">
                {project.title}
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: "var(--accent-cyan)", color: "#0a0a0f" }}
                >
                  Visit Live Site
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ border: "1px solid var(--accent-cyan)", color: "var(--accent-cyan)" }}
                >
                  Source Code
                </a>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Slider/Gallery */}
            <div className="lg:col-span-2">
              <div className="w-full aspect-video rounded-3xl overflow-hidden glass p-2 mb-6 relative group">
                <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[rgba(255,255,255,0.02)]">
                  {project.images && project.images.length > 0 ? (
                    <>
                      <img
                        src={`${API}${project.images[currentImageIdx].image_url}`}
                        alt={`${project.title} screenshot ${currentImageIdx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {project.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIdx((prev) => (prev === 0 ? project.images!.length - 1 : prev - 1))}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            ←
                          </button>
                          <button
                            onClick={() => setCurrentImageIdx((prev) => (prev + 1) % project.images!.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            →
                          </button>
                        </>
                      )}
                    </>
                  ) : project.image_url ? (
                    <img
                      src={`${API}${project.image_url}`}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-20">
                      💻
                    </div>
                  )}
                </div>
              </div>
              
              {/* Thumbnail strip */}
              {project.images && project.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {project.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImageIdx(idx)}
                      className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        currentImageIdx === idx ? "border-[var(--accent-cyan)] opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={`${API}${img.image_url}`} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Overview</h3>
                <div className="glass rounded-3xl p-6">
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm whitespace-pre-wrap">
                    {project.description || "No detailed description provided."}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Technologies Used</h3>
                <div className="glass rounded-3xl p-6 h-fit flex flex-wrap gap-2">
                  {project.tech_stack ? (
                    project.tech_stack.split(",").map((tech, ti) => (
                      <span
                        key={ti}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{
                          background: "rgba(168, 85, 247, 0.1)",
                          color: "var(--accent-purple)",
                          border: "1px solid rgba(168, 85, 247, 0.15)",
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-[var(--text-secondary)] text-sm">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
