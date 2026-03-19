"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth, ProtectedRoute } from "@/context/AuthContext";
import {
  getProjects, createProject, updateProject, deleteProject,
  getSkills, createSkill, updateSkill, deleteSkill,
  getAbout, updateAbout, uploadProfileImage,
  getResume, uploadResume,
  getCertificates, createCertificate, deleteCertificate,
  getContact, updateContact,
  getRoles, createRole, updateRole, deleteRole,
  uploadProjectImage, deleteProjectImage,
} from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Tab = "projects" | "skills" | "about" | "resume" | "certificates" | "contact" | "roles";

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "projects", label: "Projects", icon: "💻" },
  { key: "roles", label: "Roles", icon: "🎭" },
  { key: "skills", label: "Skills", icon: "⚡" },
  { key: "about", label: "About", icon: "👤" },
  { key: "resume", label: "Resume", icon: "📄" },
  { key: "certificates", label: "Certs", icon: "🏆" },
  { key: "contact", label: "Contact", icon: "📧" },
];

function DashboardContent() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen animated-gradient grid-bg">
      {/* Header */}
      <header className="glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between w-full">
          <h1 className="text-lg font-bold">
            <span className="gradient-text">&lt;</span>
            <span style={{ color: "var(--text-primary)" }}>Admin</span>
            <span className="gradient-text">/&gt;</span>
          </h1>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs link-hover" style={{ color: "var(--text-secondary)" }}>
              View Site
            </a>
            <button onClick={logout} className="text-xs px-4 py-2 rounded-lg cursor-pointer" style={{ background: "rgba(244,63,94,0.1)", color: "var(--accent-pink)", border: "1px solid rgba(244,63,94,0.2)" }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      {message && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium" style={{ background: message.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)", color: message.type === "success" ? "#10b981" : "#f43f5e", border: `1px solid ${message.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}` }}>
          {message.text}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer" style={{ background: activeTab === tab.key ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.02)", color: activeTab === tab.key ? "var(--accent-cyan)" : "var(--text-secondary)", border: `1px solid ${activeTab === tab.key ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.05)"}` }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="glass rounded-2xl p-6 md:p-8">
          {activeTab === "projects" && <ProjectsPanel showMsg={showMsg} />}
          {activeTab === "skills" && <SkillsPanel showMsg={showMsg} />}
          {activeTab === "about" && <AboutPanel showMsg={showMsg} />}
          {activeTab === "resume" && <ResumePanel showMsg={showMsg} />}
          {activeTab === "certificates" && <CertificatesPanel showMsg={showMsg} />}
          {activeTab === "contact" && <ContactPanel showMsg={showMsg} />}
          {activeTab === "roles" && <RolesPanel showMsg={showMsg} />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PROJECTS PANEL
// ═══════════════════════════════════════════════════════
function ProjectsPanel({ showMsg }: { showMsg: (t: "success" | "error", m: string) => void }) {
  interface ProjectImage { id: number; image_url: string; order: number; }
  interface ProjectItem { id: number; title: string; description?: string; tech_stack?: string; image_url?: string; live_url?: string; github_url?: string; featured?: boolean; order?: number; images?: ProjectImage[]; }
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [form, setForm] = useState({ title: "", description: "", tech_stack: "", live_url: "", github_url: "", featured: false, order: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  const load = useCallback(async () => { try { setItems(await getProjects()); } catch { /* ignore */ } }, []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm({ title: "", description: "", tech_stack: "", live_url: "", github_url: "", featured: false, order: 0 }); setImageFile(null); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("tech_stack", form.tech_stack);
    fd.append("live_url", form.live_url);
    fd.append("github_url", form.github_url);
    fd.append("featured", String(form.featured));
    fd.append("order", String(form.order));
    if (imageFile) fd.append("image", imageFile);
    try {
      if (editing) { await updateProject(editing.id, fd); showMsg("success", "Project updated"); }
      else { await createProject(fd); showMsg("success", "Project created"); }
      resetForm(); load();
    } catch { showMsg("error", "Failed to save project"); }
  };

  const startEdit = (p: ProjectItem) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description || "", tech_stack: p.tech_stack || "", live_url: p.live_url || "", github_url: p.github_url || "", featured: p.featured || false, order: p.order || 0 });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try { await deleteProject(id); showMsg("success", "Deleted"); load(); } catch { showMsg("error", "Delete failed"); }
  };

  const handleAddGalleryImage = async () => {
    if (!editing || !galleryFile) return;
    try {
      await uploadProjectImage(editing.id, galleryFile, 0);
      showMsg("success", "Image added to gallery");
      setGalleryFile(null);
      load();
      // Temporarily update editing state by re-fetching items
      const updated = await getProjects();
      const updatedProj = updated.find((p: ProjectItem) => p.id === editing.id);
      if (updatedProj) setEditing(updatedProj);
    } catch { showMsg("error", "Failed to upload image"); }
  };

  const handleDeleteGalleryImage = async (imgId: number) => {
    if (!confirm("Delete this gallery image?")) return;
    try {
      await deleteProjectImage(imgId);
      showMsg("success", "Image deleted from gallery");
      load();
      const updated = await getProjects();
      if (editing) {
        const updatedProj = updated.find((p: ProjectItem) => p.id === editing.id);
        if (updatedProj) setEditing(updatedProj);
      }
    } catch { showMsg("error", "Failed to delete image"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        {editing ? "Edit Project" : "Add Project"}
      </h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-8">
        <input className="admin-input" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="admin-input" placeholder="Tech Stack (comma sep)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
        <textarea className="admin-input md:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="admin-input" placeholder="Live URL" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
        <input className="admin-input" placeholder="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
          </label>
          <input className="admin-input w-24" type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
        </div>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="admin-input" />
        <div className="md:col-span-2 flex gap-3 mt-4">
          <button type="submit" className="admin-btn cursor-pointer">{editing ? "Update Project" : "Create Project"}</button>
          {editing && <button type="button" onClick={resetForm} className="admin-btn cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>Cancel Edit</button>}
        </div>
      </form>

      {/* Gallery Image Manager */}
      {editing && (
        <div className="mb-10 p-4 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[rgba(255,255,255,0.02)]">
          <h3 className="text-sm font-semibold mb-3 tracking-wider text-[var(--accent-purple)]">Project Gallery</h3>
          <div className="flex gap-4 items-center mb-4">
            <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} className="admin-input flex-1" />
            <button type="button" onClick={handleAddGalleryImage} disabled={!galleryFile} className="admin-btn px-6 disabled:opacity-50 cursor-pointer">
              Add Photo
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {editing?.images?.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-[rgba(255,255,255,0.1)] h-24">
                <img src={`${API}${img.image_url}`} alt="Gallery img" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteGalleryImage(img.id)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold"
                >
                  Delete
                </button>
              </div>
            ))}
            {(!editing?.images || editing.images.length === 0) && (
              <p className="text-xs text-[var(--text-secondary)] col-span-full">No gallery images added yet.</p>
            )}
          </div>
        </div>
      )}

      <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Existing Projects</h3>
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{p.title}</span>
              {p.featured && <span className="ml-2 text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(0,245,255,0.1)", color: "var(--accent-cyan)" }}>Featured</span>}
              <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{p.tech_stack}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(0,245,255,0.1)", color: "var(--accent-cyan)" }}>Edit</button>
              <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(244,63,94,0.1)", color: "var(--accent-pink)" }}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No projects yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SKILLS PANEL
// ═══════════════════════════════════════════════════════
function SkillsPanel({ showMsg }: { showMsg: (t: "success" | "error", m: string) => void }) {
  interface SkillItem { id: number; name: string; category?: string; proficiency: number; icon?: string; order?: number; }
  const [items, setItems] = useState<SkillItem[]>([]);
  const [editing, setEditing] = useState<SkillItem | null>(null);
  const [form, setForm] = useState({ name: "", category: "", proficiency: 80, icon: "", order: 0 });

  const load = useCallback(async () => { try { setItems(await getSkills()); } catch { /* ignore */ } }, []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm({ name: "", category: "", proficiency: 80, icon: "", order: 0 }); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await updateSkill(editing.id, form); showMsg("success", "Skill updated"); }
      else { await createSkill(form); showMsg("success", "Skill created"); }
      resetForm(); load();
    } catch { showMsg("error", "Failed to save skill"); }
  };

  const startEdit = (s: SkillItem) => { setEditing(s); setForm({ name: s.name, category: s.category || "", proficiency: s.proficiency, icon: s.icon || "", order: s.order || 0 }); };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try { await deleteSkill(id); showMsg("success", "Deleted"); load(); } catch { showMsg("error", "Delete failed"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>{editing ? "Edit Skill" : "Add Skill"}</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-8">
        <input className="admin-input" placeholder="Skill Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="admin-input" placeholder="Category (e.g. Frontend)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="admin-input" placeholder="Icon (emoji)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        <div className="flex gap-4">
          <input className="admin-input w-28" type="number" min="0" max="100" placeholder="Proficiency %" value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) || 0 })} />
          <input className="admin-input w-20" type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="admin-btn cursor-pointer">{editing ? "Update" : "Create"}</button>
          {editing && <button type="button" onClick={resetForm} className="admin-btn cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>Cancel</button>}
        </div>
      </form>
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              {s.icon && <span>{s.icon}</span>}
              <div>
                <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{s.name}</span>
                <span className="ml-2 text-xs" style={{ color: "var(--accent-cyan)" }}>{s.proficiency}%</span>
                {s.category && <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.category}</div>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(s)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(0,245,255,0.1)", color: "var(--accent-cyan)" }}>Edit</button>
              <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(244,63,94,0.1)", color: "var(--accent-pink)" }}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No skills yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ABOUT PANEL
// ═══════════════════════════════════════════════════════
function AboutPanel({ showMsg }: { showMsg: (t: "success" | "error", m: string) => void }) {
  const [form, setForm] = useState({ title: "", description: "", subtitle: "", years_experience: 0, projects_completed: 0, happy_clients: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { getAbout().then((d) => setForm({ title: d.title || "", description: d.description || "", subtitle: d.subtitle || "", years_experience: d.years_experience || 0, projects_completed: d.projects_completed || 0, happy_clients: d.happy_clients || 0 })).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await updateAbout(form); showMsg("success", "About updated"); } catch { showMsg("error", "Failed to update"); }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try { await uploadProfileImage(file); showMsg("success", "Profile Image uploaded"); setFile(null); } catch { showMsg("error", "Failed to upload image"); }
    setUploading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Profile Image</h2>
      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-end gap-4 mb-10">
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Upload Avatar</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="admin-input" required />
        </div>
        <button type="submit" disabled={uploading || !file} className="admin-btn cursor-pointer disabled:opacity-50">{uploading ? "Uploading..." : "Upload image"}</button>
      </form>

      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Edit About</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <input className="admin-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="admin-input" placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        <textarea className="admin-input md:col-span-2" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="admin-input" type="number" placeholder="Years Experience" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })} />
        <input className="admin-input" type="number" placeholder="Projects Completed" value={form.projects_completed} onChange={(e) => setForm({ ...form, projects_completed: parseInt(e.target.value) || 0 })} />
        <input className="admin-input" type="number" placeholder="Happy Clients" value={form.happy_clients} onChange={(e) => setForm({ ...form, happy_clients: parseInt(e.target.value) || 0 })} />
        <div className="md:col-span-2">
          <button type="submit" className="admin-btn cursor-pointer">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// RESUME PANEL
// ═══════════════════════════════════════════════════════
function ResumePanel({ showMsg }: { showMsg: (t: "success" | "error", m: string) => void }) {
  interface ResumeItem { original_name?: string; uploaded_at?: string; }
  const [resume, setResume] = useState<ResumeItem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { getResume().then(setResume).catch(() => {}); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try { const res = await uploadResume(file); setResume(res); setFile(null); showMsg("success", "Resume uploaded"); } catch { showMsg("error", "Upload failed"); }
    setUploading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Resume / CV</h2>
      {resume && (
        <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <p className="text-sm" style={{ color: "#10b981" }}>
            ✓ Current: <strong>{resume.original_name || "resume.pdf"}</strong>
          </p>
        </div>
      )}
      <form onSubmit={handleUpload} className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{resume ? "Replace Resume" : "Upload Resume"} (PDF only)</label>
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="admin-input" required />
        </div>
        <button type="submit" disabled={uploading || !file} className="admin-btn cursor-pointer disabled:opacity-50">{uploading ? "Uploading..." : "Upload"}</button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CERTIFICATES PANEL
// ═══════════════════════════════════════════════════════
function CertificatesPanel({ showMsg }: { showMsg: (t: "success" | "error", m: string) => void }) {
  interface CertItem { id: number; title: string; issuer?: string; date?: string; image_url?: string; credential_url?: string; }
  const [items, setItems] = useState<CertItem[]>([]);
  const [form, setForm] = useState({ title: "", issuer: "", date: "", credential_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const load = useCallback(async () => { try { setItems(await getCertificates()); } catch { /* ignore */ } }, []);
  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("issuer", form.issuer);
    fd.append("date", form.date);
    fd.append("credential_url", form.credential_url);
    if (imageFile) fd.append("image", imageFile);
    try { await createCertificate(fd); showMsg("success", "Certificate added"); setForm({ title: "", issuer: "", date: "", credential_url: "" }); setImageFile(null); load(); } catch { showMsg("error", "Failed to add certificate"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try { await deleteCertificate(id); showMsg("success", "Deleted"); load(); } catch { showMsg("error", "Delete failed"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Add Certificate</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-8">
        <input className="admin-input" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="admin-input" placeholder="Issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
        <input className="admin-input" placeholder="Date (e.g. Mar 2024)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="admin-input" placeholder="Credential URL" value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="admin-input" />
        <div className="flex items-end"><button type="submit" className="admin-btn cursor-pointer">Add Certificate</button></div>
      </form>
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{c.title}</span>
              {c.issuer && <span className="ml-2 text-xs" style={{ color: "var(--text-secondary)" }}>by {c.issuer}</span>}
            </div>
            <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(244,63,94,0.1)", color: "var(--accent-pink)" }}>Delete</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No certificates yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONTACT PANEL
// ═══════════════════════════════════════════════════════
function ContactPanel({ showMsg }: { showMsg: (t: "success" | "error", m: string) => void }) {
  const [form, setForm] = useState({ email: "", phone: "", location: "", github: "", linkedin: "", twitter: "", website: "" });

  useEffect(() => { getContact().then((d) => setForm({ email: d.email || "", phone: d.phone || "", location: d.location || "", github: d.github || "", linkedin: d.linkedin || "", twitter: d.twitter || "", website: d.website || "" })).catch(() => {}); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await updateContact(form); showMsg("success", "Contact updated"); } catch { showMsg("error", "Failed to update"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Edit Contact & Social Links</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <input className="admin-input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="admin-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="admin-input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="admin-input" placeholder="Website URL" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <input className="admin-input" placeholder="GitHub URL" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
        <input className="admin-input" placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        <input className="admin-input" placeholder="Twitter URL" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
        <div className="md:col-span-2">
        </div>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ROLES PANEL
// ═══════════════════════════════════════════════════════
function RolesPanel({ showMsg }: { showMsg: (t: "success" | "error", m: string) => void }) {
  interface RoleItem { id: number; name: string; order: number; }
  const [items, setItems] = useState<RoleItem[]>([]);
  const [editing, setEditing] = useState<RoleItem | null>(null);
  const [form, setForm] = useState({ name: "", order: 0 });

  const load = useCallback(async () => { try { setItems(await getRoles()); } catch { /* ignore */ } }, []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setForm({ name: "", order: 0 }); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await updateRole(editing.id, form); showMsg("success", "Role updated"); }
      else { await createRole(form); showMsg("success", "Role created"); }
      resetForm(); load();
    } catch { showMsg("error", "Failed to save role"); }
  };

  const startEdit = (s: RoleItem) => { setEditing(s); setForm({ name: s.name, order: s.order || 0 }); };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try { await deleteRole(id); showMsg("success", "Deleted"); load(); } catch { showMsg("error", "Delete failed"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>{editing ? "Edit Role" : "Add Role"}</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-8">
        <input className="admin-input" placeholder="Role Name (e.g. AI Developer) *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="admin-input" type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="admin-btn cursor-pointer">{editing ? "Update" : "Create"}</button>
          {editing && <button type="button" onClick={resetForm} className="admin-btn cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>Cancel</button>}
        </div>
      </form>
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{s.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(s)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(0,245,255,0.1)", color: "var(--accent-cyan)" }}>Edit</button>
              <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: "rgba(244,63,94,0.1)", color: "var(--accent-pink)" }}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No roles yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════
export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
