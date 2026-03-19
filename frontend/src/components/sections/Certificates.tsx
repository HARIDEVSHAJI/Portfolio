"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";

interface Certificate {
  id: number;
  title: string;
  issuer?: string;
  date?: string;
  image_url?: string;
  credential_url?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    fetch(`${API}/api/certificates`)
      .then((r) => r.json())
      .then(setCerts)
      .catch(() => {});
  }, []);

  if (certs.length === 0) {
    return (
      <SectionWrapper id="certificates" title="Certificates">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-10 text-center max-w-3xl mx-auto w-full"
          >
            <div className="text-5xl mb-4">🏆</div>
            <p style={{ color: "var(--text-secondary)" }}>
              Certificates will be added soon via admin panel.
            </p>
          </motion.div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="certificates" title="Certificates">

        {/* Certificate grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="glass rounded-xl overflow-hidden cursor-pointer card-hover group"
            >
              {cert.image_url ? (
                <div className="h-40 overflow-hidden">
                  <img
                    src={`${API}${cert.image_url}`}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : (
                <div
                  className="h-40 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,245,255,0.05), rgba(168,85,247,0.05))",
                  }}
                >
                  <span className="text-4xl opacity-30">🏆</span>
                </div>
              )}
              <div className="p-4">
                <h4
                  className="font-semibold text-sm mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cert.title}
                </h4>
                {cert.issuer && (
                  <p
                    className="text-xs"
                    style={{ color: "var(--accent-purple)" }}
                  >
                    {cert.issuer}
                  </p>
                )}
                {cert.date && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {cert.date}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>


      {/* Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedCert.image_url && (
                <img
                  src={`${API}${selectedCert.image_url}`}
                  alt={selectedCert.title}
                  className="w-full max-h-96 object-contain"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                />
              )}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {selectedCert.title}
                </h3>
                {selectedCert.issuer && (
                  <p
                    className="text-sm mb-1"
                    style={{ color: "var(--accent-purple)" }}
                  >
                    {selectedCert.issuer}
                  </p>
                )}
                {selectedCert.date && (
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {selectedCert.date}
                  </p>
                )}
                <div className="flex gap-3">
                  {selectedCert.credential_url && (
                    <a
                      href={selectedCert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn text-sm"
                    >
                      View Credential
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="px-6 py-2.5 rounded-lg text-sm cursor-pointer"
                    style={{
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
