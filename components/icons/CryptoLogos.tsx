/**
 * components/icons/CryptoLogos.tsx
 *
 * Official vector logos for Bitcoin, Ethereum, Solana, and NEAR Protocol.
 * Accurately shaped with official brand colors and geometry.
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function BitcoinLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        d="M22.5 13.9c.3-2.1-.6-3.3-2.4-4.1l.9-3.4-2.1-.5-.8 3.3c-.6-.1-1.2-.3-1.8-.4l.9-3.4-2.1-.5-.9 3.4c-.5-.1-1-.2-1.5-.3l-2.9-.7-.6 2.3s1.5.4 1.5.4c.8.2 1 .8.9 1.3l-1 3.8c.1 0 .2.1.3.1l-.3-.1-1.3 5.3c-.1.3-.4.7-1 .5 0 0-1.5-.4-1.5-.4l-1.1 2.5 2.7.7c.5.1 1 .3 1.5.4l-.9 3.5 2.1.5.9-3.4c.6.2 1.2.3 1.8.4l-.9 3.5 2.1.5.9-3.5c3.6.7 6.3.4 7.4-2.8.9-2.6 0-4.1-1.8-5 1.4-.4 2.4-1.4 2.7-3.3zm-4.8 6.9c-.7 2.6-5.1 1.2-6.5.9l1.2-4.6c1.4.3 6 1 5.3 3.7zm.7-7c-.6 2.3-4.3 1.1-5.5.8l1-4.2c1.2.3 5.1.9 4.5 3.4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function EthereumLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#FFFFFF">
        <path d="M16 4l-.3.9v14.4l.3.3 6.7-3.9L16 4z" fillOpacity="0.8" />
        <path d="M16 4L9.3 15.7l6.7 3.9V4z" />
        <path d="M16 20.9l-.2.2v6.6l.2.3 6.7-9.3-6.7 2.2z" fillOpacity="0.8" />
        <path d="M16 28v-7.1L9.3 18.7 16 28z" />
        <path d="M16 19.6l6.7-3.9-6.7-3v6.9z" fillOpacity="0.5" />
        <path d="M9.3 15.7l6.7 3.9v-6.9l-6.7 3z" fillOpacity="0.3" />
      </g>
    </svg>
  );
}

export function SolanaLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="#0C0E14" stroke="#253450" strokeWidth="1" />
      <defs>
        <linearGradient id="solanaGrad1" x1="6" y1="9" x2="26" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="solanaGrad2" x1="6" y1="16" x2="26" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="solanaGrad3" x1="6" y1="23" x2="26" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
      <path
        d="M9.8 11.8c.2-.2.5-.3.8-.3h14.8c.4 0 .7.5.4.8l-3.8 3.8c-.2.2-.5.3-.8.3H6.4c-.4 0-.7-.5-.4-.8l3.8-3.8z"
        fill="url(#solanaGrad1)"
      />
      <path
        d="M6.4 15.3c-.2.2-.5.3-.8.3H.8c-.4 0-.7-.5-.4-.8l3.8-3.8c.2-.2.5-.3.8-.3h14.8c.4 0 .7.5.4.8l-3.8 3.8z"
        transform="translate(5.6, 2.5)"
        fill="url(#solanaGrad2)"
      />
      <path
        d="M9.8 22.8c.2-.2.5-.3.8-.3h14.8c.4 0 .7.5.4.8l-3.8 3.8c-.2.2-.5.3-.8.3H6.4c-.4 0-.7-.5-.4-.8l3.8-3.8z"
        fill="url(#solanaGrad3)"
      />
    </svg>
  );
}

export function NearLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="#000000" stroke="#00EC97" strokeWidth="1.2" />
      <path
        d="M23.1 7.2l-6.8 9.9c-.3.4-.8.6-1.3.6-.6 0-1.1-.3-1.4-.7L9 9.3c-.3-.4-.8-.7-1.4-.7H6v14.8h3.4V13.8l6.3 9c.4.6 1 .9 1.7.9.6 0 1.2-.3 1.6-.8l4.1-6.1V23.4H26V7.2h-2.9z"
        fill="#00EC97"
      />
    </svg>
  );
}

export function CryptoChainIcon({
  chain,
  size = 18,
  className = '',
}: {
  chain: string;
  size?: number;
  className?: string;
}) {
  const c = chain.toLowerCase();
  if (c.includes('btc') || c.includes('bitcoin')) {
    return <BitcoinLogo size={size} className={className} />;
  }
  if (c.includes('eth') || c.includes('ethereum')) {
    return <EthereumLogo size={size} className={className} />;
  }
  if (c.includes('sol') || c.includes('solana')) {
    return <SolanaLogo size={size} className={className} />;
  }
  if (c.includes('near')) {
    return <NearLogo size={size} className={className} />;
  }
  return <div className={`w-${Math.round(size / 4)} h-${Math.round(size / 4)} rounded-full bg-enclave/30 ${className}`} />;
}
