import "./globals.css";

export const metadata = {
  title: "Quiz Arena",
  description: "A full-stack practice game built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
