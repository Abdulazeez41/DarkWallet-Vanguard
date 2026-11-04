import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DarkWallet Vanguard // TEE-Sanitized Autonomous Agent Engine',
  description:
    'Framework for deploying zero-knowledge, TEE-sanitized autonomous agents managing assets across Bitcoin, Ethereum, and Solana via NEAR Chain Signatures and NEAR Intents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FDFBF7] text-[#1E1E1E]">
        {children}
      </body>
    </html>
  );
}
