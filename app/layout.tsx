import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const workSans = localFont({
  src: [
    {
      path: './fonts/WorkSans-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-Thin.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/WorkSans-ExtraLight.ttf',
      weight: '100',
      style: 'normal',
    },
  ],
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: 'Finance Tracker | Manage Your Money Smarter',
  description:
    'A simple, powerful personal finance tracker. Record your income and expenses, set monthly budgets, and get insights into your spending habits — all in one secure dashboard.',
  openGraph: {
    title: 'Finance Tracker | Manage Your Money Smarter',
    description:
      'A simple, powerful personal finance tracker. Record your income and expenses, set monthly budgets, and get insights into your spending habits — all in one secure dashboard.',
    images: [
      {
        url: '/logo-og.png',
        width: 1200,
        height: 630,
        alt: 'Finance Tracker Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance Tracker | Manage Your Money Smarter',
    description:
      'A simple, powerful personal finance tracker. Record your income and expenses, set monthly budgets, and get insights into your spending habits — all in one secure dashboard.',
    images: ['/logo-og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={workSans.variable}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
