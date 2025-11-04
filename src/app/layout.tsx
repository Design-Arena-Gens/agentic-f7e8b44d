import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expense Agents Dashboard',
  description: 'Autonomous personal expense agents for smart budgeting and insights.'
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100">
        {children}
      </body>
    </html>
  );
}
