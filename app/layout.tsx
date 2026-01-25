// app/layout.tsx
import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "Canna Logic Store",
  description: "Canna Logic storefront and dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
