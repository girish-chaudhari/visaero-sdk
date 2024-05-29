import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ThemeProvider from "@/components/custom/ThemeProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Visaero SDK Portal",
  description:
    "Visaero - The portal which gives you the ability to integrate the web portal in your portal as a module",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="h-screen w-screen bg-primary">
          <Providers>
            {/* <ThemeProvider> */}
              {
            children}
            {/* </ThemeProvider> */}
          </Providers>
        </main>
        {
          process.env.NODE_ENV === "development" && <script src="http://localhost:8097"></script>
        }
      </body>
    </html>
  );
}
