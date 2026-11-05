import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DarkWallet Vanguard // Intel TDX Confidential Agent Vault',
  description:
    'Hardware-isolated autonomous AI treasury and cross-chain execution vault on NEAR AI Cloud and NEAR Intents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cream">
      <body className="min-h-screen bg-void text-ink antialiased selection:bg-enclave/30 selection:text-enclave font-display">
        {children}
      </body>
    </html>
  );
}
