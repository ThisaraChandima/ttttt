import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

export const metadata = {
  title: 'TuitionRate - Find & Rate the Best Tuition Classes',
  description: 'Sri Lanka\'s premier platform for discovering, comparing, and rating tuition classes. Find the perfect tuition center for Mathematics, Science, English, IT, and more.',
  keywords: 'tuition, rating, review, classes, Sri Lanka, education, mathematics, science, english, tutoring',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ToastProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
