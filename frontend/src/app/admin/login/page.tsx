"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { login as apiLogin } from "@/lib/api";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiLogin(username, password);
      login(data.access_token);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid credentials. Try admin / admin123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 animated-gradient grid-bg"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Terminal header card */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          {/* Terminal bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span
              className="ml-3 text-xs"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              admin@portfolio:~
            </span>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold gradient-text mb-2">
                Admin Login
              </h1>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Sign in to manage your portfolio
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-xs font-medium mb-2 uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="admin-input"
                  placeholder="admin"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium mb-2 uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-center py-2 px-4 rounded-lg"
                  style={{
                    background: "rgba(244, 63, 94, 0.1)",
                    color: "var(--accent-pink)",
                    border: "1px solid rgba(244, 63, 94, 0.2)",
                  }}
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="admin-btn w-full py-3 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: "rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                      }}
                    />
                    Authenticating...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Back link */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-xs link-hover"
                style={{ color: "var(--text-secondary)" }}
              >
                ← Back to Portfolio
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
