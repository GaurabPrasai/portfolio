import "./globals.css";

export const metadata = {
  title: "Gaurab Prasai",
  description: "A minimal portfolio designed with React + Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
