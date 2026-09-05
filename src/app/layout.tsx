import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Shell } from '@/components/layout/Shell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobPulse AI — Autonomous Job Application Agent',
  description:
    'Containerized AI Job Hunting Agent. Automatic job scraping, intelligent ATS matching, tailored resume redline diffs, and autonomous dispatching backed by PostgreSQL.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
