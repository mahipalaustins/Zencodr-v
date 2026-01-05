import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Zencodr - Real-time Collaborative Coding',
    description: 'Code together in real-time.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body className={inter.className}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        /** Polyfills for SimplePeer / WebRTC **/
                        if (typeof window !== 'undefined') {
                            window.global = window;
                            window.process = { env: {} };
                            window.Buffer = window.Buffer || require("buffer").Buffer;
                        }
                    `,
                    }}
                />
                {children}
            </body>
        </html>
    );
}
