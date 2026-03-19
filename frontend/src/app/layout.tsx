import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio | Full Stack Developer",
  description:
    "Personal portfolio showcasing projects, skills, and experience. Built with Next.js, FastAPI, and modern web technologies.",
  keywords: [
    "developer",
    "portfolio",
    "full stack",
    "web development",
    "react",
    "next.js",
  ],
  authors: [{ name: "Developer" }],
  openGraph: {
    title: "Portfolio | Full Stack Developer",
    description: "Personal portfolio showcasing projects, skills, and experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased animated-gradient noise-overlay grid-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
