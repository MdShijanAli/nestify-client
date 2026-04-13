import { SiteShell } from "@/components/layout/site-shell";
import { AppProviders } from "@/components/providers/app-providers";
import "../globals.css";
import { CompareBar } from "@/components/compare-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-full flex-col antialiased">
        <AppProviders>
          <SiteShell>{children}</SiteShell>
          <CompareBar />
        </AppProviders>
      </body>
    </html>
  );
}
