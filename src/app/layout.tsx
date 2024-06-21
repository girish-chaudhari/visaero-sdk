import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans, Roboto as FontRoboto } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";
import { getServerSession } from "next-auth";
import { Toaster } from "@/components/ui/toaster";

// const fontRoboto = FontRoboto({
//   subsets: ["latin"],
//   variable: "--font-sans",
//   weight:["100","300","400","500","700","900"]
// });

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
  title: "Visaero SDK Portal",
  description:
    "Visaero - The portal which gives you the ability to integrate the web module, whitelabel solutions, PWA and more...",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="h-screen w-screen">
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </main>
        {process.env.NODE_ENV === "development" && (
          <script src="http://localhost:8097"></script>
        )}
      </body>
    </html>
  );
}
