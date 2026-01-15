import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "NextMove",
  description: "Decision assistant to reduce overthinking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <header className="border-b">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">NextMove</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/app" className="hover:underline">App</Link>
              <Link href="/pricing" className="hover:underline">Pricing</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t mt-10">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-600">
            © {new Date().getFullYear()} NextMove
          </div>
        </footer>
      </body>
    </html>
  );
}
