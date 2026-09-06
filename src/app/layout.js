import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata = {
  title: "Pizza Lab - Delivery Management Dashboard",
  description: "AI Powered Restaurant Agent & Delivery System - Exact Copy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased min-h-screen">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
