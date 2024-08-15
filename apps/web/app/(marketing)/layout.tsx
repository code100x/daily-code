import React from "react";
import Footer from "../../screens/footer";
import { AppbarClient } from "../../components/AppbarClient";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={`min-h-screen bg-background antialiased`}>
      <AppbarClient />
      {children}
      <Footer />
    </main>
  );
};

export default MarketingLayout;
