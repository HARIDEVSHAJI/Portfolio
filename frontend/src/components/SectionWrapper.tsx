"use client";

import { motion } from "framer-motion";

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  title,
  children,
}: SectionWrapperProps) {
  return (
    <section id={id} className="w-full py-20 relative">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center w-full mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text tracking-tight inline-block text-center">
            {title}
          </h2>
        </motion.div>

        {/* Content */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </section>
  );
}
