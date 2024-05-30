import type { Metadata } from "next";
// import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Visaero SDK Portal",
  description:
    "Visaero - The portal which gives you the ability to integrate the web module, whitelabel solutions, PWA and more...",
};

export default async function EVMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
return (
    <section  className="h-screen w-screen bg-primary">
      {children}
    </section>
)

  
}
