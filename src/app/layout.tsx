import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'PetaByteMind // Cinematic IDE & Systems Portfolio',
  description: 'The Engineer as a Filmmaker: Dark-mode cinematic IDE, high-concurrency systems architecture, and academic engineering portfolio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-signal-pure font-sans antialiased selection:bg-cyan-hyper/30 selection:text-signal-pure">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
