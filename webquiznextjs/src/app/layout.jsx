import Header from '@/components/header';
import "./globals.css";

export const metadata = {
  title: "Quiz",
  description: "Quiz for fagprøve",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`w-full h-full`}>
        <Header/>
        {children}
      </body>
    </html>
  );
}
